import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f6f8] text-slate-900 transition-colors duration-300">
      <div className="flex h-full grow flex-col">
        {/* Header/Navigation */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-[#f6f6f8]/80 px-6 py-4 backdrop-blur-md md:px-20">
          <div className="flex items-center gap-2 text-[#1337ec]">
            <div className="flex items-center justify-center rounded-lg bg-[#1337ec] p-1 text-white">
              <span className="material-symbols-outlined">cloud_done</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">CloudNote</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
            <nav className="hidden gap-8 md:flex">
              <a className="text-sm font-medium text-slate-700 transition-colors hover:text-[#1337ec]" href="#features">Features</a>
              <a className="text-sm font-medium text-slate-700 transition-colors hover:text-[#1337ec]" href="#pricing">Pricing</a>
              <a className="text-sm font-medium text-slate-700 transition-colors hover:text-[#1337ec]" href="#testimonials">Testimonials</a>
            </nav>
            <div className="flex gap-3">
              <Link href="/auth">
                <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-lg bg-[#1337ec] px-4 text-sm font-bold text-white transition-all hover:bg-[#1337ec]/90">
                  Sign Up
                </button>
              </Link>
              <Link href="/auth">
                <button className="hidden h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-lg bg-slate-200 px-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-300 sm:flex">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <section className="width-full w-full max-w-[1200px] px-6 py-12 md:px-10 md:py-24">
            <div className="flex flex-col items-center gap-10 lg:flex-row">
              <div className="flex flex-col gap-8 lg:w-1/2">
                <div className="flex flex-col gap-4 text-left">
                  <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
                    Your Thoughts, Organized <span className="text-[#1337ec]">Everywhere</span>
                  </h1>
                  <p className="max-w-[540px] text-lg font-normal leading-relaxed text-slate-600 md:text-xl">
                    Experience seamless cross-device syncing that keeps your notes updated on your phone, tablet, and desktop instantly. Capture ideas as they happen.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button className="flex h-14 min-w-[180px] cursor-pointer items-center justify-center rounded-xl bg-[#1337ec] px-8 text-lg font-bold text-white shadow-lg shadow-[#1337ec]/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Start for Free
                  </button>
                  <button className="flex h-14 min-w-[180px] cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 px-8 text-lg font-bold text-slate-900 transition-all hover:bg-slate-100">
                    View Demo
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-[#f6f6f8] bg-slate-300"></div>
                    <div className="size-8 rounded-full border-2 border-[#f6f6f8] bg-slate-400"></div>
                    <div className="size-8 rounded-full border-2 border-[#f6f6f8] bg-slate-500"></div>
                  </div>
                  <span>Joined by 10,000+ thinkers worldwide</span>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-[#1337ec]/20 bg-gradient-to-tr from-[#1337ec]/10 to-[#1337ec]/5 p-4 shadow-2xl md:aspect-square md:p-8">
                  <div className="h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-[#f6f6f8] shadow-inner">
                    <div className="flex gap-2 border-b border-slate-200 p-4">
                      <div className="size-3 rounded-full bg-red-400"></div>
                      <div className="size-3 rounded-full bg-amber-400"></div>
                      <div className="size-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="h-4 w-1/3 rounded bg-[#1337ec]/20"></div>
                      <div className="h-32 w-full rounded-lg bg-slate-200"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg bg-slate-200"></div>
                        <div className="h-24 rounded-lg bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full bg-slate-100 py-20 px-6" id="features">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-16 flex flex-col gap-4 text-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#1337ec]">Why CloudNote</h2>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  Powerful Features for Modern Productivity
                </h1>
                <p className="mx-auto max-w-[720px] text-lg text-slate-600">
                  We've built the ultimate writing environment that stays out of your way and keeps your data secure.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-[#f6f6f8] p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="self-start rounded-xl bg-[#1337ec]/10 p-4 text-[#1337ec]">
                    <span className="material-symbols-outlined !text-4xl">sync</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Real-time Sync</h3>
                    <p className="leading-relaxed text-slate-600">
                      Edit a note on your Mac and see it instantly updated on your Android phone. No manual refreshing required.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-[#f6f6f8] p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="self-start rounded-xl bg-[#1337ec]/10 p-4 text-[#1337ec]">
                    <span className="material-symbols-outlined !text-4xl">shield_lock</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Military Security</h3>
                    <p className="leading-relaxed text-slate-600">
                      End-to-end encryption ensures that your private thoughts remain private. Even we can't read your notes.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-[#f6f6f8] p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="self-start rounded-xl bg-[#1337ec]/10 p-4 text-[#1337ec]">
                    <span className="material-symbols-outlined !text-4xl">groups</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-slate-900">Team Collaboration</h3>
                    <p className="leading-relaxed text-slate-600">
                      Share notebooks with colleagues or family members. Leave comments and track changes in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="w-full py-24 px-6" id="pricing">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-black text-slate-900 md:text-4xl">Simple, Transparent Pricing</h2>
                <p className="text-lg text-slate-600">Choose the plan that fits your growth.</p>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                {/* Basic */}
                <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-[#f6f6f8] p-8">
                  <h4 className="mb-2 text-lg font-bold">Personal</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-black">$0</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Up to 50 notes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Sync on 2 devices
                    </li>
                  </ul>
                  <button className="w-full rounded-lg border-2 border-slate-200 py-3 font-bold transition-all hover:bg-slate-100">Get Started</button>
                </div>
                {/* Pro */}
                <div className="relative z-10 flex h-full scale-105 flex-col rounded-3xl border-2 border-[#1337ec] bg-[#f6f6f8] p-8 shadow-xl shadow-[#1337ec]/10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1337ec] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">Most Popular</div>
                  <h4 className="mb-2 text-lg font-bold">Professional</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-black">$12</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Unlimited notes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Unlimited devices
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Offline mode access
                    </li>
                  </ul>
                  <button className="w-full rounded-lg bg-[#1337ec] py-3 font-bold text-white shadow-lg shadow-[#1337ec]/30 transition-all hover:bg-[#1337ec]/90">Start Free Trial</button>
                </div>
                {/* Team */}
                <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-[#f6f6f8] p-8">
                  <h4 className="mb-2 text-lg font-bold">Team</h4>
                  <div className="mb-6">
                    <span className="text-4xl font-black">$29</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Shared workspaces
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                      Admin console
                    </li>
                  </ul>
                  <button className="w-full rounded-lg border-2 border-slate-200 py-3 font-bold transition-all hover:bg-slate-100">Contact Sales</button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 py-12 px-6">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-12 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-6 flex items-center gap-2 text-[#1337ec]">
                <span className="material-symbols-outlined font-bold">cloud_done</span>
                <h2 className="text-xl font-bold text-slate-900">CloudNote</h2>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Building tools to help the world think better, one note at a time.
              </p>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-slate-900">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">Changelog</a></li>
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-slate-900">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">About</a></li>
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-slate-900">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">Help Center</a></li>
                <li><a className="transition-colors hover:text-[#1337ec]" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
            © 2024 CloudNote SaaS. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
