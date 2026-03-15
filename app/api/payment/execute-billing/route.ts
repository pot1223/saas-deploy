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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch user billing info
    const { data: user, error: userError } = await supabaseService
      .from('users')
      .select('billing_key, subscription_tier, customer_key')
      .eq('id', userId)
      .single();

    if (userError || !user?.billing_key) {
      return NextResponse.json({ error: 'No billing key found for this user' }, { status: 404 });
    }

    const amount = PLAN_PRICES[user.subscription_tier] || 0;
    if (amount === 0) {
      return NextResponse.json({ error: 'Free plan does not require billing' }, { status: 400 });
    }

    // 2. Execute billing via Toss API
    const authHeader = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
    const orderId = Math.random().toString(36).slice(2);
    
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
      console.error('Toss Billing Execution Error:', data);
      return NextResponse.json({ error: data.message || 'Payment failed' }, { status: response.status });
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

    return NextResponse.json({
      success: true,
      paymentKey: data.paymentKey,
      orderId: data.orderId,
      amount: data.totalAmount,
    });

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
