'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const plans = [
    {
      name: 'Personal',
      price: 0,
      displayPrice: '$0',
      description: 'Ideal for individuals starting their productivity journey.',
      features: ['Up to 50 notes', 'Sync on 2 devices', 'Basic search', 'Standard support'],
      buttonText: 'Get Started',
      accentColor: 'slate-400'
    },
    {
      name: 'Professional',
      price: 15000,
      displayPrice: '$12',
      description: 'Perfect for power users who need advanced organization.',
      features: ['Unlimited notes', 'Unlimited devices', 'Advanced search', 'Priority support', 'Offline mode'],
      buttonText: 'Start Free Trial',
      accentColor: '#1337ec',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 35000,
      displayPrice: '$29',
      description: 'Designed for teams that collaborate in real-time.',
      features: ['Shared workspaces', 'Admin control', 'Audit logs', 'Custom integrations', '24/7 Premium support'],
      buttonText: 'Contact Sales',
      accentColor: 'indigo-900'
    }
  ];

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function initToss() {
      const tossPayments = await loadTossPayments(clientKey);
      // Use user ID as customerKey for billing auth
      const widgets = tossPayments.widgets({ customerKey: user.id });
      
      const currentPlan = plans.find(p => p.name === selectedPlan);
      await widgets.setAmount({
        currency: 'KRW',
        value: currentPlan?.price || 0,
      });

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      setPaymentWidget(widgets);
    }

    initToss();
  }, [user]);

  useEffect(() => {
    if (paymentWidget) {
      const currentPlan = plans.find(p => p.name === selectedPlan);
      paymentWidget.setAmount({
        currency: 'KRW',
        value: currentPlan?.price || 0,
      });
    }
  }, [selectedPlan, paymentWidget]);

  const handlePayment = async () => {
    if (!paymentWidget || !user) return;
    setLoading(true);
    try {
      // For subscription, we use requestBillingAuth to get authKey
      await paymentWidget.requestBillingAuth({
        method: 'CARD', // Initially only supporting CARD for billing
        successUrl: window.location.origin + '/payment/success?type=billing&plan=' + selectedPlan,
        failUrl: window.location.origin + '/payment/fail',
        customerEmail: user.email,
        customerName: user.user_metadata?.full_name || 'CloudNote User',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-display">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <Link href="/" className="flex items-center gap-2 text-[#1337ec]">
          <span className="material-symbols-outlined font-bold">cloud_done</span>
          <span className="text-xl font-bold text-slate-900">CloudNote</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-[#1337ec]">Back to Dashboard</Link>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-16">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Upgrade Your Workflow</h1>
          <p className="mt-4 text-lg text-slate-600">Subscribe for unlimited productivity.</p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border ${plan.popular ? 'border-[#1337ec] ring-4 ring-[#1337ec]/5 shadow-2xl' : 'border-slate-200'} bg-white p-8 transition-all hover:scale-[1.02]`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1337ec] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-black">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.displayPrice}</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{plan.description}</p>
              </div>
              <ul className="mb-10 flex-grow space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setSelectedPlan(plan.name)}
                className={`w-full rounded-xl py-4 font-bold transition-all ${plan.popular ? 'bg-[#1337ec] text-white shadow-lg shadow-[#1337ec]/30 hover:bg-[#1337ec]/90' : 'border-2 border-slate-200 text-slate-900 hover:bg-slate-50'}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Section (Subscription Integration) */}
        <div className="mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b lg:border-r lg:border-b-0 border-slate-200 p-12">
              <h2 className="text-2xl font-black tracking-tight">Subscription Setup</h2>
              <p className="mt-2 text-slate-500">Secure card registration powered by Toss Payments.</p>
              
              <div className="mt-10 space-y-6">
                <div id="payment-method" className="w-full"></div>
                <div id="agreement" className="w-full"></div>

                {!user && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium">
                        Please sign in to subscribe.
                    </div>
                )}

                <button 
                  onClick={handlePayment}
                  disabled={loading || !paymentWidget || !user}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#1337ec] py-4 font-black text-white shadow-xl shadow-[#1337ec]/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Register and Subscribe'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="flex items-center justify-center gap-4 pt-6">
                  <div className="size-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">shield_lock</span>
                  </div>
                  <p className="text-xs text-slate-400">Automated 30-day billing • Cancel anytime</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-12">
              <h2 className="text-2xl font-black tracking-tight">Subscription Summary</h2>
              <div className="mt-10 space-y-4">
                <div className="flex justify-between font-bold">
                  <span>CloudNote {selectedPlan}</span>
                  <span>{plans.find(p => p.name === selectedPlan)?.displayPrice}/mo</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Billing Cycle</span>
                  <span>Every 30 days</span>
                </div>
                <div className="my-8 border-t border-slate-200 pt-8 flex justify-between">
                  <span className="text-lg font-black">Recurring Total</span>
                  <span className="text-3xl font-black text-[#1337ec]">{plans.find(p => p.name === selectedPlan)?.displayPrice}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h4 className="font-bold text-sm mb-4">How it works?</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-xs text-slate-500 leading-relaxed">
                    <span className="material-symbols-outlined text-sm text-[#1337ec]">sync</span>
                    Your card will be registered for automatic payments
                  </li>
                  <li className="flex gap-3 text-xs text-slate-500 leading-relaxed">
                    <span className="material-symbols-outlined text-sm text-[#1337ec]">calendar_month</span>
                    Next payment in 30 days automatically
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-sm text-slate-500 border-t border-slate-200">
        © 2024 CloudNote Inc. • Security • Privacy • Terms of Service
      </footer>
    </div>
  );
}
