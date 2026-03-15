import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const PLAN_PRICES: Record<string, number> = {
  personal: 0,
  professional: 15000,
  enterprise: 35000,
};

export async function POST(req: NextRequest) {
  try {
    const { authKey, customerKey, planName } = await req.json();

    if (!authKey || !customerKey || !planName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const authHeader = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');

    // 1. Exchange authKey for billingKey
    const issueResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    });

    const issueData = await issueResponse.json();

    if (!issueResponse.ok) {
      console.error('Toss Billing Issue Error:', issueData);
      return NextResponse.json({ error: issueData.message || 'Failed to issue billing key' }, { status: issueResponse.status });
    }

    const { billingKey } = issueData;
    const amount = PLAN_PRICES[planName.toLowerCase()] || 0;

    // 2. Execute the first payment immediately (if not free plan)
    if (amount > 0) {
      const orderId = Math.random().toString(36).slice(2);
      const paymentResponse = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerKey,
          amount,
          orderId,
          orderName: `CloudNote ${planName} First Payment`,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        console.error('First Payment Error:', paymentData);
        // If first payment fails, we might want to still store the billing key or fail the whole registration.
        // For a clean subscription start, failing the whole registration is usually better.
        return NextResponse.json({ error: paymentData.message || 'First payment failed. Subscription not started.' }, { status: paymentResponse.status });
      }
    }

    // 3. Store in Supabase after successful (first payment or free plan)
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Calculate next billing date (30 days from now)
    const nextBillingAt = new Date();
    nextBillingAt.setDate(nextBillingAt.getDate() + 30);

    const { error: updateError } = await supabaseService
      .from('users')
      .update({
        billing_key: billingKey,
        customer_key: customerKey,
        subscription_status: 'active',
        subscription_tier: planName.toLowerCase(),
        last_billing_at: new Date().toISOString(),
        next_billing_at: nextBillingAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', customerKey);

    if (updateError) {
      console.error('Database Update Error:', updateError);
      return NextResponse.json({ error: 'Failed to update user subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscription activated and first payment processed' });

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
