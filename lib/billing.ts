import { createClient } from '@supabase/supabase-js';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const PLAN_PRICES: Record<string, number> = {
  personal: 0,
  professional: 15000,
  enterprise: 35000,
};

export interface BillingResult {
  success: boolean;
  paymentKey?: string;
  orderId?: string;
  amount?: number;
  error?: string;
}

export async function executeBilling(userId: string): Promise<BillingResult> {
  try {
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch user billing info
    const { data: user, error: userError } = await supabaseService
      .from('users')
      .select('id, billing_key, subscription_tier, customer_key')
      .eq('id', userId)
      .single();

    if (userError || !user?.billing_key) {
      return { success: false, error: 'No billing key found' };
    }

    const amount = PLAN_PRICES[user.subscription_tier.toLowerCase()] || 0;
    if (amount === 0) {
      return { success: false, error: 'Free plan' };
    }

    // 2. Execute billing via Toss API
    const authHeader = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
    const orderId = `batch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    
    const response = await fetch(`https://api.tosspayments.com/v1/billing/${user.billing_key}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey: user.customer_key,
        amount,
        orderId,
        orderName: `CloudNote ${user.subscription_tier} Monthly Subscription`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Billing failed for ${userId}:`, data);
      return { success: false, error: data.message || 'Payment failed' };
    }

    // 3. Update subscription window
    const nextBillingAt = new Date();
    nextBillingAt.setDate(nextBillingAt.getDate() + 30);

    await supabaseService
      .from('users')
      .update({
        last_billing_at: new Date().toISOString(),
        next_billing_at: nextBillingAt.toISOString(),
      })
      .eq('id', userId);

    return {
      success: true,
      paymentKey: data.paymentKey,
      orderId: data.orderId,
      amount: data.totalAmount,
    };

  } catch (err: any) {
    console.error(`System error billing ${userId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function processBatchBilling() {
  const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date().toISOString();

  // Find all active users whose next_billing_at is in the past or now
  const { data: users, error } = await supabaseService
    .from('users')
    .select('id')
    .eq('subscription_status', 'active')
    .lte('next_billing_at', now);

  if (error) {
    console.error('Error fetching batch users:', error);
    return { success: false, error: error.message };
  }

  if (!users || users.length === 0) {
    return { success: true, processed: 0, results: [] };
  }

  const results = await Promise.all(
    users.map(async (user) => {
      const result = await executeBilling(user.id);
      return { userId: user.id, ...result };
    })
  );

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    success: true,
    processed: users.length,
    succeeded,
    failed,
    results
  };
}
