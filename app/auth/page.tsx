'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verification email sent!');
      }
      if (isLogin) router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] text-slate-900 font-display">
      {/* Left Side: Form Section */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1337ec] text-white">
              <span className="material-symbols-outlined text-2xl">cloud_queue</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CloudNote</h2>
          </Link>
          
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setIsLogin(false)} className="font-semibold text-[#1337ec] hover:underline">
                    Start your 14-day free trial
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setIsLogin(true)} className="font-semibold text-[#1337ec] hover:underline">
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="mt-10">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 italic">
                {error}
              </div>
            )}
            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6" htmlFor="email">Email address</label>
                <div className="mt-2">
                  <input
                    autoComplete="email"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1337ec] sm:text-sm sm:leading-6"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6" htmlFor="password">Password</label>
                  {isLogin && (
                    <div className="text-sm">
                      <a className="font-semibold text-[#1337ec] hover:underline" href="#">Forgot password?</a>
                    </div>
                  )}
                </div>
                <div className="mt-2 relative">
                  <input
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1337ec] sm:text-sm sm:leading-6"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center">
                  <input className="h-4 w-4 rounded border-slate-300 text-[#1337ec] focus:ring-[#1337ec]" id="remember-me" name="remember-me" type="checkbox"/>
                  <label className="ml-3 block text-sm leading-6 text-slate-700" htmlFor="remember-me">Remember me</label>
                </div>
              )}

              <div>
                <button 
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-[#1337ec] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1337ec]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1337ec] disabled:opacity-50" 
                  type="submit"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-[#f6f6f8] px-6 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.844-1.026 1.402-2.441 1.247-3.83-1.183.052-2.61.793-3.461 1.792-.767.87-1.442 2.312-1.26 3.663 1.312.104 2.637-.6 3.474-1.625z"></path>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-auto pt-10 text-center text-xs text-slate-500">
          © 2024 CloudNote Inc. All rights reserved.
        </footer>
      </div>

      {/* Right Side: Visual Section */}
      <div className="relative hidden w-0 flex-1 lg:block bg-[#1337ec] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#1337ec] via-[#1337ec]/80 to-indigo-900 opacity-90"></div>
        <img
          alt="Minimal clean workspace"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWlqE0A3o9udZMB5mZKtaluWr56ZK4p-BjBFQf7797UPKRBL_9vv_pOQ9JJqdfZewOC6EXYUdgk-QoR9svlq6R-_GjyJN6R7KlDk6e4jHaiNfSR4nZxvCj-j5V-o_S7POYH1D-yfKB6eE0qRz_s7WLfc-GIjfIG4Zmh4psgqWVJsA4ad1mz07IZkL-8PeqtFrCEMZii_4uIq3sAqjuqg0YY2HqWTB49LfEG1BUGc_2rjpKSyt45GsfOv_QpWDGZyYxMAoDrxM6v0w"
        />
        <div className="relative z-20 flex h-full flex-col justify-center px-12 text-white xl:px-24">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 mb-8">
              New Features Available
            </span>
            <h1 className="text-5xl font-black tracking-tight leading-none mb-6">
              Organize your <br/><span className="text-blue-300">brilliant ideas</span> <br/>in the cloud.
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-10">
              Join over 2 million creative minds who use CloudNote to capture, organize, and share their best thoughts.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-sm text-blue-200">Uptime Reliability</p>
              </div>
              <div>
                <p className="text-3xl font-bold">256-bit</p>
                <p className="text-sm text-blue-200">AES Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
