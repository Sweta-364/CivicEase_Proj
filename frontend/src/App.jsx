import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import SignIn from './pages/SignIn';
import DashboardOverview from './pages/home/DashboardOverview';
import IssuesNewPage from './pages/home/IssuesNewPage';
import MyIssuesPage from './pages/home/MyIssuesPage';
import IssueDetailPage from './pages/home/IssueDetailPage';
import CommunityPage from './pages/home/CommunityPage';
import CommunityPostPage from './pages/home/CommunityPostPage';
import ResourcesPage from './pages/home/ResourcesPage';
import AssistantPage from './pages/home/AssistantPage';
import AdminIssuesPage from './pages/home/AdminIssuesPage';
import AdminDepartmentsPage from './pages/home/AdminDepartmentsPage';
import AdminDepartmentPanelPage from './pages/home/AdminDepartmentPanelPage';
import AdminClustersPage from './pages/home/AdminClustersPage';
import AdminResourceCreatePage from './pages/home/AdminResourceCreatePage';
import AdminMapPage from './pages/home/AdminMapPage';
import { useAuth } from './context/useAuth';
import { canAccessAdminIssues, canCreateAdminResource, isMainAdmin } from './lib/auth';

function RequireAuth({ children }) {
  const { appUser, loading } = useAuth();
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/40 to-white">
      <div className="flex flex-col items-center gap-5">
        {/* Spinning logo ring */}
        <div className="relative">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-gray-200 border-t-sky-500" style={{ animationDuration: '1s' }} />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
          </div>
        </div>
        {/* Brand + status */}
        <div className="text-center">
          <p className="text-base font-bold tracking-tight text-slate-800">CivicEase</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Loading your workspace...</p>
        </div>
        {/* Animated progress bar */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-sky-400 to-cyan-400" style={{ animationDuration: '1s' }} />
        </div>
      </div>
    </div>
  );
  if (!appUser) return <Navigate to="/signin" replace />;
  return children;
}

function RequireMainAdmin({ children }) {
  const { appUser } = useAuth();
  if (!isMainAdmin(appUser)) return <Navigate to="/home" replace />;
  return children;
}

function RequireAdminIssuesAccess({ children }) {
  const { appUser } = useAuth();
  if (!canAccessAdminIssues(appUser)) return <Navigate to="/home" replace />;
  return children;
}

function RequireAdminResourceAccess({ children }) {
  const { appUser } = useAuth();
  if (!canCreateAdminResource(appUser)) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="issues/new" element={<IssuesNewPage />} />
          <Route path="issues/me" element={<MyIssuesPage />} />
          <Route path="issues/:issueId" element={<IssueDetailPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:postId" element={<CommunityPostPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="assistant" element={<AssistantPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="issues" replace />} />
          <Route
            path="map"
            element={
              <RequireAdminIssuesAccess>
                <AdminMapPage />
              </RequireAdminIssuesAccess>
            }
          />
          <Route
            path="issues"
            element={
              <RequireAdminIssuesAccess>
                <AdminIssuesPage />
              </RequireAdminIssuesAccess>
            }
          />
          <Route
            path="departments"
            element={
              <RequireMainAdmin>
                <AdminDepartmentsPage />
              </RequireMainAdmin>
            }
          />
          <Route
            path="departments/:departmentId"
            element={
              <RequireAdminIssuesAccess>
                <AdminDepartmentPanelPage />
              </RequireAdminIssuesAccess>
            }
          />
          <Route
            path="clusters"
            element={
              <RequireMainAdmin>
                <AdminClustersPage />
              </RequireMainAdmin>
            }
          />
          <Route
            path="resources/new"
            element={
              <RequireAdminResourceAccess>
                <AdminResourceCreatePage />
              </RequireAdminResourceAccess>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
