import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, User, Menu, X, ChevronDown, Home as HomeIcon, Info, Wrench, HelpCircle, Mail, FileText, Shield } from 'lucide-react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Existing components
import ComplaintList from './components/ComplaintList';
import CreateComplaint from './components/CreateComplaint';
import AdminDashboard from './components/AdminDashboard';

// New page components
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  // Cloudinary Setup
  const cld = new Cloudinary({ cloud: { cloudName: 'dfqft6ucv' } });

  // Sample Image for Testing/Demo
  const sampleImg = cld
    .image('cld-sample-5')
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500));

  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('civic_role');
    return savedRole === 'admin'
      ? { id: 2, email: 'admin@demo.com', role: 'admin' }
      : { id: 1, email: 'user@demo.com', role: 'citizen' };
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleUser = () => {
    if (user.role === 'citizen') {
      const newUser = { id: 2, email: 'admin@demo.com', role: 'admin' };
      setUser(newUser);
      localStorage.setItem('civic_role', 'admin');
    } else {
      const newUser = { id: 1, email: 'user@demo.com', role: 'citizen' };
      setUser(newUser);
      localStorage.setItem('civic_role', 'citizen');
    }
    setMobileMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Mail }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/30 to-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                    CivicEase
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                    Community Response
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation - Hidden for Admin */}
              {user.role === 'citizen' && (
                <div className="hidden lg:flex items-center gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Report Button - Desktop */}
                {user.role === 'citizen' && (
                  <Link
                    to="/report"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md hover:shadow-lg transition-all"
                  >
                    Report Issue
                  </Link>
                )}

                {/* Role Toggle */}
                <button
                  onClick={toggleUser}
                  className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
                    ${user.role === 'admin'
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:scale-[1.02]'
                      : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-2 border-blue-200/60 hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  {user.role === 'admin' ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Citizen</span>
                    </>
                  )}
                </button>

                {/* Mobile Menu Button - Hidden for Admin */}
                {user.role === 'citizen' && (
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Navigation - Hidden for Admin */}
            {mobileMenuOpen && user.role === 'citizen' && (
              <div className="lg:hidden border-t border-slate-200 py-4">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-all"
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  {user.role === 'citizen' && (
                    <Link
                      to="/report"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 mx-4 mt-4 px-4 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md"
                    >
                      Report Issue
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1">
          <Routes>
            {/* Admin-only route - if admin, always show dashboard */}
            {user.role === 'admin' ? (
              <>
                <Route path="*" element={<AdminDashboard />} />
              </>
            ) : (
              <>
                {/* Public Pages - Only for Citizens */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Citizen Functionality */}
                <Route path="/my-complaints" element={<ComplaintList userId={user.id} />} />
                <Route path="/report" element={<CreateComplaint userId={user.id} />} />

                {/* Redirect to home if trying to access admin as citizen */}
                <Route path="/admin" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>

        {/* Enhanced Footer - Hidden for Admin */}
        {user.role === 'citizen' && (
          <footer className="mt-auto border-t border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                {/* About Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                      CivicEase
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Empowering citizens to build better communities through transparent and efficient civic engagement.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><Link to="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">About Us</Link></li>
                    <li><Link to="/services" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Services</Link></li>
                    <li><Link to="/how-it-works" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">How It Works</Link></li>
                    <li><Link to="/faq" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">FAQ</Link></li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">Support</h3>
                  <ul className="space-y-2">
                    <li><Link to="/contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Contact Us</Link></li>
                    <li><a href="mailto:support@civicease.gov.in" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Email Support</a></li>
                    <li><a href="tel:1800-123-4567" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">1800-123-4567</a></li>
                    <li><Link to="/report" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Report Issue</Link></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                    <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Accessibility</a></li>
                    <li><a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Sitemap</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-8 border-t border-slate-200/60">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium">Powered by</span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                      <AdvancedImage cldImg={sampleImg} />
                    </div>
                    <span className="font-bold text-slate-700">Cloudinary</span>
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    © 2026 CivicEase. A Government of India Initiative. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
