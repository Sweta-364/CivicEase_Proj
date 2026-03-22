import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BellRing, Building2, ClipboardList, FilePlus2, HelpCircle, LayoutDashboard, Shield } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { clearSessionUser, getSessionUser, isAdmin, signOutUser, syncFirebaseUserToSession } from '../lib/auth';

const citizenNav = [
  { label: 'Overview', href: '/home', icon: LayoutDashboard },
  { label: 'Report Issue', href: '/home/report', icon: FilePlus2 },
  { label: 'My Complaints', href: '/home/my-complaints', icon: ClipboardList },
];

const adminNav = [{ label: 'Admin Queue', href: '/home/admin', icon: Shield }];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [authChecked, setAuthChecked] = useState(() => Boolean(getSessionUser()));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const existing = getSessionUser();

      if (currentUser) {
        setUser(syncFirebaseUserToSession(currentUser));
        setAuthChecked(true);
        return;
      }

      if (existing?.role === 'admin') {
        setUser(existing);
        setAuthChecked(true);
        return;
      }

      if (existing?.role === 'citizen') {
        clearSessionUser();
      }

      setUser(null);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const navItems = useMemo(() => (isAdmin(user) ? adminNav : citizenNav), [user]);

  if (!authChecked) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f5fbff]">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.26),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.20),transparent_28%),linear-gradient(180deg,#f9fcff_0%,#eff7ff_55%,#f7fbff_100%)]" />

      <div className="relative z-10 flex h-full w-full">
        <div className="hidden h-full shrink-0 p-5 lg:block">
          <aside className="flex h-full w-[260px] flex-col rounded-[24px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center p-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-md">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight text-gray-800">CivicEase</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Response hub</p>
                </div>
              </Link>
            </div>

            <div className="mx-4 border-t border-neutral-100" />

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ease-in-out ${
                      active
                        ? 'border border-sky-100/70 bg-sky-50 text-neutral-900 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_2px_rgba(59,130,246,0.1)]'
                        : 'text-neutral-700 hover:bg-sky-50/60 hover:text-neutral-900'
                    }`}
                  >
                    <div className={`${active ? 'scale-105 text-sky-700' : 'group-hover:scale-105 group-hover:text-sky-700'} transition-all duration-200`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[14px] font-medium tracking-tight">{item.label}</span>
                  </Link>
                );
              })}

              {isAdmin(user) && (
                <div className="px-3 pt-3">
                  <div className="rounded-2xl bg-amber-50 px-4 py-4 text-xs leading-6 text-amber-800 ring-1 ring-amber-100">
                    Admin mode gives you direct control over complaint triage, progress updates, and proof uploads.
                  </div>
                </div>
              )}
            </nav>

            <div className="mx-4 border-t border-neutral-100" />
            <div className="px-3 py-3">
              <button
                onClick={async () => {
                  await signOutUser();
                  navigate('/signin');
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-700 transition-all duration-200 ease-in-out hover:bg-sky-50/60 hover:text-neutral-900"
              >
                <BellRing className="h-5 w-5 transition-all duration-200 group-hover:text-sky-700" />
                <span className="text-[14px] font-medium tracking-tight">Sign out</span>
              </button>
              <a
                href="#"
                className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-700 transition-all duration-200 ease-in-out hover:bg-sky-50/60 hover:text-neutral-900"
              >
                <HelpCircle className="h-5 w-5 transition-all duration-200 group-hover:text-sky-700" />
                <span className="text-[14px] font-medium tracking-tight">Help & Support</span>
              </a>
            </div>
          </aside>
        </div>

        <main className="h-full w-full flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
