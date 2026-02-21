// ===========================================
// Zokey Type Definitions
// ===========================================

// =====================
// Category Types
// =====================

export interface Category {
  id: string;
  name: string;
  icon: string; // SF Symbol name for iOS
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  categoryId: string;
  questionFlow: QuestionFlowConfig;
}

// =====================
// Question Flow Types
// =====================

export interface QuestionFlowConfig {
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single_select' | 'multi_select' | 'range' | 'brand_select' | 'text_input';
  required: boolean;
  options?: QuestionOption[];
  rangeConfig?: RangeConfig;
  dynamicOptions?: boolean;
  placeholder?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface RangeConfig {
  min: number;
  max: number;
  step: number;
  currency: string;
  presets: { label: string; min: number; max: number }[];
}

// =====================
// User & Session Types
// =====================

export interface User {
  id: string;
  deviceId: string;
  region: string;
  currency: string;
  freeSearchesUsed: number;
  freeSearchesLimit: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'grace_period';

export interface SessionToken {
  userId: string;
  deviceId: string;
  region: string;
  exp: number;
}

// =====================
// Search & Product Types
// =====================

export interface SearchRequest {
  subcategoryId: string;
  answers: SearchAnswer[];
  region: string;
}

export interface SearchAnswer {
  questionId: string;
  value: string | string[] | { min: number; max: number };
}

export interface NormalizedQuery {
  keywords: string[];
  filters: {
    brand?: string[];
    priceMin?: number;
    priceMax?: number;
    sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating';
  };
  categoryPath: string[];
}

export interface Product {
  asin: string;
  title: string;
  price: number;
  currency: string;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  amazonUrl: string;
  isPrime: boolean;
  availability: string;
  features: string[];
}

export interface RankedProduct extends Product {
  rank: number;
  matchScore: number;
  explanation: string;
  pros: string[];
  cons: string[];
}

// =====================
// Recommendation Types
// =====================

export interface RecommendationResponse {
  searchId: string;
  products: RankedProduct[];
  summary: string;
  searchCriteria: {
    category: string;
    subcategory: string;
    budget: string;
    priorities: string[];
  };
  disclaimer: string;
  timestamp: string;
}

// =====================
// Subscription Types
// =====================

export interface SubscriptionPlan {
  id: string;
  name: string;
  productId: string; // Apple product ID
  price: number;
  currency: string;
  period: 'weekly' | 'yearly';
  features: string[];
}

export interface ReceiptValidationRequest {
  receiptData: string;
  transactionId?: string;
}

export interface ReceiptValidationResponse {
  valid: boolean;
  subscriptionStatus: SubscriptionStatus;
  expiresAt: string | null;
  productId: string | null;
  error?: string;
}

// =====================
// API Response Types
// =====================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface UserStatusResponse {
  userId: string;
  freeSearchesRemaining: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: string | null;
  canSearch: boolean;
}

// =====================
// Amazon API Types
// =====================

export interface AmazonRegion {
  host: string;
  region: string;
  partnerTag: string;
  marketplace: string;
  currency: string;
}

export const AMAZON_REGIONS: Record<string, AmazonRegion> = {
  UK: {
    host: 'webservices.amazon.co.uk',
    region: 'eu-west-1',
    partnerTag: process.env.AMAZON_PARTNER_TAG_UK || '',
    marketplace: 'www.amazon.co.uk',
    currency: 'GBP',
  },
  US: {
    host: 'webservices.amazon.com',
    region: 'us-east-1',
    partnerTag: process.env.AMAZON_PARTNER_TAG_US || '',
    marketplace: 'www.amazon.com',
    currency: 'USD',
  },
};

// =====================
// Cache Types
// =====================

export interface CacheEntry<T> {
  data: T;
  expiresAt: Date;
  queryHash: string;
}
