import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
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
import AdminClustersPage from './pages/home/AdminClustersPage';
import AdminResourceCreatePage from './pages/home/AdminResourceCreatePage';
import { useAuth } from './context/useAuth';
import { canAccessAdminIssues, canCreateAdminResource, isMainAdmin } from './lib/auth';

function RequireAuth({ children }) {
  const { appUser, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-slate-500">Loading workspace...</div>;
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
