// ===========================================
// Database Connection & Queries
// Uses Neon serverless driver
// ===========================================

import { neon } from '@neondatabase/serverless';
import { User, SubscriptionStatus, NormalizedQuery } from '../types';

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL || '');

// ===========================================
// User Operations
// ===========================================

export async function createUser(deviceId: string, region: string, currency: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (device_id, region, currency)
    VALUES (${deviceId}, ${region}, ${currency})
    ON CONFLICT (device_id) DO UPDATE SET
      region = ${region},
      currency = ${currency},
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return mapUserRow(result[0]);
}

export async function getUserByDeviceId(deviceId: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE device_id = ${deviceId}
  `;
  return result.length > 0 ? mapUserRow(result[0]) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;
  return result.length > 0 ? mapUserRow(result[0]) : null;
}

export async function incrementUserSearchCount(userId: string): Promise<User | null> {
  const result = await sql`
    UPDATE users 
    SET free_searches_used = free_searches_used + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
    RETURNING *
  `;
  return result.length > 0 ? mapUserRow(result[0]) : null;
}

export async function updateUserSubscription(
  userId: string,
  status: SubscriptionStatus,
  productId: string | null,
  expiresAt: Date | null,
  originalTransactionId: string | null
): Promise<User | null> {
  const result = await sql`
    UPDATE users 
    SET 
      subscription_status = ${status},
      subscription_product_id = ${productId},
      subscription_expires_at = ${expiresAt?.toISOString() || null},
      subscription_original_transaction_id = ${originalTransactionId},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
    RETURNING *
  `;
  return result.length > 0 ? mapUserRow(result[0]) : null;
}

// ===========================================
// Search History Operations
// ===========================================

export async function createSearchHistory(
  userId: string,
  categoryId: string,
  subcategoryId: string,
  queryHash: string,
  normalizedQuery: NormalizedQuery,
  region: string
): Promise<string> {
  const result = await sql`
    INSERT INTO search_history (user_id, category_id, subcategory_id, query_hash, normalized_query, region)
    VALUES (${userId}, ${categoryId}, ${subcategoryId}, ${queryHash}, ${JSON.stringify(normalizedQuery)}, ${region})
    RETURNING id
  `;
  return result[0].id;
}

export async function markSearchCompleted(searchId: string): Promise<void> {
  await sql`
    UPDATE search_history SET completed = true WHERE id = ${searchId}
  `;
}

export async function getUserSearchCount(userId: string): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count FROM search_history 
    WHERE user_id = ${userId} AND completed = true
  `;
  return parseInt(result[0].count);
}

// ===========================================
// Cache Operations
// ===========================================

interface CacheData {
  amazonResults: any;
  aiRankings: any;
}

export async function getCachedSearch(queryHash: string, region: string): Promise<CacheData | null> {
  const result = await sql`
    SELECT amazon_results, ai_rankings FROM search_cache
    WHERE query_hash = ${queryHash} 
    AND region = ${region}
    AND expires_at > CURRENT_TIMESTAMP
  `;
  
  if (result.length === 0) return null;
  
  return {
    amazonResults: result[0].amazon_results,
    aiRankings: result[0].ai_rankings,
  };
}

export async function setCachedSearch(
  queryHash: string,
  region: string,
  amazonResults: any,
  aiRankings: any,
  ttlHours: number = 1 // Default 1 hour cache (Amazon policy compliant)
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  
  await sql`
    INSERT INTO search_cache (query_hash, region, amazon_results, ai_rankings, expires_at)
    VALUES (${queryHash}, ${region}, ${JSON.stringify(amazonResults)}, ${JSON.stringify(aiRankings)}, ${expiresAt.toISOString()})
    ON CONFLICT (query_hash) DO UPDATE SET
      amazon_results = ${JSON.stringify(amazonResults)},
      ai_rankings = ${JSON.stringify(aiRankings)},
      expires_at = ${expiresAt.toISOString()}
  `;
}

// ===========================================
// Subscription Receipt Operations
// ===========================================

export async function saveSubscriptionReceipt(
  userId: string,
  originalTransactionId: string,
  productId: string,
  purchaseDate: Date,
  expiresDate: Date,
  isTrialPeriod: boolean,
  receiptData: string
): Promise<void> {
  await sql`
    INSERT INTO subscription_receipts 
    (user_id, original_transaction_id, product_id, purchase_date, expires_date, is_trial_period, receipt_data)
    VALUES (${userId}, ${originalTransactionId}, ${productId}, ${purchaseDate.toISOString()}, ${expiresDate.toISOString()}, ${isTrialPeriod}, ${receiptData})
    ON CONFLICT (original_transaction_id) DO UPDATE SET
      expires_date = ${expiresDate.toISOString()},
      validated_at = CURRENT_TIMESTAMP
  `;
}

// ===========================================
// Rate Limiting
// ===========================================

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  
  const result = await sql`
    SELECT COUNT(*) as count FROM rate_limits
    WHERE identifier = ${identifier}
    AND endpoint = ${endpoint}
    AND window_start > ${windowStart.toISOString()}
  `;
  
  const count = parseInt(result[0].count);
  
  if (count >= maxRequests) {
    return false; // Rate limited
  }
  
  // Record this request
  await sql`
    INSERT INTO rate_limits (identifier, endpoint)
    VALUES (${identifier}, ${endpoint})
  `;
  
  return true; // Allowed
}

// ===========================================
// Analytics
// ===========================================

export async function trackEvent(
  userId: string | null,
  eventType: string,
  eventData: any
): Promise<void> {
  await sql`
    INSERT INTO analytics_events (user_id, event_type, event_data)
    VALUES (${userId}, ${eventType}, ${JSON.stringify(eventData)})
  `;
}

// ===========================================
// Cleanup
// ===========================================

export async function cleanupExpiredCache(): Promise<number> {
  const result = await sql`
    DELETE FROM search_cache WHERE expires_at < CURRENT_TIMESTAMP
    RETURNING id
  `;
  return result.length;
}

// ===========================================
// Helper Functions
// ===========================================

function mapUserRow(row: any): User {
  return {
    id: row.id,
    deviceId: row.device_id,
    region: row.region,
    currency: row.currency,
    freeSearchesUsed: row.free_searches_used,
    freeSearchesLimit: row.free_searches_limit,
    subscriptionStatus: row.subscription_status as SubscriptionStatus,
    subscriptionExpiresAt: row.subscription_expires_at ? new Date(row.subscription_expires_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
