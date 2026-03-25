import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Building2, Menu, X, Github, Twitter, Mail } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

function CivicEaseMark({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className={`text-lg font-black tracking-tight ${light ? 'text-white' : 'text-slate-950'}`}>
          CivicEase
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${light ? 'text-slate-400' : 'text-slate-500'}`}>
          Smart Grievance Platform
        </span>
      </div>
    </div>
  );
}

export default function PublicLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Determine if we're on the dark hero page */
  const isHome = location.pathname === '/';
  const navTransparent = isHome && !scrolled;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ═══════════ NAVBAR ═══════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navTransparent
          ? 'bg-transparent'
          : 'border-b border-white/10 bg-[#060918]/80 shadow-lg shadow-black/10 backdrop-blur-2xl'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <CivicEaseMark light />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 backdrop-blur-md lg:flex">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${active
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/signin"
              className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-400/30 hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-white/15 bg-white/[0.06] p-2.5 text-white backdrop-blur-sm lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#060918]/95 px-4 py-4 backdrop-blur-2xl lg:hidden">
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] py-3 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 py-3 text-center text-sm font-bold text-slate-950"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════ MAIN ═══════════ */}
      <main>
        <Outlet />
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#060918] text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main footer grid */}
          <div className="grid gap-12 border-b border-white/8 py-16 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
            {/* Brand column */}
            <div className="max-w-sm">
              <CivicEaseMark light />
              <p className="mt-5 text-sm leading-7 text-slate-500">
                A comprehensive digital civic platform. Report, track, and resolve
                community issues with AI-driven classification and transparent governance.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Product</h3>
              <div className="space-y-3 text-sm">
                <Link to="/how-it-works" className="block text-slate-400 transition hover:text-white">How It Works</Link>
                <Link to="/services" className="block text-slate-400 transition hover:text-white">Services</Link>
                <Link to="/faq" className="block text-slate-400 transition hover:text-white">FAQ</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Company</h3>
              <div className="space-y-3 text-sm">
                <Link to="/about" className="block text-slate-400 transition hover:text-white">About Us</Link>
                <Link to="/contact" className="block text-slate-400 transition hover:text-white">Contact</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Legal</h3>
              <div className="space-y-3 text-sm">
                <span className="block text-slate-500">Privacy Policy</span>
                <span className="block text-slate-500">Terms of Service</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-slate-600 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} CivicEase. All rights reserved.</p>
            <p>
              Made with <span className="text-red-400">♥</span> for better cities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
