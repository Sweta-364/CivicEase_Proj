import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Shield, UserRound } from 'lucide-react';
import { auth, provider, signInWithPopup } from '../firebaseConfig';
import { signInAsAdminDemo, syncFirebaseUserToSession } from '../lib/auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SignIn() {
  const navigate = useNavigate();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      syncFirebaseUserToSession(result.user);
      navigate('/home');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.24),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28%),linear-gradient(180deg,#f8fcff_0%,#eef7ff_100%)] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950">
          <Building2 className="h-4 w-4" />
          Back to landing page
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-950/15">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
              Initial architecture
            </span>
            <h1 className="mt-8 max-w-xl text-5xl font-black tracking-tight">
              Landing first, sign in next, dashboard at <span className="text-cyan-300">`/home`</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This flow now matches the `acm2k26` pattern more closely: public discovery stays separate, and operational
              features live inside a dedicated dashboard shell after sign-in.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['Landing page', 'Google sign-in', 'Dashboard workspace'].map((step, index) => (
                <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                  <p className="mt-3 text-lg font-bold text-white">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl shadow-sky-950/5 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Choose a workspace</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Continue into CivicEase</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Citizens now sign in with Google using the same Firebase pattern as `acm2k26`. A demo admin entry remains available for operations testing.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="group w-full rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-800" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">Citizen access</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Enter the citizen dashboard with Firebase Google sign-in, then report issues and track progress from `/home`.
                </p>
                <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  <GoogleIcon />
                  {loadingGoogle ? 'Connecting...' : 'Continue with Google'}
                </div>
              </button>

              <button
                onClick={() => {
                  signInAsAdminDemo();
                  navigate('/home/admin');
                }}
                className="group w-full rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-800" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">Admin demo access</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Open the operations workspace to manage complaints, update ticket status, and verify resolutions.
                </p>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
