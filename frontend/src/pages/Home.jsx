import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Camera,
  CheckCircle,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
  Users,
  Zap,
  BarChart3,
  Bot,
  Globe
} from 'lucide-react';
import BgScroll from '../components/bg/BgScroll';
import ScrollStack, { ScrollStackItem } from '../components/bg/ScrollStack';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const howItWorks = [
  {
    icon: Camera,
    title: 'Capture the Issue',
    description: 'Snap a photo of the civic problem — potholes, broken lights, waste overflow. Clear images help authorities act faster.',
  },
  {
    icon: FileText,
    title: 'Describe & Submit',
    description: 'Add a title, description and location. Our AI auto-categorises and routes your complaint to the right department.',
  },
  {
    icon: Send,
    title: 'Instant Confirmation',
    description: 'Receive a unique tracking ID immediately. Your complaint enters the civic resolution pipeline in real-time.',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description: 'Monitor live status updates as authorities acknowledge, work on, and resolve your issue — with full transparency.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Resolution',
    description: 'Authorities upload proof-of-fix with photos and comments. You verify and close the loop with feedback.',
  },
];

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Triage',
    description: 'Smart classification routes complaints to the right department instantly using natural language understanding.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Geo-Tagged Reporting',
    description: 'Automatic location detection with interactive map views for precise issue pinpointing.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    description: 'Real-time dashboards showing resolution rates, department performance, and community trends.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Secure citizen, department admin, and super-admin roles with granular permissions and audit trails.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: MessageSquare,
    title: 'Community Forum',
    description: 'Citizens discuss local issues, upvote priorities, and collaborate on neighbourhood improvements.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Accessible on web, Android, and any device. File complaints from anywhere, anytime.',
    gradient: 'from-sky-500 to-indigo-600',
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: detect mobile (< 768px)                                      */
/* ------------------------------------------------------------------ */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const heroRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  /* ── Shared hero content ── */
  const heroContent = (
    <div ref={heroRef} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          Your city listens.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Now it acts.
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            to="/signin"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-400/40 sm:px-8 sm:py-4 sm:text-base"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* ═══════════ HERO ═══════════ */}
      {isMobile ? (
        /* Mobile: static dark hero with no image sequence */
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#060918]">
          {/* Ambient gradient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_65%)]" />
            <div className="absolute -bottom-1/3 -right-1/4 h-[70vw] w-[70vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_60%)]" />
          </div>
          <div className="relative z-10 w-full">{heroContent}</div>
        </section>
      ) : (
        /* Desktop: full BgScroll with image sequence */
        <BgScroll>{heroContent}</BgScroll>
      )}

      {/* ═══════════ HOW IT WORKS — vertical timeline ═══════════ */}
      <section className="bg-white py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:mt-5 sm:text-4xl md:text-5xl">
              From report to resolution,{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">simplified</span>
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:mt-4 sm:text-lg">
              Your journey to a better city, in five easy steps.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto mt-12 max-w-5xl sm:mt-20">
            {/* Vertical line centered on desktop, left on mobile */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-400 to-blue-500 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10 relative sm:space-y-16">
              {howItWorks.map((step, idx) => {
                const Icon = step.icon;
                const isEven = idx % 2 === 0;
                return (
                  <div key={step.title} className={`relative flex flex-col md:flex-row items-center justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Spacer for the empty side */}
                    <div className="hidden md:block w-[45%]" />

                    {/* Center Icon */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-110 sm:h-16 sm:w-16">
                      <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>

                    {/* Content Card */}
                    <div className="w-full pl-16 sm:pl-24 md:pl-0 md:w-[45%]">
                      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px] sm:p-8 md:p-10 text-left">
                        {/* Decorative glow inside card */}
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-50 blur-3xl transition-colors group-hover:bg-blue-50" />

                        <div className="relative z-10">
                          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-cyan-500 mb-2 sm:text-sm sm:mb-3">
                            Step {idx + 1}
                          </span>
                          <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:mt-4 sm:text-base">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="bg-slate-50 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Platform Capabilities
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:mt-5 sm:text-4xl md:text-5xl">
              Everything you need for{' '}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                smarter governance
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:mt-4 sm:text-lg">
              Built with modern technology for maximum transparency and efficiency.
            </p>
          </div>

          {isMobile ? (
            /* ── Mobile: simple card grid ── */
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <article
                    key={f.title}
                    className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-black tracking-tight text-slate-950">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {f.description}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            /* ── Desktop: ScrollStack ── */
            <ScrollStack
              className="mt-16 pb-20 max-w-4xl mx-auto"
              itemScale={0.03}
              blurAmount={1.5}
              itemDistance={60}
            >
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <ScrollStackItem key={f.title} itemClassName="flex justify-center w-full">
                    <article
                      className="group w-full rounded-[32px] border border-slate-200/60 bg-white/95 p-10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl sm:p-12 text-center flex flex-col items-center"
                    >
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br ${f.gradient} text-white shadow-lg`}
                      >
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="mt-8 text-3xl font-black tracking-tight text-slate-950">
                        {f.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
                        {f.description}
                      </p>
                    </article>
                  </ScrollStackItem>
                );
              })}
            </ScrollStack>
          )}
        </div>
      </section>

      {/* ═══════════ CTA — dark section ═══════════ */}
      <section className="relative overflow-hidden bg-[#060918] py-16 sm:py-28 md:py-36">
        {/* Dynamic Beams — hidden on mobile for perf */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:flex items-center justify-center">
          {/* Base ambient glow */}
          <div className="absolute top-1/2 left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_60%)]" />

          {/* Beams */}
          <div className="absolute w-[150%] h-[150px] animate-beam-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[40px] mix-blend-screen" />
          <div className="absolute w-[150%] h-[80px] animate-beam-2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-[30px] mix-blend-screen" />
          <div className="absolute w-[150%] h-[30px] animate-beam-3 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-[10px] mix-blend-screen" />
          <div className="absolute w-[150%] h-[100px] animate-beam-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent blur-[50px] mix-blend-screen" style={{ animationDelay: '-5s' }} />
        </div>

        {/* Mobile ambient glow (simpler) */}
        <div className="pointer-events-none absolute inset-0 sm:hidden">
          <div className="absolute top-1/2 left-1/2 h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to transform your community?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              to="/signin"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-50 sm:px-8 sm:py-4 sm:text-base"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              View Dashboard Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
