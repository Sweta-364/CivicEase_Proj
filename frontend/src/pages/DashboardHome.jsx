import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, BarChart3, FilePlus2, LayoutPanelTop } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import { getSessionUser, isAdmin } from '../lib/auth';

const staticCardStyle = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

function EmptyGridCard({ className = '', title = '', subtitle = '' }) {
  return (
    <div className={`${staticCardStyle} ${className}`}>
      <div className="h-full min-h-[180px] rounded-xl border border-dashed border-slate-200 bg-slate-50/70" />
      {(title || subtitle) && (
        <div className="mt-4">
          {title && <p className="text-sm font-semibold tracking-tight text-slate-500">{title}</p>}
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const user = getSessionUser();

  if (!user) return <Navigate to="/signin" replace />;
  if (isAdmin(user)) return <Navigate to="/home/admin" replace />;

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle="Grid structure aligned to the acm2k26-style overview shell."
        user={user}
        metrics={[]}
      />

      <div className="grid grid-cols-1 gap-8 pb-20 text-gray-900 md:grid-cols-12">
        <div className="md:col-span-7 flex items-center justify-between rounded-xl bg-sky-700/90 p-6 text-white shadow-sm ring-1 ring-sky-800/40">
          <div>
            <h3 className="mb-1 text-xl font-bold tracking-tight text-white">Report Center</h3>
            <p className="text-sm font-medium text-sky-100">Create new issues and keep your neighborhood updates in motion.</p>
          </div>
          <Link to="/home/report" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <FilePlus2 className="h-5 w-5" />
          </Link>
        </div>

        <EmptyGridCard className="md:col-span-5" />

        <EmptyGridCard className="md:col-span-12" />

        <EmptyGridCard className="md:col-span-4" />

        <EmptyGridCard className="md:col-span-8" />

        <EmptyGridCard className="md:col-span-12" />

        <EmptyGridCard className="md:col-span-7" />

        <EmptyGridCard className="md:col-span-5" />

        <div className="pt-6 md:col-span-12">
          <h2 className="mb-6 text-lg font-bold tracking-tight text-gray-900">Recommended Resources</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: 'How to file stronger civic reports', description: 'A concise guide for writing complaint descriptions that speed up routing and action.', category: 'Reporting guide', type: 'Guide', icon: FilePlus2, href: '/home/report' },
              { title: 'Complaint lifecycle explained', description: 'Understand what pending, working, solved, and invalid statuses really mean in practice.', category: 'Workflow', type: 'Reference', icon: LayoutPanelTop, href: '/home/my-complaints' },
              { title: 'Neighborhood issue trends', description: 'Use your dashboard activity to notice repeat infrastructure or sanitation problems nearby.', category: 'Insights', type: 'Insight', icon: BarChart3, href: '/home/my-complaints' },
            ].map((resource) => {
              const Icon = resource.icon;
              return (
                <article key={resource.title} className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:ring-black/10">
                  <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-white">
                    <Icon className="h-12 w-12 text-sky-600" />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm backdrop-blur-sm">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="line-clamp-2 text-base font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-800">
                      {resource.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{resource.description}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{resource.category}</span>
                      <Link to={resource.href} className="flex items-center gap-1 text-sm font-bold text-gray-700 transition-colors duration-200 hover:text-gray-900">
                        Open
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
