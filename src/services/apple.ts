// ===========================================
// Apple StoreKit Receipt Validation Service
// For In-App Subscription verification
// ===========================================

import { SubscriptionStatus, ReceiptValidationResponse } from '../types';

// Apple verification endpoints
const APPLE_PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';

// Subscription product IDs (must match App Store Connect)
export const SUBSCRIPTION_PRODUCTS = {
  WEEKLY: 'com.shopai.subscription.weekly',
  YEARLY: 'com.shopai.subscription.yearly',
};

// ===========================================
// Receipt Validation
// ===========================================

export async function validateReceipt(
  receiptData: string
): Promise<ReceiptValidationResponse> {
  // In mock mode, return a valid subscription
  if (process.env.MOCK_MODE === 'true') {
    return mockValidateReceipt(receiptData);
  }

  const sharedSecret = process.env.APPLE_SHARED_SECRET;
  if (!sharedSecret) {
    return {
      valid: false,
      subscriptionStatus: 'none',
      expiresAt: null,
      productId: null,
      error: 'Apple shared secret not configured',
    };
  }

  try {
    // Try production first
    let response = await verifyWithApple(
      APPLE_PRODUCTION_URL,
      receiptData,
      sharedSecret
    );

    // If status 21007, receipt is from sandbox
    if (response.status === 21007) {
      response = await verifyWithApple(
        APPLE_SANDBOX_URL,
        receiptData,
        sharedSecret
      );
    }

    return parseAppleResponse(response);
  } catch (error) {
    console.error('[Apple] Validation error:', error);
    return {
      valid: false,
      subscriptionStatus: 'none',
      expiresAt: null,
      productId: null,
      error: 'Failed to validate receipt',
    };
  }
}

// ===========================================
// Apple API Communication
// ===========================================

