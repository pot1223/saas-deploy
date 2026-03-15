'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unexpected error occurred during payment.';
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6 font-display">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border-t-8 border-red-500">
        <div className="size-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-5xl">error</span>
        </div>
        
        <h1 className="text-3xl font-black mb-4">Payment Failed</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {message}
        </p>

        {code && (
          <div className="bg-red-50 rounded-2xl p-4 mb-10 text-sm text-red-700 font-mono italic">
            Error Code: {code}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link href="/pricing">
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition-all">
              Try Again
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailContent />
    </Suspense>
  );
}
