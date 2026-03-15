'use client';

import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-display flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Progress Header */}
        <div className="bg-[#1337ec] p-8 text-white relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black">Payment Successful</h1>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Activated</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[100%] transition-all duration-1000"></div>
          </div>
          <div className="mt-2 text-right text-xs font-bold">100% Complete</div>
          
          {/* Success Circle */}
          <div className="absolute -bottom-6 right-12 bg-green-500 text-white rounded-full p-4 shadow-xl">
            <span className="material-symbols-outlined !text-4xl">check</span>
          </div>
        </div>

        <div className="p-10">
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2">Subscription Activated</h2>
            <p className="text-slate-500 leading-relaxed">
              Thank you for choosing CloudNote! Your account has been successfully upgraded to the **Professional** plan. You now have unlimited access to all premium features.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Order Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between font-bold">
                <span>CloudNote Professional</span>
                <span className="text-[#1337ec]">$12.00/mo</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Billing Cycle</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Next Billing Date</span>
                <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white">
              <div className="rounded-lg bg-blue-50 p-2 text-[#1337ec]">
                <span className="material-symbols-outlined">sync</span>
              </div>
              <div>
                <h4 className="font-bold text-sm">Instant Sync</h4>
                <p className="text-xs text-slate-500 mt-1">Ready on all your devices</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white">
              <div className="rounded-lg bg-blue-50 p-2 text-[#1337ec]">
                <span className="material-symbols-outlined">shield_lock</span>
              </div>
              <div>
                <h4 className="font-bold text-sm">Full Security</h4>
                <p className="text-xs text-slate-500 mt-1">E2E encryption active</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="flex-1">
              <button className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#1337ec] py-4 text-sm font-black text-white shadow-xl shadow-[#1337ec]/20 hover:scale-[1.02] transition-all">
                Go to Dashboard
                <span className="material-symbols-outlined text-sm">dashboard</span>
              </button>
            </Link>
            <button className="flex-1 flex justify-center items-center gap-2 rounded-xl border-2 border-slate-200 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Download Receipt
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Order ID: CN-{Math.random().toString(36).substring(7).toUpperCase()} • Transaction Date: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-slate-400">
        Need help? <a href="#" className="font-bold text-[#1337ec] hover:underline">Contact Support</a>
      </p>
    </div>
  );
}
