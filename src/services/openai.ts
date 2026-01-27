// ===========================================
// OpenAI Service for Product Ranking
// Used ONLY for ranking and explaining recommendations
// ===========================================

import OpenAI from 'openai';
import { Product, RankedProduct, SearchAnswer } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check if we're in mock mode
const MOCK_MODE = process.env.MOCK_MODE === 'true';

// ===========================================
// Rank Products with AI
// ===========================================

export interface RankingRequest {
  products: Product[];
  userPreferences: {
    subcategoryName: string;
    answers: SearchAnswer[];
    priorities: string[];
    budget: { min: number; max: number };
  };
  region: string;
}

export interface RankingResponse {
  rankedProducts: RankedProduct[];
  summary: string;
}

export async function rankProducts(request: RankingRequest): Promise<RankingResponse> {
  // Use mock rankings in mock mode or if no API key
  if (MOCK_MODE || !process.env.OPENAI_API_KEY) {
    console.log('[OpenAI] Using mock mode');
    return mockRankProducts(request);
  }

  return await aiRankProducts(request);
}

// ===========================================
// Real OpenAI Implementation
// ===========================================

async function aiRankProducts(request: RankingRequest): Promise<RankingResponse> {
  const { products, userPreferences } = request;

  // Build the prompt
  const systemPrompt = `You are an expert product recommendation assistant. Your task is to rank products based on user preferences and explain why each product is recommended.

IMPORTANT RULES:
1. You MUST only rank products from the provided list - never invent or suggest other products
2. You MUST use the exact prices and specifications provided - never make up prices or features
3. Your explanations should be helpful, honest, and based only on the product information provided
4. Consider the user's stated priorities when ranking
5. Always return valid JSON in the exact format specified

You will receive:
- A list of products with their details (from Amazon)
- User preferences (budget, priorities, category)

You must return a JSON object with:
- rankedProducts: array of products ranked by relevance (best match first)
- summary: a brief 1-2 sentence summary of the recommendations`;

  const userPrompt = `Please rank these products for a user looking for: ${userPreferences.subcategoryName}

USER PREFERENCES:
- Budget: ${userPreferences.budget.min} to ${userPreferences.budget.max} ${request.region === 'US' ? 'USD' : 'GBP'}
- Priorities: ${userPreferences.priorities.join(', ')}
- Additional preferences: ${formatAnswers(userPreferences.answers)}

PRODUCTS TO RANK (from Amazon):
${formatProductsForPrompt(products)}

Return EXACTLY this JSON structure:
{
  "rankedProducts": [
    {
      "asin": "product ASIN",
      "rank": 1,
      "matchScore": 0-100,
      "explanation": "2-3 sentences why this product matches user needs",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"]
    }
  ],
  "summary": "Brief summary of the recommendations"
}

Rank the top 5 products only. Return ONLY valid JSON, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent rankings
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    // Merge AI rankings with full product data
    const rankedProducts: RankedProduct[] = parsed.rankedProducts
      .slice(0, 5)
      .map((ranking: any) => {
        const product = products.find(p => p.asin === ranking.asin);
        if (!product) {
          console.warn(`Product ${ranking.asin} not found in original list`);
          return null;
        }
        return {
          ...product,
          rank: ranking.rank,
          matchScore: ranking.matchScore,
          explanation: ranking.explanation,
          pros: ranking.pros || [],
          cons: ranking.cons || [],
        };
      })
      .filter(Boolean);

    return {
      rankedProducts,
      summary: parsed.summary,
    };
  } catch (error) {
    console.error('[OpenAI] Error:', error);
    // Fallback to mock ranking on error
    return mockRankProducts(request);
  }
}

// ===========================================
// Mock Ranking (for testing)
// ===========================================

function mockRankProducts(request: RankingRequest): RankingResponse {
  const { products, userPreferences } = request;
  
  // Simple scoring based on price and rating
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Price score (higher score if within budget)
    const { min, max } = userPreferences.budget;
    if (product.price >= min && product.price <= max) {
      score += 40;
    } else if (product.price < min) {
      score += 20; // Under budget is okay
    }
    
    // Rating score
    score += product.rating * 10;
    
    // Review count score (popularity)
    score += Math.min(product.reviewCount / 1000, 10);
    
    // Prime bonus
    if (product.isPrime) score += 5;
    
    return { product, score };
  });

  // Sort by score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top 5
  const rankedProducts: RankedProduct[] = scoredProducts
    .slice(0, 5)
    .map((item, index) => ({
      ...item.product,
      rank: index + 1,
      matchScore: Math.round(item.score),
      explanation: generateMockExplanation(item.product, userPreferences, index + 1),
      pros: generateMockPros(item.product),
      cons: generateMockCons(item.product),
    }));

  const topProduct = rankedProducts[0];
  const summary = `Based on your preferences for ${userPreferences.subcategoryName}, we recommend the ${topProduct?.title.split(' ').slice(0, 4).join(' ')} as the best match. It offers excellent value within your budget with strong ratings.`;

  return {
    rankedProducts,
    summary,
  };
}

function generateMockExplanation(
  product: Product,
  preferences: RankingRequest['userPreferences'],
  rank: number
): string {
  const budget = preferences.budget;
  const priceStatus = product.price <= budget.max 
    ? 'within your budget' 
    : 'slightly above budget but worth considering';

  if (rank === 1) {
    return `This is our top recommendation because it perfectly balances quality and value. With a ${product.rating}-star rating from ${product.reviewCount.toLocaleString()} reviews, it's ${priceStatus} and highly regarded by customers.`;
  } else if (rank <= 3) {
    return `A strong contender with ${product.rating} stars and ${product.reviewCount.toLocaleString()} reviews. It's ${priceStatus} and offers good performance for your needs.`;
  } else {
    return `Worth considering as an alternative option. Rated ${product.rating} stars with ${product.reviewCount.toLocaleString()} reviews, it provides good value ${priceStatus}.`;
  }
}

