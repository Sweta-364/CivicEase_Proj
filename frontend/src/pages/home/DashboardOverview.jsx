import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FilePlus2, LibraryBig, MessageSquare, Bot, MessagesSquare, Wrench } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/useAuth';
import { canAccessAdminIssues, canAccessEmployeePanel, isMainAdmin } from '../../lib/auth';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function DashboardOverview() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({ myIssues: 0, resources: 0, posts: 0, assignedIssues: 0 });

  useEffect(() => {
    async function load() {
      try {
        const employeeIssuesRequest = canAccessEmployeePanel(appUser)
          ? api.get('/v1/employee/issues')
          : Promise.resolve({ data: { total: 0 } });

        const [issues, resources, posts, employeeIssues] = await Promise.all([
          api.get('/v1/issues/me'),
          api.get('/v1/resources'),
          api.get('/v1/community/posts?sort=hot'),
          employeeIssuesRequest,
        ]);
        setStats({
          myIssues: issues.data.total ?? 0,
          resources: resources.data.length ?? 0,
          posts: posts.data.length ?? 0,
          assignedIssues: employeeIssues.data.total ?? 0,
        });
      } catch (error) {
        console.error('Overview load failed', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appUser]);

  if (loading) return <DashboardOverviewSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20 text-gray-900">
      {/* Quick Action - 7 / 5 split */}
      <Link
        to="/home/issues/new"
        className="md:col-span-7 group flex items-center justify-between rounded-xl bg-sky-700/70 p-6 text-white shadow-sm ring-1 ring-sky-800/50 opacity-95 transition-all duration-200 hover:opacity-100 hover:shadow-md"
      >
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white mb-1">Report an Issue</h3>
          <p className="text-sky-100 text-sm font-medium">Submit and track civic issues in your neighborhood.</p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center">
          <FilePlus2 className="h-6 w-6 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </Link>

      <Link
        to="/home/community"
        className="md:col-span-5 group flex items-center justify-between rounded-xl bg-sky-50 p-6 text-gray-900 shadow-sm ring-1 ring-sky-200 hover:bg-sky-100 transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-1">Community</h3>
          <p className="text-gray-800 text-sm font-medium">Join discussions with your neighbors</p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center text-gray-700 group-hover:translate-x-1 transition-transform duration-200 ease-in-out">
          <MessageSquare className="h-6 w-6" />
        </div>
      </Link>

      {/* Stats - 4 / 8 split */}
      <div className="md:col-span-4 flex flex-col gap-8">
        <div className={static_card_style}>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Your Activity</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{stats.myIssues}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Issues Filed</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tracking-tight text-gray-900">{stats.posts}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Community Posts</p>
            </div>
          </div>
        </div>

        <div className={`${static_card_style} flex-1`}>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Available</p>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold tracking-tight text-gray-900">{stats.resources}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Resources</p>
            </div>
            {canAccessEmployeePanel(appUser) && (
              <div>
                <p className="text-3xl font-bold tracking-tight text-gray-900">{stats.assignedIssues}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Assigned to You</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links - 8 col */}
      <div className={`md:col-span-8 ${static_card_style}`}>
        <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-5">Quick Access</h2>
        <div className="space-y-4">
          {[
            { to: '/home/issues/new', label: 'Create a new issue', description: 'Report infrastructure or civic problems in your area.', icon: FilePlus2 },
            { to: '/home/issues/me', label: 'Track my issues', description: 'See the status and updates of your filed reports.', icon: ClipboardList },
            { to: '/home/chatbot', label: 'Open AI chatbot', description: 'Chat with the Cerebras Qwen assistant, attach photos, share location, and create complaints.', icon: MessagesSquare },
            ...(canAccessEmployeePanel(appUser)
              ? [{ to: '/employee/issues', label: 'Handle assigned issues', description: 'Open the employee panel to update the complaints allocated to you.', icon: Wrench }]
              : []),
            { to: '/home/community', label: 'Open community discussions', description: 'Share ideas and participate in local conversations.', icon: MessageSquare },
            { to: '/home/resources', label: 'Browse resources', description: 'Access guides and documents shared by administrators.', icon: LibraryBig },
            { to: '/home/assistant', label: 'Ask assistant', description: 'Get AI-powered help with your civic needs.', icon: Bot },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between gap-4 rounded-xl ring-1 ring-gray-100 bg-gray-50 p-5 transition-all duration-200 hover:shadow-sm hover:bg-gray-100/50 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 shadow-sm">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.label}</p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Links */}
      {(canAccessAdminIssues(appUser) || isMainAdmin(appUser)) && (
        <div className={`md:col-span-12 ${static_card_style}`}>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-5">Administration</h2>
          <div className="flex gap-3 flex-wrap">
            {canAccessAdminIssues(appUser) && (
              <Link
                to="/admin/issues"
                className="rounded-full ring-1 ring-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-100"
              >
                Admin issue queue
              </Link>
            )}
            {isMainAdmin(appUser) && (
              <>
                <Link
                  to="/admin/departments"
                  className="rounded-full ring-1 ring-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-100"
                >
                  Manage departments
                </Link>
                <Link
                  to="/admin/clusters"
                  className="rounded-full ring-1 ring-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-100"
                >
                  Issue clusters
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {canAccessEmployeePanel(appUser) && (
        <div className={`md:col-span-12 ${static_card_style}`}>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-5">Employee Workspace</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/employee/issues"
              className="rounded-full ring-1 ring-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition-colors duration-200 hover:bg-emerald-100"
            >
              Open employee panel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
