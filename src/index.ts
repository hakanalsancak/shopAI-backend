// ===========================================
// Zokey Backend API - Main Entry Point
// Vercel Serverless Compatible
// ===========================================

import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { 
  APIResponse, 
  SearchRequest, 
  UserStatusResponse,
  RecommendationResponse,
  SessionToken,
  SubscriptionStatus,
} from './types';

import { getCategories, getSubcategoryById } from './data/categories';
import { 
  createUser, 
  getUserByDeviceId, 
  getUserById,
  incrementUserSearchCount,
  resetUserSearchCount,
  updateUserSubscription,
  createSearchHistory,
  markSearchCompleted,
  getCachedSearch,
  setCachedSearch,
  checkRateLimit,
  trackEvent,
} from './db';
import { searchProducts } from './services/amazon';
import { rankProducts, RankingRequest } from './services/openai';
import { validateReceipt, SUBSCRIPTION_PRODUCTS } from './services/apple';
import { 
  normalizeQuery, 
  generateQueryHash, 
  extractPriorities, 
  extractBudget,
  getSubcategoryName,
} from './services/queryNormalizer';

// ===========================================
// Express App Setup
// ===========================================

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Large limit for receipts

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// ===========================================
// Request Validation Schemas
// ===========================================

const RegisterSchema = z.object({
  deviceId: z.string().min(1),
  region: z.string().default('UK'),
  currency: z.string().default('GBP'),
});

const SearchSchema = z.object({
  subcategoryId: z.string().min(1),
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.union([
      z.string(),
      z.array(z.string()),
      z.object({ min: z.number(), max: z.number() }),
    ]),
  })),
});

const ReceiptSchema = z.object({
  receiptData: z.string().min(1),
});

// ===========================================
// Authentication Middleware
// ===========================================

interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionToken?: SessionToken;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' },
    } as APIResponse<null>);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionToken;
    req.userId = decoded.userId;
    req.sessionToken = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    } as APIResponse<null>);
  }
}

// ===========================================
// Rate Limiting Middleware
// ===========================================

async function rateLimitMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const identifier = req.userId || req.ip || 'anonymous';
  const endpoint = req.path;

  try {
    const allowed = await checkRateLimit(identifier, endpoint, 60, 1); // 60 requests per minute
    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests' },
      } as APIResponse<null>);
    }
    next();
  } catch (error) {
    // If rate limiting fails, allow the request
    console.error('Rate limit check failed:', error);
    next();
  }
}

// ===========================================
// API Routes
// ===========================================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===========================================
// Auth Routes
// ===========================================

// Register/Login device
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    
    // Create or update user
    const user = await createUser(data.deviceId, data.region, data.currency);
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        deviceId: user.deviceId,
        region: user.region,
      } as SessionToken,
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Track registration event
    await trackEvent(user.id, 'user_registered', { region: data.region });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          freeSearchesRemaining: user.freeSearchesLimit - user.freeSearchesUsed,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionExpiresAt: user.subscriptionExpiresAt?.toISOString() || null,
        },
      },
    } as APIResponse<any>);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: { code: 'REGISTRATION_FAILED', message: 'Failed to register device' },
    } as APIResponse<null>);
  }
});

// Get user status
app.get('/api/auth/status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getUserById(req.userId!);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      } as APIResponse<null>);
    }

    const canSearch = user.subscriptionStatus === 'active' || 
                      user.freeSearchesUsed < user.freeSearchesLimit;

    res.json({
      success: true,
      data: {
        userId: user.id,
        freeSearchesRemaining: Math.max(0, user.freeSearchesLimit - user.freeSearchesUsed),
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt?.toISOString() || null,
        canSearch,
      } as UserStatusResponse,
    } as APIResponse<UserStatusResponse>);
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to get status' },
    } as APIResponse<null>);
  }
});

// Reset free searches (TESTING ONLY - remove in production)
app.post('/api/auth/reset-searches', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await resetUserSearchCount(req.userId!);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      } as APIResponse<null>);
    }

    const canSearch = user.subscriptionStatus === 'active' || 
                      user.freeSearchesUsed < user.freeSearchesLimit;

    res.json({
      success: true,
      data: {
        userId: user.id,
        freeSearchesRemaining: user.freeSearchesLimit - user.freeSearchesUsed,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt?.toISOString() || null,
        canSearch,
      } as UserStatusResponse,
    } as APIResponse<UserStatusResponse>);
  } catch (error) {
    console.error('Reset searches error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to reset searches' },
    } as APIResponse<null>);
  }
});

// ===========================================
// Category Routes
// ===========================================

// Get all categories
app.get('/api/categories', (req: Request, res: Response) => {
  const currency = (req.query.currency as string) || 'GBP';
  const categories = getCategories(currency);

  res.json({
    success: true,
    data: categories,
  } as APIResponse<any>);
});

