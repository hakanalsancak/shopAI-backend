// ===========================================
// Query Normalizer Service
// Converts user answers into searchable queries
// ===========================================

import { SearchAnswer, NormalizedQuery } from '../types';
import { getCategories, getSubcategoryById } from '../data/categories';
import crypto from 'crypto';

// ===========================================
// Main Normalization Function
// ===========================================

export function normalizeQuery(
  subcategoryId: string,
  answers: SearchAnswer[],
  region: string = 'UK'
): NormalizedQuery {
  const currency = region === 'US' ? 'USD' : 'GBP';
  const categories = getCategories(currency);
  const result = getSubcategoryById(categories, subcategoryId);

  if (!result) {
    throw new Error(`Subcategory not found: ${subcategoryId}`);
  }

  const { category, subcategory } = result;
  const keywords: string[] = [];
  const filters: NormalizedQuery['filters'] = {};

  // Add base keywords from subcategory
  keywords.push(subcategory.name);

  // Process each answer
  for (const answer of answers) {
    switch (answer.questionId) {
      case 'brand':
        if (answer.value && answer.value !== 'any') {
          const brandValue = String(answer.value);
          filters.brand = [brandValue];
          keywords.push(brandValue);
        }
        break;

      case 'budget':
        if (typeof answer.value === 'object' && 'min' in answer.value) {
          filters.priceMin = answer.value.min;
          filters.priceMax = answer.value.max;
        }
        break;

      case 'priorities':
        // Priorities are used for AI ranking, not search
        break;

      case 'type':
      case 'style':
      case 'usage':
      case 'concern':
      case 'skintype':
      case 'age':
      case 'platform':
      case 'genre':
      case 'phone':
      case 'wireless':
      case 'size':
        // Add answer values as keywords
        if (answer.value) {
          if (Array.isArray(answer.value)) {
            keywords.push(...answer.value);
          } else {
            keywords.push(String(answer.value));
          }
        }
        break;

      default:
        // Unknown question - add value as keyword if string
        if (typeof answer.value === 'string' && answer.value !== 'any') {
          keywords.push(answer.value);
        }
    }
  }

  // Clean and deduplicate keywords
  const cleanedKeywords = keywords
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0 && k !== 'any' && k !== 'no preference')
    .filter((k, i, arr) => arr.indexOf(k) === i); // Deduplicate

  return {
    keywords: cleanedKeywords,
    filters,
    categoryPath: [category.id, subcategory.id],
  };
}

// ===========================================
// Query Hash Generation
// For caching purposes
// ===========================================

export function generateQueryHash(query: NormalizedQuery, region: string): string {
  const hashInput = JSON.stringify({
    keywords: query.keywords.sort(),
    filters: query.filters,
    categoryPath: query.categoryPath,
    region,
  });

  return crypto
    .createHash('sha256')
    .update(hashInput)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for readability
}

// ===========================================
// Extract Priorities from Answers
// ===========================================

export function extractPriorities(answers: SearchAnswer[]): string[] {
  const prioritiesAnswer = answers.find(a => a.questionId === 'priorities');
  
  if (!prioritiesAnswer || !prioritiesAnswer.value) {
    return [];
  }

  if (Array.isArray(prioritiesAnswer.value)) {
    return prioritiesAnswer.value;
  }

  return [String(prioritiesAnswer.value)];
}

// ===========================================
// Extract Budget from Answers
// ===========================================

export function extractBudget(answers: SearchAnswer[]): { min: number; max: number } {
  const budgetAnswer = answers.find(a => a.questionId === 'budget');
  
  if (!budgetAnswer || !budgetAnswer.value) {
    return { min: 0, max: 10000 }; // Default wide range
  }

  if (typeof budgetAnswer.value === 'object' && 'min' in budgetAnswer.value) {
    return budgetAnswer.value;
  }

  return { min: 0, max: 10000 };
}

// ===========================================
// Get Subcategory Display Name
// ===========================================

export function getSubcategoryName(subcategoryId: string, currency: string = 'GBP'): string {
  const categories = getCategories(currency);
  const result = getSubcategoryById(categories, subcategoryId);
  
  if (!result) {
    return subcategoryId;
  }

  return result.subcategory.name;
}
