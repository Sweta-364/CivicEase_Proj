import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, Bot, ClipboardList, FilePlus2, FolderKanban, HelpCircle, Layers3, LibraryBig, LogOut, MessageSquare } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/useAuth';
import { canAccessAdminIssues, canCreateAdminResource, isMainAdmin } from '../lib/auth';
import Grainient from '../components/bg/Grainient';
import DashboardHeader from '../components/DashboardHeader';

const box_shadow = 'shadow-[0_4px_20px_rgba(0,0,0,0.03)]';

const navItems = [
  { to: '/home', label: 'Overview', icon: FolderKanban, end: true },
  { to: '/home/issues/new', label: 'Report Issue', icon: FilePlus2 },
  { to: '/home/issues/me', label: 'My Issues', icon: ClipboardList },
  { to: '/home/community', label: 'Community', icon: MessageSquare },
  { to: '/home/resources', label: 'Resources', icon: LibraryBig },
  { to: '/home/assistant', label: 'Assistant', icon: Bot },
];

const adminNavItems = [
  { to: '/home/admin/issues', label: 'Admin Issues', icon: Layers3, check: 'adminIssues' },
  { to: '/home/admin/departments', label: 'Departments', icon: Layers3, check: 'mainAdmin' },
  { to: '/home/admin/clusters', label: 'Clusters', icon: Layers3, check: 'mainAdmin' },
  { to: '/home/admin/resources/new', label: 'Publish Resource', icon: LibraryBig, check: 'adminResource' },
];

function SidebarLink({ to, label, icon, end = false, collapsed }) {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out ${
          isActive
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
  const { appUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const visibleAdminItems = adminNavItems.filter((item) => {
    if (item.check === 'adminIssues') return canAccessAdminIssues(appUser);
    if (item.check === 'mainAdmin') return isMainAdmin(appUser);
    if (item.check === 'adminResource') return canCreateAdminResource(appUser);
    return false;
  });

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
        {/* Sidebar */}
        <div className="h-full p-5 shrink-0">
          <aside
            className={`${sidebarCollapsed ? 'w-20' : 'w-[260px]'} ${box_shadow} bg-white rounded-[24px] h-full flex flex-col transition-all duration-300 ease-in-out`}
          >
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              {!sidebarCollapsed && <span className="text-lg font-bold text-slate-900 tracking-tight">CivicEase</span>}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-neutral-100" />

            {/* Navigation */}
            <nav className="flex-1 px-3 pt-4 pb-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <SidebarLink key={item.to} {...item} collapsed={sidebarCollapsed} />
              ))}

              {visibleAdminItems.length > 0 && (
                <>
                  <div className="mx-1 my-3 border-t border-neutral-100" />
                  {visibleAdminItems.map((item) => (
                    <SidebarLink key={item.to} {...item} collapsed={sidebarCollapsed} />
                  ))}
                </>
              )}
            </nav>

            {/* Bottom area */}
            <div className="mx-4 border-t border-neutral-100" />
            <div className="px-3 py-3 space-y-1">
              <button
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-sky-50/50 transition-all duration-200 ease-in-out ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? 'Help & Support' : ''}
              >
                <div className="group-hover:scale-105 group-hover:text-gray-700 transition-all duration-200">
                  <HelpCircle className="h-[18px] w-[18px]" />
                </div>
                {!sidebarCollapsed && <span className="text-[14px] font-medium tracking-tight">Help & Support</span>}
              </button>

              <button
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ease-in-out ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? 'Sign out' : ''}
                onClick={async () => {
                  await auth.signOut();
                  navigate('/signin');
                }}
              >
                <div className="group-hover:scale-105 transition-all duration-200">
                  <LogOut className="h-[18px] w-[18px]" />
                </div>
                {!sidebarCollapsed && <span className="text-[14px] font-medium tracking-tight">Sign out</span>}
              </button>
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto w-full h-full">
          <div className="max-w-6xl mx-auto w-full">
            <DashboardHeader />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