function generateMockPros(product: Product): string[] {
  const pros: string[] = [];
  
  if (product.rating >= 4.5) {
    pros.push('Excellent customer ratings');
  } else if (product.rating >= 4.0) {
    pros.push('Strong customer reviews');
  }
  
  if (product.reviewCount > 5000) {
    pros.push('Very popular choice with many reviews');
  } else if (product.reviewCount > 1000) {
    pros.push('Well-reviewed by many customers');
  }
  
  if (product.isPrime) {
    pros.push('Prime delivery available');
  }
  
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    pros.push(`Currently ${discount}% off`);
  }
  
  if (product.features && product.features.length > 0) {
    pros.push(product.features[0]);
  }
  
  return pros.slice(0, 4);
}

function generateMockCons(product: Product): string[] {
  const cons: string[] = [];
  
  if (product.rating < 4.0) {
    cons.push('Mixed customer reviews');
  }
  
  if (!product.isPrime) {
    cons.push('Not eligible for Prime delivery');
  }
  
  if (product.reviewCount < 500) {
    cons.push('Limited customer feedback available');
  }
  
  // Add a generic con if we don't have any
  if (cons.length === 0) {
    cons.push('May have limited color/size options');
  }
  
  return cons.slice(0, 2);
}

// ===========================================
// Helper Functions
// ===========================================

function formatProductsForPrompt(products: Product[]): string {
  return products
    .map((p, i) => `
${i + 1}. ASIN: ${p.asin}
   Title: ${p.title}
   Price: ${p.currency} ${p.price.toFixed(2)}${p.originalPrice ? ` (was ${p.originalPrice.toFixed(2)})` : ''}
   Rating: ${p.rating}/5 (${p.reviewCount.toLocaleString()} reviews)
   Prime: ${p.isPrime ? 'Yes' : 'No'}
   Features: ${p.features.slice(0, 3).join('; ')}
`)
    .join('\n');
}

function formatAnswers(answers: SearchAnswer[]): string {
  return answers
    .filter(a => a.questionId !== 'budget' && a.questionId !== 'priorities')
    .map(a => {
      if (typeof a.value === 'object' && 'min' in a.value) {
        return `${a.questionId}: ${a.value.min}-${a.value.max}`;
      }
      if (Array.isArray(a.value)) {
        return `${a.questionId}: ${a.value.join(', ')}`;
      }
      return `${a.questionId}: ${a.value}`;
    })
    .join(', ');
}