async function verifyWithApple(
  url: string,
  receiptData: string,
  sharedSecret: string
): Promise<AppleReceiptResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'receipt-data': receiptData,
      password: sharedSecret,
      'exclude-old-transactions': true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apple API error: ${response.status}`);
  }

  return response.json() as Promise<AppleReceiptResponse>;
}

// ===========================================
// Response Parsing
// ===========================================

interface AppleReceiptResponse {
  status: number;
  environment?: string;
  receipt?: {
    bundle_id: string;
    in_app: AppleInAppPurchase[];
  };
  latest_receipt_info?: AppleInAppPurchase[];
  pending_renewal_info?: ApplePendingRenewal[];
}

interface AppleInAppPurchase {
  product_id: string;
  original_transaction_id: string;
  transaction_id: string;
  purchase_date_ms: string;
  expires_date_ms?: string;
  is_trial_period?: string;
  is_in_intro_offer_period?: string;
}

interface ApplePendingRenewal {
  product_id: string;
  auto_renew_status: string;
  is_in_billing_retry_period?: string;
}

function parseAppleResponse(response: AppleReceiptResponse): ReceiptValidationResponse {
  // Check status code
  if (response.status !== 0) {
    return {
      valid: false,
      subscriptionStatus: 'none',
      expiresAt: null,
      productId: null,
      error: getAppleErrorMessage(response.status),
    };
  }

  // Get the latest subscription info
  const subscriptions = response.latest_receipt_info || response.receipt?.in_app || [];
  
  // Find active subscription (filter to our product IDs)
  const ourSubscriptions = subscriptions.filter(
    sub => sub.product_id === SUBSCRIPTION_PRODUCTS.WEEKLY ||
           sub.product_id === SUBSCRIPTION_PRODUCTS.YEARLY
  );

  if (ourSubscriptions.length === 0) {
    return {
      valid: true,
      subscriptionStatus: 'none',
      expiresAt: null,
      productId: null,
    };
  }

  // Get the most recent subscription
  const latestSub = ourSubscriptions.reduce((latest, current) => {
    const latestExpiry = parseInt(latest.expires_date_ms || '0');
    const currentExpiry = parseInt(current.expires_date_ms || '0');
    return currentExpiry > latestExpiry ? current : latest;
  });

  const expiresAtMs = parseInt(latestSub.expires_date_ms || '0');
  const expiresAt = new Date(expiresAtMs);
  const now = new Date();

  // Check pending renewal for billing retry
  const pendingRenewal = response.pending_renewal_info?.find(
    pr => pr.product_id === latestSub.product_id
  );
  const isInBillingRetry = pendingRenewal?.is_in_billing_retry_period === '1';

  // Determine subscription status
  let subscriptionStatus: SubscriptionStatus;
  if (expiresAt > now) {
    subscriptionStatus = 'active';
  } else if (isInBillingRetry) {
    subscriptionStatus = 'grace_period';
  } else {
    subscriptionStatus = 'expired';
  }

  return {
    valid: true,
    subscriptionStatus,
    expiresAt: expiresAt.toISOString(),
    productId: latestSub.product_id,
  };
}

// ===========================================
// Error Messages
// ===========================================

function getAppleErrorMessage(status: number): string {
  const errors: Record<number, string> = {
    21000: 'The App Store could not read the receipt',
    21002: 'The receipt data was malformed',
    21003: 'The receipt could not be authenticated',
    21004: 'The shared secret does not match',
    21005: 'The receipt server is not available',
    21006: 'This receipt is valid but the subscription has expired',
    21007: 'This receipt is from the test environment',
    21008: 'This receipt is from the production environment',
    21010: 'This receipt could not be authorized',
  };

  return errors[status] || `Unknown error: ${status}`;
}

// ===========================================
// Mock Validation (for testing)
// ===========================================

function mockValidateReceipt(receiptData: string): ReceiptValidationResponse {
  // In mock mode, we'll validate any receipt that looks like base64
  const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(receiptData);
  
  if (!isValidBase64 || receiptData.length < 10) {
    return {
      valid: false,
      subscriptionStatus: 'none',
      expiresAt: null,
      productId: null,
      error: 'Invalid receipt format',
    };
  }

  // Simulate an active yearly subscription
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  return {
    valid: true,
    subscriptionStatus: 'active',
    expiresAt: expiresAt.toISOString(),
    productId: SUBSCRIPTION_PRODUCTS.YEARLY,
  };
}

// ===========================================
// Subscription Info
// ===========================================

export interface SubscriptionInfo {
  originalTransactionId: string;
  productId: string;
  purchaseDate: Date;
  expiresDate: Date;
  isTrialPeriod: boolean;
  autoRenewStatus: boolean;
}

export function extractSubscriptionInfo(
  receiptData: string,
  response: AppleReceiptResponse
): SubscriptionInfo | null {
  const subscriptions = response.latest_receipt_info || [];
  const ourSubs = subscriptions.filter(
    s => s.product_id === SUBSCRIPTION_PRODUCTS.WEEKLY ||
         s.product_id === SUBSCRIPTION_PRODUCTS.YEARLY
  );

  if (ourSubs.length === 0) return null;

  const latestSub = ourSubs.reduce((latest, current) => {
    const latestExpiry = parseInt(latest.expires_date_ms || '0');
    const currentExpiry = parseInt(current.expires_date_ms || '0');
    return currentExpiry > latestExpiry ? current : latest;
  });

  const pendingRenewal = response.pending_renewal_info?.find(
    pr => pr.product_id === latestSub.product_id
  );

  return {
    originalTransactionId: latestSub.original_transaction_id,
    productId: latestSub.product_id,
    purchaseDate: new Date(parseInt(latestSub.purchase_date_ms)),
    expiresDate: new Date(parseInt(latestSub.expires_date_ms || '0')),
    isTrialPeriod: latestSub.is_trial_period === 'true',
    autoRenewStatus: pendingRenewal?.auto_renew_status === '1',
  };
}
