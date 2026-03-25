import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Bot, ClipboardList, FilePlus2, FolderKanban, HelpCircle, Layers3, LibraryBig, LogOut, Menu, MessageSquare, X, User } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/useAuth';
import { canAccessAdminIssues, canCreateAdminResource, isMainAdmin, canAccessEmployeePanel } from '../lib/auth';
import Grainient from '../components/bg/Grainient';
import DashboardHeader from '../components/DashboardHeader';

const box_shadow = 'shadow-[0_4px_20px_rgba(0,0,0,0.03)]';

const navItems = [
  { to: '/home', label: 'Overview', icon: FolderKanban, end: true },
  { to: '/home/issues/new', label: 'Report Issue', icon: FilePlus2 },
  { to: '/home/issues/me', label: 'My Issues', icon: ClipboardList },
  { to: '/home/community', label: 'Community', icon: MessageSquare },
  { to: '/home/resources', label: 'Resources', icon: LibraryBig },
  { to: '/home/assistant', label: 'Voice Assistant', icon: Bot },
  { to: '/home/chatbot', label: 'AI Chatbot', icon: Bot },
  { to: '/home/profile', label: 'My Profile', icon: User },
];

function SidebarLink({ to, label, icon, end = false, collapsed, onClick }) {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out ${isActive
          ? 'bg-sky-50 text-neutral-900 font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_2px_rgba(14,165,233,0.1)] border border-sky-100/50'
          : 'text-neutral-700 hover:bg-sky-50/50 hover:text-neutral-900'
        } ${collapsed ? 'justify-center' : ''}`
      }
      title={collapsed ? label : ''}
    >
      <div className="group-hover:scale-105 group-hover:text-gray-700 transition-all duration-200">
        <Icon className="h-5 w-5" />
      </div>
      {!collapsed && <span className="text-[14px] font-medium tracking-tight">{label}</span>}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const hasAdminAccess = canAccessAdminIssues(appUser) || isMainAdmin(appUser) || canCreateAdminResource(appUser);
  const hasEmployeeAccess = canAccessEmployeePanel(appUser);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileDrawerOpen]);

  /* ── Shared sidebar content ── */
  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 sm:p-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
          <Building2 className="h-5 w-5" />
        </span>
        {(isMobile || !sidebarCollapsed) && (
          <span className="text-lg font-bold text-slate-900 tracking-tight">CivicEase</span>
        )}
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-neutral-100" />

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarLink
            key={item.to}
            {...item}
            collapsed={isMobile ? false : sidebarCollapsed}
            onClick={isMobile ? () => setMobileDrawerOpen(false) : undefined}
          />
        ))}
      </nav>

      {/* Bottom area */}
      <div className="mx-4 border-t border-neutral-100" />
      <div className="px-3 py-3 space-y-1">
        {hasAdminAccess && (
          <button
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/50 transition-all duration-200 ease-in-out ${(!isMobile && sidebarCollapsed) ? 'justify-center' : ''}`}
            title={(!isMobile && sidebarCollapsed) ? 'Admin Panel' : ''}
            onClick={() => {
              navigate('/admin/issues');
              if (isMobile) setMobileDrawerOpen(false);
            }}
          >
            <div className="group-hover:scale-105 transition-all duration-200">
              <Layers3 className="h-[18px] w-[18px]" />
            </div>
            {(isMobile || !sidebarCollapsed) && <span className="text-[14px] font-semibold tracking-tight">Admin Panel</span>}
          </button>
        )}

        {hasEmployeeAccess && (
          <button
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-amber-700 hover:text-amber-900 hover:bg-amber-50/50 transition-all duration-200 ease-in-out ${(!isMobile && sidebarCollapsed) ? 'justify-center' : ''}`}
            title={(!isMobile && sidebarCollapsed) ? 'Employee Panel' : ''}
            onClick={() => {
              navigate('/employee/issues');
              if (isMobile) setMobileDrawerOpen(false);
            }}
          >
            <div className="group-hover:scale-105 transition-all duration-200">
              <ClipboardList className="h-[18px] w-[18px]" />
            </div>
            {(isMobile || !sidebarCollapsed) && <span className="text-[14px] font-semibold tracking-tight">Employee Panel</span>}
          </button>
        )}

        <button
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-sky-50/50 transition-all duration-200 ease-in-out ${(!isMobile && sidebarCollapsed) ? 'justify-center' : ''}`}
          title={(!isMobile && sidebarCollapsed) ? 'Help & Support' : ''}
        >
          <div className="group-hover:scale-105 group-hover:text-gray-700 transition-all duration-200">
            <HelpCircle className="h-[18px] w-[18px]" />
          </div>
          {(isMobile || !sidebarCollapsed) && <span className="text-[14px] font-medium tracking-tight">Help & Support</span>}
        </button>

        <button
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ease-in-out ${(!isMobile && sidebarCollapsed) ? 'justify-center' : ''}`}
          title={(!isMobile && sidebarCollapsed) ? 'Sign out' : ''}
          onClick={async () => {
            await auth.signOut();
            navigate('/signin');
            if (isMobile) setMobileDrawerOpen(false);
          }}
        >
          <div className="group-hover:scale-105 transition-all duration-200">
            <LogOut className="h-[18px] w-[18px]" />
          </div>
          {(isMobile || !sidebarCollapsed) && <span className="text-[14px] font-medium tracking-tight">Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Grainient
          color1="#c5e0fc"
          color2="#3b82f6"
          color3="#0a5eb9"
          timeSpeed={0.15}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={3}
          grainAmount={0.17}
          grainScale={2}
          grainAnimated={false}
          contrast={1.1}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="flex h-full w-full z-10 relative">
        {/* ═══ Mobile hamburger top bar ═══ */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="text-base font-bold text-slate-900 tracking-tight">CivicEase</span>
        </div>

        {/* ═══ Mobile drawer overlay ═══ */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}

        {/* ═══ Mobile slide-out sidebar ═══ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          {sidebarContent(true)}
        </aside>

        {/* ═══ Desktop sidebar (unchanged) ═══ */}
        <div className="h-full p-5 shrink-0 hidden md:block">
          <aside
            className={`${sidebarCollapsed ? 'w-20' : 'w-[260px]'} ${box_shadow} bg-white rounded-[24px] h-full flex flex-col transition-all duration-300 ease-in-out`}
          >
            {sidebarContent(false)}
          </aside>
        </div>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 overflow-y-auto w-full h-full pt-[68px] px-4 pb-6 md:pt-8 md:px-10 md:pb-10">
          <div className="max-w-6xl mx-auto w-full">
            <DashboardHeader />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
