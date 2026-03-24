import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, ClipboardCheck, LayoutDashboard, Shield, Sparkles } from 'lucide-react';

const featureCards = [
  {
    icon: ClipboardCheck,
    title: 'Structured issue reporting',
    description: 'Capture the problem with evidence, context, and a cleaner submission flow.',
  },
  {
    icon: Bell,
    title: 'Transparent status tracking',
    description: 'Keep citizens aware of what is pending, in progress, or resolved.',
  },
  {
    icon: Shield,
    title: 'Admin resolution workflow',
    description: 'Authorities can triage complaints, upload proof, and close the loop quickly.',
  },
];

const steps = [
  { title: 'Discover', description: 'Citizens land on the public site and understand the platform.' },
  { title: 'Sign in', description: 'A dedicated `/signin` page acts as the handoff into the app.' },
  { title: 'Work inside /home', description: 'Dashboard tools live in a protected workspace with persistent navigation.' },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_22%),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.18),transparent_20%),linear-gradient(135deg,#082f49_0%,#0f172a_45%,#111827_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Civic response re-architected
            </span>
            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Public landing outside.
              <br />
              <span className="text-cyan-300">Operational dashboard inside `/home`.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              CivicEase now follows a cleaner product flow inspired by `acm2k26`: users start on a focused landing
              page, sign in intentionally, and then enter a dashboard workspace for complaint actions.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:scale-[1.02] hover:bg-cyan-300"
              >
                Sign in to dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Open sign in
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-[28px] border border-white/10 bg-white/6 p-6 text-white backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Step {index + 1}</p>
                <h2 className="mt-4 text-2xl font-black tracking-tight">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-700">Initial architecture</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Similar flow, cleaner separation of concerns.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The landing page is now purely for orientation and trust-building. Complaint management belongs to the
              dashboard shell, just like the route-first structure in `acm2k26`.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-[30px] border border-slate-200 bg-white/85 p-8 shadow-lg shadow-slate-950/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[36px] bg-slate-950 text-white shadow-2xl shadow-slate-950/10">
            <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">Why this matters</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight">Users no longer hit dashboard features too early.</h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                  The app now uses a clear split: landing at `/`, authentication at `/signin`, and all product features
                  inside `/home/*` with backend-enforced roles.
                </p>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/5 p-7">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6 text-cyan-300" />
                  <h3 className="text-2xl font-black tracking-tight">Next stop: dashboard</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Continue into the sign-in screen and enter the citizen or admin workspace based on the role you want to test.
                </p>
                <Link
                  to="/signin"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
                >
                  Open sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