// Get subcategory questions
app.get('/api/categories/:subcategoryId/questions', (req: Request, res: Response) => {
  const { subcategoryId } = req.params;
  const currency = (req.query.currency as string) || 'GBP';
  
  const categories = getCategories(currency);
  const result = getSubcategoryById(categories, subcategoryId);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Subcategory not found' },
    } as APIResponse<null>);
  }

  res.json({
    success: true,
    data: {
      subcategoryId,
      subcategoryName: result.subcategory.name,
      categoryName: result.category.name,
      questions: result.subcategory.questionFlow.questions,
    },
  } as APIResponse<any>);
});

// ===========================================
// Search Routes
// ===========================================

// Perform product search and get recommendations
app.post(
  '/api/search',
  authenticateToken,
  rateLimitMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const searchData = SearchSchema.parse(req.body);
      const user = await getUserById(req.userId!);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' },
        } as APIResponse<null>);
      }

      // Check if user can search
      const canSearch = user.subscriptionStatus === 'active' ||
                        user.freeSearchesUsed < user.freeSearchesLimit;

      if (!canSearch) {
        return res.status(403).json({
          success: false,
          error: { 
            code: 'LIMIT_REACHED', 
            message: 'Free search limit reached. Please subscribe to continue.',
          },
        } as APIResponse<null>);
      }

      const region = req.sessionToken?.region || 'UK';
      const currency = region === 'US' ? 'USD' : 'GBP';

      // Normalize the query
      const normalizedQuery = normalizeQuery(searchData.subcategoryId, searchData.answers, region);
      const queryHash = generateQueryHash(normalizedQuery, region);

      // Check cache
      const cached = await getCachedSearch(queryHash, region);
      
      let products;
      let rankedResult;

      if (cached && cached.aiRankings) {
        // Use cached data
        console.log('[Search] Using cached results');
        products = cached.amazonResults;
        rankedResult = cached.aiRankings;
      } else {
        // Fetch from Amazon
        console.log('[Search] Fetching new results');
        products = await searchProducts(normalizedQuery, region);

        if (products.length === 0) {
          return res.status(404).json({
            success: false,
            error: { code: 'NO_PRODUCTS', message: 'No products found matching your criteria' },
          } as APIResponse<null>);
        }

        // Rank with AI
        const rankingRequest: RankingRequest = {
          products,
          userPreferences: {
            subcategoryName: getSubcategoryName(searchData.subcategoryId, currency),
            answers: searchData.answers,
            priorities: extractPriorities(searchData.answers),
            budget: extractBudget(searchData.answers),
          },
          region,
        };

        rankedResult = await rankProducts(rankingRequest);

        // Cache the results (1 hour TTL)
        await setCachedSearch(queryHash, region, products, rankedResult, 1);
      }

      // Create search history record
      const categories = getCategories(currency);
      const subcategoryResult = getSubcategoryById(categories, searchData.subcategoryId);
      const categoryId = subcategoryResult?.category.id || 'unknown';

      const searchId = await createSearchHistory(
        user.id,
        categoryId,
        searchData.subcategoryId,
        queryHash,
        normalizedQuery,
        region
      );

      // Mark search as completed and increment counter (only for non-subscribers)
      await markSearchCompleted(searchId);
      
      if (user.subscriptionStatus !== 'active') {
        await incrementUserSearchCount(user.id);
      }

      // Track search event
      await trackEvent(user.id, 'search_completed', {
        subcategoryId: searchData.subcategoryId,
        queryHash,
        productCount: rankedResult.rankedProducts.length,
      });

      // Build response
      const budget = extractBudget(searchData.answers);
      const priorities = extractPriorities(searchData.answers);

      const response: RecommendationResponse = {
        searchId,
        products: rankedResult.rankedProducts,
        summary: rankedResult.summary,
        searchCriteria: {
          category: subcategoryResult?.category.name || 'Unknown',
          subcategory: subcategoryResult?.subcategory.name || 'Unknown',
          budget: `${currency === 'GBP' ? '£' : '$'}${budget.min} - ${currency === 'GBP' ? '£' : '$'}${budget.max}`,
          priorities,
        },
        disclaimer: 'Prices and availability are subject to change. All purchases are made through Amazon. We earn a commission from qualifying purchases.',
        timestamp: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: response,
      } as APIResponse<RecommendationResponse>);

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SEARCH_FAILED', message: 'Failed to search products' },
      } as APIResponse<null>);
    }
  }
);

// ===========================================
// Subscription Routes
// ===========================================

