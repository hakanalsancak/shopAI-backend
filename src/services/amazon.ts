// ===========================================
// Amazon Product Advertising API Service
// Supports mock mode for testing
// ===========================================

import { Product, NormalizedQuery, AMAZON_REGIONS, AmazonRegion } from '../types';
import { getMockProducts } from '../data/mockProducts';

// Check if we're in mock mode
const MOCK_MODE = process.env.MOCK_MODE === 'true';

// ===========================================
// Amazon PA-API Configuration
// ===========================================

interface AmazonConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  host: string;
  region: string;
}

function getAmazonConfig(regionCode: string): AmazonConfig {
  const region = AMAZON_REGIONS[regionCode] || AMAZON_REGIONS['UK'];
  
  return {
    accessKey: process.env.AMAZON_ACCESS_KEY || '',
    secretKey: process.env.AMAZON_SECRET_KEY || '',
    partnerTag: regionCode === 'US' 
      ? (process.env.AMAZON_PARTNER_TAG_US || 'shopai-us-20')
      : (process.env.AMAZON_PARTNER_TAG_UK || 'shopai-uk-20'),
    host: region.host,
    region: region.region,
  };
}

// ===========================================
// Product Search
// ===========================================

export async function searchProducts(
  query: NormalizedQuery,
  regionCode: string = 'UK'
): Promise<Product[]> {
  // Use mock data if in mock mode or no API keys
  if (MOCK_MODE || !process.env.AMAZON_ACCESS_KEY) {
    console.log('[Amazon] Using mock mode');
    return getMockProducts(
      query.keywords,
      regionCode,
      query.filters.priceMin,
      query.filters.priceMax
    );
  }

  // Real Amazon PA-API implementation
  return await searchAmazonProducts(query, regionCode);
}

// ===========================================
// Real Amazon PA-API Implementation
// ===========================================

async function searchAmazonProducts(
  query: NormalizedQuery,
  regionCode: string
): Promise<Product[]> {
  const config = getAmazonConfig(regionCode);
  const amazonRegion = AMAZON_REGIONS[regionCode] || AMAZON_REGIONS['UK'];
  
  // Build search request
  const searchRequest = {
    Keywords: query.keywords.join(' '),
    SearchIndex: getCategorySearchIndex(query.categoryPath),
    ItemCount: 10,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Offers.Listings.Price',
      'Offers.Listings.SavingBasis',
      'Offers.Listings.DeliveryInfo.IsPrimeEligible',
      'Offers.Listings.Availability.Message',
      'CustomerReviews.Count',
      'CustomerReviews.StarRating',
    ],
    PartnerTag: config.partnerTag,
    PartnerType: 'Associates',
    Marketplace: `www.amazon.${regionCode === 'US' ? 'com' : 'co.uk'}`,
  };

  // Add price filter if specified
  if (query.filters.priceMin !== undefined || query.filters.priceMax !== undefined) {
    (searchRequest as any).MinPrice = query.filters.priceMin 
      ? Math.floor(query.filters.priceMin * 100) 
      : undefined;
    (searchRequest as any).MaxPrice = query.filters.priceMax 
      ? Math.floor(query.filters.priceMax * 100) 
      : undefined;
  }

  // Add brand filter if specified
  if (query.filters.brand && query.filters.brand.length > 0) {
    (searchRequest as any).Brand = query.filters.brand[0];
  }

  // Sort by relevance or price
  if (query.filters.sortBy === 'price_low') {
    (searchRequest as any).SortBy = 'Price:LowToHigh';
  } else if (query.filters.sortBy === 'price_high') {
    (searchRequest as any).SortBy = 'Price:HighToLow';
  }

  try {
    // Sign and send request to Amazon PA-API
    const response = await makeAmazonRequest(
      'SearchItems',
      searchRequest,
      config
    );

    return parseAmazonResponse(response, amazonRegion);
  } catch (error) {
    console.error('[Amazon] API error:', error);
    // Fallback to mock data on error
    return getMockProducts(
      query.keywords,
      regionCode,
      query.filters.priceMin,
      query.filters.priceMax
    );
  }
}

// ===========================================
// Amazon API Request Signing (AWS Signature v4)
// ===========================================

