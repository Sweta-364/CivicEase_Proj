import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Shield, Sparkles } from 'lucide-react';
import { auth, provider, signInWithPopup } from '../firebaseConfig';
import { useAuth } from '../context/useAuth';

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SignIn() {
  const navigate = useNavigate();
  const { refreshAppUser } = useAuth();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      await signInWithPopup(auth, provider);
      await refreshAppUser();
      navigate('/home');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setError(err?.response?.data?.detail || err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ─── LEFT PANEL ─── */}
      <div className="flex flex-1 flex-col justify-between bg-white px-8 py-10 sm:px-16 lg:px-24">
        {/* Logo / Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-900 transition hover:text-cyan-600"
        >
          CivicEase
        </Link>

        {/* Form area */}
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            className="group mt-10 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50/40 hover:shadow-lg hover:shadow-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {loadingGoogle ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connecting...
              </span>
            ) : (
              'Sign in with Google'
            )}
          </button>

          {/* Divider */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Secure access
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <Shield className="h-5 w-5 text-cyan-500" />
              <span className="text-xs font-semibold text-slate-600">Firebase Auth</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <span className="text-xs font-semibold text-slate-600">Role-based access</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400">
          © 2026 CivicEase. All rights reserved.
        </p>
      </div>

      {/* ─── RIGHT PANEL (Illustration) ─── */}
      <div className="hidden flex-col items-center justify-center overflow-hidden bg-[#0f172a] p-12 lg:flex lg:w-[48%]"
        style={{ position: 'relative' }}
      >
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px]" />
          <div className="absolute -bottom-32 -left-20 h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[80px]" />
        </div>

        {/* Illustration */}
        <div className="relative z-10 max-w-md flex flex-col items-center text-center">
          <img
            src="/signin-illustration.png"
            alt="CivicEase platform illustration"
            className="w-80 h-80 object-contain drop-shadow-2xl"
          />
          <h2 className="mt-10 text-3xl font-black tracking-tight text-white">
            Your city, <span className="text-cyan-400">your voice</span>
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-400">
            Report civic issues, track resolutions in real-time, and help build a better community — all from one platform.
          </p>
        </div>
      </div>
    </div>
  );
}
