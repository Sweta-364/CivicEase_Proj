import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Building2, CircleHelp, Info, Mail, ShieldCheck, Wrench } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/', icon: Building2 },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'How It Works', href: '/how-it-works', icon: CircleHelp },
  { name: 'FAQ', href: '/faq', icon: CircleHelp },
  { name: 'Contact', href: '/contact', icon: Mail },
];

function CivicEaseMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-900/20">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-black tracking-tight text-slate-950">CivicEase</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Smart grievance platform
        </span>
      </div>
    </div>
  );
}

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_26%),linear-gradient(180deg,#f8fcff_0%,#f5fafc_55%,#eff6ff_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <CivicEaseMark />
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 p-1 lg:flex">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              <ShieldCheck className="h-4 w-4" />
              Sign in
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/70 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div className="max-w-md">
            <div className="mb-5">
              <CivicEaseMark />
            </div>
            <p className="text-sm leading-7 text-slate-400">
              CivicEase connects citizens and civic authorities through a cleaner reporting flow, transparent updates,
              and a focused dashboard experience.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Platform</h3>
            <div className="space-y-3 text-sm">
              <Link to="/about" className="block transition hover:text-white">About</Link>
              <Link to="/services" className="block transition hover:text-white">Services</Link>
              <Link to="/how-it-works" className="block transition hover:text-white">How it works</Link>
              <Link to="/signin" className="block transition hover:text-white">Sign in</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Legal</h3>
            <div className="space-y-3 text-sm">
              <Link to="/privacy" className="block transition hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="block transition hover:text-white">Terms of Service</Link>
              <Link to="/contact" className="block transition hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