async function makeAmazonRequest(
  operation: string,
  payload: any,
  config: AmazonConfig
): Promise<any> {
  const endpoint = `https://${config.host}/paapi5/${operation.toLowerCase()}`;
  const body = JSON.stringify(payload);
  
  // Get current timestamp
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  
  // Create canonical request
  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    'content-encoding': 'amz-1.0',
    'host': config.host,
    'x-amz-date': amzDate,
    'x-amz-target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
  };
  
  // Sign the request (simplified - in production use proper AWS4 signing)
  const signature = await signRequest(
    'POST',
    endpoint,
    headers,
    body,
    config,
    dateStamp,
    amzDate
  );
  
  headers['Authorization'] = signature;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amazon API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  config: AmazonConfig,
  dateStamp: string,
  amzDate: string
): Promise<string> {
  // AWS Signature Version 4 signing
  // This is a simplified version - use aws4 library in production
  
  const service = 'ProductAdvertisingAPI';
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${config.region}/${service}/aws4_request`;
  
  // Create canonical headers
  const sortedHeaders = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaders
    .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
    .join('\n') + '\n';
  const signedHeaders = sortedHeaders.map(h => h.toLowerCase()).join(';');
  
  // Create canonical request
  const urlObj = new URL(url);
  const canonicalUri = urlObj.pathname;
  const canonicalQuerystring = '';
  
  const payloadHash = await sha256(body);
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  
  // Create string to sign
  const requestHash = await sha256(canonicalRequest);
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    requestHash,
  ].join('\n');
  
  // Calculate signature
  const kDate = await hmacSha256(`AWS4${config.secretKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, config.region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  const signature = await hmacSha256Hex(kSigning, stringToSign);
  
  return `${algorithm} Credential=${config.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

// Crypto helpers
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: string | ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = typeof key === 'string' ? encoder.encode(key) : key;
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return crypto.subtle.sign('HMAC', cryptoKey, messageData);
}

async function hmacSha256Hex(key: ArrayBuffer, message: string): Promise<string> {
  const result = await hmacSha256(key, message);
  return Array.from(new Uint8Array(result))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ===========================================
// Response Parsing
// ===========================================

function parseAmazonResponse(response: any, region: AmazonRegion): Product[] {
  const items = response?.SearchResult?.Items || [];
  
  return items.map((item: any) => {
    const listing = item.Offers?.Listings?.[0];
    const price = listing?.Price?.Amount || 0;
    const originalPrice = listing?.SavingBasis?.Amount;
    
    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
      price: price,
      currency: region.currency,
      originalPrice: originalPrice,
      imageUrl: item.Images?.Primary?.Large?.URL || '',
      rating: parseFloat(item.CustomerReviews?.StarRating?.Value) || 0,
      reviewCount: parseInt(item.CustomerReviews?.Count?.Value) || 0,
      amazonUrl: item.DetailPageURL || `https://${region.marketplace}/dp/${item.ASIN}`,
      isPrime: listing?.DeliveryInfo?.IsPrimeEligible || false,
      availability: listing?.Availability?.Message || 'Check Amazon',
      features: item.ItemInfo?.Features?.DisplayValues || [],
    };
  });
}

// ===========================================
// Helper Functions
// ===========================================

function getCategorySearchIndex(categoryPath: string[]): string {
  // Map our categories to Amazon search indexes
  const categoryMap: Record<string, string> = {
    'electronics': 'Electronics',
    'phones': 'Electronics',
    'laptops': 'Computers',
    'tablets': 'Computers',
    'headphones': 'Electronics',
    'smartwatches': 'Electronics',
    'home': 'HomeAndKitchen',
    'vacuum': 'HomeAndKitchen',
    'coffee': 'HomeAndKitchen',
    'airfryer': 'HomeAndKitchen',
    'beauty': 'Beauty',
    'skincare': 'Beauty',
    'haircare': 'Beauty',
    'fitness': 'SportingGoods',
    'homegym': 'SportingGoods',
    'running': 'Fashion',
    'toys': 'ToysAndGames',
    'kidstoys': 'ToysAndGames',
    'videogames': 'VideoGames',
    'fashion': 'Fashion',
    'watches': 'Watches',
    'bags': 'Fashion',
  };

  for (const cat of categoryPath) {
    if (categoryMap[cat]) {
      return categoryMap[cat];
    }
  }

  return 'All'; // Default to all categories
}

// ===========================================
// URL Generation with Affiliate Tag
// ===========================================

export function generateAffiliateUrl(asin: string, regionCode: string): string {
  const region = AMAZON_REGIONS[regionCode] || AMAZON_REGIONS['UK'];
  const partnerTag = regionCode === 'US'
    ? (process.env.AMAZON_PARTNER_TAG_US || 'shopai-us-20')
    : (process.env.AMAZON_PARTNER_TAG_UK || 'shopai-uk-20');
  
  return `https://${region.marketplace}/dp/${asin}?tag=${partnerTag}`;
}
