'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const type = searchParams.get('type'); // 'billing' or 'single'
  const authKey = searchParams.get('authKey');
  const customerKey = searchParams.get('customerKey');
  const plan = searchParams.get('plan');
  
  // For single payments (old flow)
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (type === 'billing' && authKey && customerKey) {
      handleBillingAuth();
    } else if (paymentKey) {
      // Single payment success (already done)
      setLoading(false);
    } else {
        setLoading(false);
    }
  }, [type, authKey, customerKey, paymentKey]);

  const handleBillingAuth = async () => {
    try {
      const response = await fetch('/api/payment/billing-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authKey, customerKey, planName: plan }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center font-display">
        <div className="text-center">
            <div className="inline-block size-8 border-4 border-[#1337ec] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-bold">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 font-display">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="size-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-5xl">error</span>
            </div>
            <h1 className="text-3xl font-black mb-4">Registration Failed</h1>
            <p className="text-slate-500 mb-8">{error}</p>
            <Link href="/pricing">
              <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black">Try Again</button>
            </Link>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 font-display">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        
        <h1 className="text-3xl font-black mb-4">
            {type === 'billing' ? 'Subscription Active!' : 'Payment Successful!'}
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {type === 'billing' 
            ? `Your card has been registered. Your CloudNote ${plan} subscription is now active.`
            : 'Your payment was successful. Your account has been updated.'}
        </p>

        {(!type || type !== 'billing') && (
            <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Order ID</span>
                <span className="font-bold text-slate-700">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Amount</span>
                <span className="font-bold text-[#1337ec]">₩{Number(amount).toLocaleString()}</span>
            </div>
            </div>
        )}

        <Link href="/dashboard">
          <button className="w-full bg-[#1337ec] text-white py-4 rounded-xl font-black shadow-lg shadow-[#1337ec]/20 hover:scale-[1.02] transition-all">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