// Get subscription plans
app.get('/api/subscriptions/plans', (req: Request, res: Response) => {
  const currency = (req.query.currency as string) || 'GBP';
  
  const plans = [
    {
      id: 'weekly',
      name: 'Weekly',
      productId: SUBSCRIPTION_PRODUCTS.WEEKLY,
      price: currency === 'GBP' ? 4.99 : 5.99,
      currency,
      period: 'weekly',
      features: [
        'Unlimited product searches',
        'AI-powered recommendations',
        'Access all categories',
        'Cancel anytime',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      productId: SUBSCRIPTION_PRODUCTS.YEARLY,
      price: currency === 'GBP' ? 24.99 : 29.99,
      currency,
      period: 'yearly',
      features: [
        'Unlimited product searches',
        'AI-powered recommendations',
        'Access all categories',
        'Best value - save 90%',
        'Cancel anytime',
      ],
      badge: 'Best Value',
    },
  ];

  res.json({
    success: true,
    data: plans,
  } as APIResponse<any>);
});

// Validate receipt
app.post(
  '/api/subscriptions/validate',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { receiptData } = ReceiptSchema.parse(req.body);
      const user = await getUserById(req.userId!);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' },
        } as APIResponse<null>);
      }

      // Validate with Apple
      const validationResult = await validateReceipt(receiptData);

      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_RECEIPT', 
            message: validationResult.error || 'Receipt validation failed',
          },
        } as APIResponse<null>);
      }

      // Update user subscription status
      await updateUserSubscription(
        user.id,
        validationResult.subscriptionStatus,
        validationResult.productId,
        validationResult.expiresAt ? new Date(validationResult.expiresAt) : null,
        null // originalTransactionId would come from full receipt parsing
      );

      // Track subscription event
      await trackEvent(user.id, 'subscription_validated', {
        status: validationResult.subscriptionStatus,
        productId: validationResult.productId,
      });

      res.json({
        success: true,
        data: {
          subscriptionStatus: validationResult.subscriptionStatus,
          expiresAt: validationResult.expiresAt,
          productId: validationResult.productId,
        },
      } as APIResponse<any>);

    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Failed to validate receipt' },
      } as APIResponse<null>);
    }
  }
);

// Restore purchases
app.post(
  '/api/subscriptions/restore',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { receiptData } = ReceiptSchema.parse(req.body);
      
      // Same as validate, but specifically for restore
      const validationResult = await validateReceipt(receiptData);

      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          error: { 
            code: 'NO_PURCHASES', 
            message: 'No previous purchases found to restore',
          },
        } as APIResponse<null>);
      }

      // Update user
      await updateUserSubscription(
        req.userId!,
        validationResult.subscriptionStatus,
        validationResult.productId,
        validationResult.expiresAt ? new Date(validationResult.expiresAt) : null,
        null
      );

      // Track restore event
      await trackEvent(req.userId!, 'subscription_restored', {
        status: validationResult.subscriptionStatus,
      });

      res.json({
        success: true,
        data: {
          subscriptionStatus: validationResult.subscriptionStatus,
          expiresAt: validationResult.expiresAt,
          message: 'Purchases restored successfully',
        },
      } as APIResponse<any>);

    } catch (error) {
      console.error('Restore error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'RESTORE_FAILED', message: 'Failed to restore purchases' },
      } as APIResponse<null>);
    }
  }
);

// ===========================================
// Legal Routes
// ===========================================

app.get('/api/legal/privacy', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      title: 'Privacy Policy',
      lastUpdated: '2026-01-27',
      content: `
Zokey Privacy Policy

1. Information We Collect
- Device identifier (anonymous)
- Search preferences (category, budget, priorities)
- Region/locale settings

2. How We Use Information
- To provide personalized product recommendations
- To improve our AI recommendation engine
- To manage your subscription

3. Data Sharing
- We do not sell your personal data
- Product searches use Amazon Product Advertising API
- AI recommendations use OpenAI (no personal data shared)

4. Data Retention
- Search data cached for 1 hour for performance
- Account data retained until account deletion

5. Your Rights
- Access your data
- Delete your account
- Opt-out of analytics

Contact: privacy@shopai.app
      `.trim(),
    },
  });
});

app.get('/api/legal/terms', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      title: 'Terms of Service',
      lastUpdated: '2026-01-27',
      content: `
Zokey Terms of Service

1. Service Description
Zokey provides AI-powered product recommendations. We do not sell products directly - all purchases are made through Amazon.

2. Affiliate Disclosure
Zokey participates in the Amazon Associates Program. We earn commissions from qualifying purchases made through our links.

3. Subscriptions
- Free tier: 3 product searches
- Paid subscriptions: Unlimited searches
- Subscriptions auto-renew unless cancelled
- Manage subscriptions through iOS Settings

4. No Warranties
Recommendations are provided "as is". We do not guarantee:
- Product availability
- Price accuracy
- Product quality

5. Limitation of Liability
Zokey is not responsible for purchases made on Amazon.

Contact: legal@shopai.app
      `.trim(),
    },
  });
});

// ===========================================
// Error Handler
// ===========================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred' },
  } as APIResponse<null>);
});

// ===========================================
// Server Start
// ===========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zokey Backend running on port ${PORT}`);
  console.log(`Mock mode: ${process.env.MOCK_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
});

export default app;
