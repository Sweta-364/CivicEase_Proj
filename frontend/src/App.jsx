import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SignIn from './pages/SignIn';
import DashboardHome from './pages/DashboardHome';
import ComplaintList from './components/ComplaintList';
import CreateComplaint from './components/CreateComplaint';
import AdminDashboard from './components/AdminDashboard';
import { getSessionUser, isAdmin } from './lib/auth';

function AdminHomeRedirect() {
  const user = getSessionUser();
  return <Navigate to={isAdmin(user) ? '/home/admin' : '/home'} replace />;
}

function CitizenComplaintList() {
  const user = getSessionUser();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (isAdmin(user)) {
    return <Navigate to="/home/admin" replace />;
  }
  return <ComplaintList userId={user.id} />;
}

function CitizenCreateComplaint() {
  const user = getSessionUser();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (isAdmin(user)) {
    return <Navigate to="/home/admin" replace />;
  }
  return <CreateComplaint />;
}

function ProtectedAdminRoute() {
  const user = getSessionUser();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (!isAdmin(user)) {
    return <Navigate to="/home" replace />;
  }
  return <AdminDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />

        <Route path="/home" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="overview" element={<AdminHomeRedirect />} />
          <Route path="my-complaints" element={<CitizenComplaintList />} />
          <Route path="report" element={<CitizenCreateComplaint />} />
          <Route path="admin" element={<ProtectedAdminRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
