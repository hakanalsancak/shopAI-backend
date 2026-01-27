-- ===========================================
-- ShopAI PostgreSQL Database Schema
-- Designed for Neon PostgreSQL
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Users Table
-- Stores anonymous user data and subscription status
-- ===========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(10) DEFAULT 'UK',
    currency VARCHAR(10) DEFAULT 'GBP',
    free_searches_used INTEGER DEFAULT 0,
    free_searches_limit INTEGER DEFAULT 3,
    subscription_status VARCHAR(20) DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'expired', 'grace_period')),
    subscription_product_id VARCHAR(100),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    subscription_original_transaction_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster device lookups
CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- ===========================================
-- Search History Table
-- Tracks user searches for analytics and limits
-- ===========================================
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(100) NOT NULL,
    subcategory_id VARCHAR(100) NOT NULL,
    query_hash VARCHAR(64) NOT NULL,
    normalized_query JSONB NOT NULL,
    region VARCHAR(10) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search history
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_query_hash ON search_history(query_hash);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- ===========================================
-- Search Cache Table
-- Caches Amazon product results and AI rankings
-- Respects Amazon API policy: no permanent storage
-- ===========================================
CREATE TABLE search_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_hash VARCHAR(64) UNIQUE NOT NULL,
    region VARCHAR(10) NOT NULL,
    amazon_results JSONB NOT NULL,
    ai_rankings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index for cache lookups
CREATE INDEX idx_search_cache_query_hash ON search_cache(query_hash);
CREATE INDEX idx_search_cache_expires_at ON search_cache(expires_at);

-- ===========================================
-- Subscription Receipts Table
-- Stores validated Apple receipts
-- ===========================================
CREATE TABLE subscription_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_transaction_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_trial_period BOOLEAN DEFAULT false,
    is_in_billing_retry BOOLEAN DEFAULT false,
    auto_renew_status BOOLEAN DEFAULT true,
    receipt_data TEXT,
    validated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for receipts
CREATE INDEX idx_subscription_receipts_user_id ON subscription_receipts(user_id);
CREATE INDEX idx_subscription_receipts_original_transaction_id ON subscription_receipts(original_transaction_id);

-- ===========================================
-- Rate Limiting Table
-- Tracks API usage for rate limiting
-- ===========================================
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(identifier, endpoint, window_start)
);

-- Index for rate limit lookups
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, endpoint);

-- ===========================================
-- Analytics Events Table
-- Tracks app events for analytics
-- ===========================================
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for analytics queries
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- ===========================================
-- Cleanup Functions
-- Automatic cleanup of expired cache entries
-- ===========================================

-- Function to clean expired cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM search_cache WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Views for Common Queries
-- ===========================================

-- Active subscribers view
CREATE VIEW active_subscribers AS
SELECT 
    id,
    device_id,
    subscription_product_id,
    subscription_expires_at,
    created_at
FROM users
WHERE subscription_status = 'active'
AND subscription_expires_at > CURRENT_TIMESTAMP;

-- Daily search statistics view
CREATE VIEW daily_search_stats AS
SELECT 
    DATE(created_at) as search_date,
    COUNT(*) as total_searches,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) FILTER (WHERE completed) as completed_searches
FROM search_history
GROUP BY DATE(created_at)
ORDER BY search_date DESC;
