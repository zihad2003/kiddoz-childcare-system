import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Modules - Layout & UI
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Footer from './components/layout/Footer';
import Programs from './components/layout/Programs';
import NannyService from './components/layout/NannyService';
import NannyServiceDetails from './components/layout/NannyServiceDetails';
import NannyBookingPage from './components/layout/NannyBookingPage';
import ProgramDetails from './components/layout/ProgramDetails'; // Import Details Page
import AuthPage from './components/layout/AuthPage';

// Modules - Functional Dashboards (Lazy Loaded)
const EnrollmentPage = React.lazy(() => import('./components/enrollment/EnrollmentPage'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./components/superadmin/SuperAdminDashboard'));
const ParentDashboard = React.lazy(() => import('./components/dashboard/ParentDashboard'));
const StudentProfile = React.lazy(() => import('./components/dashboard/StudentProfile'));

import Chatbot from './components/ai/Chatbot';
import InfoPage from './components/layout/InfoPage';
import TourBookingPage from './components/layout/TourBookingPage';
import ScrollToTop from './components/utils/ScrollToTop';
import TourCTA from './components/layout/TourCTA';

import Preloader from './components/ui/Preloader';
import InteractivePreloader from './components/ui/InteractivePreloader';

import { auth } from './firebase';

const appId = 'kiddoz-163cd';

// Pricing Plans Constant
// Pricing Plans Constant (Support BDT)
const PLANS = [
  {
    id: 'basic',
    name: 'Little Explorer',
    price: '৳15,000',
    period: '/month',
    features: ['Day Care (8AM - 4PM)', 'Healthy Snacks', 'Nap Time Monitoring', 'Daily Reports'],
    color: 'bg-blue-50 border-blue-100 text-blue-900',
    btnColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'growth',
    name: 'Growth Scholar',
    price: '৳25,000',
    period: '/month',
    features: ['Pre-School Curriculum', 'Full Meals Included', 'Development Tracking', 'Access to Live View'],
    color: 'bg-purple-50 border-purple-100 text-purple-900',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    popular: true
  },
  {
    id: 'vip',
    name: 'VIP Guardian',
    price: '৳45,000',
    period: '/month',
    features: ['Extended Hours', 'Priority Nanny Booking', '1-on-1 Tutoring', 'Premium Health Insights'],
    color: 'bg-amber-50 border-amber-100 text-amber-900',
    btnColor: 'bg-amber-500 hover:bg-amber-600'
  }
];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showApp, setShowApp] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Preloader and Global Loading
  if (loading && !showApp) return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Synchronizing Identity...</p>
    </div>
  );

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      {!showApp && <InteractivePreloader onComplete={() => setShowApp(true)} />}
      <ScrollToTop />
      {!location.pathname.startsWith('/superadmin') && (
        <Navbar
          user={user}
          handleLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
          </div>
        }>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Programs />
                <NannyService />
                <TourCTA />
              </>
            } />

            <Route path="/programs" element={<Programs />} />
            <Route path="/nanny-service" element={<NannyServiceDetails />} />
            <Route path="/book-nanny" element={<NannyBookingPage />} />
            <Route path="/programs/:programId" element={<ProgramDetails />} />

            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            <Route path="/enroll/*" element={
              <EnrollmentPage
                user={user}
                db={db}
                appId={appId}
                PLANS={PLANS}
              />
            } />

            <Route path="/tour" element={<TourBookingPage />} />

            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'nurse', 'nanny']}>
                <AdminDashboard user={user} handleLogout={handleLogout} />
              </ProtectedRoute>
            } />

            <Route path="/superadmin/*" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard user={user} handleLogout={handleLogout} />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/*" element={
              <ProtectedRoute allowedRoles={['parent', 'admin']}>
                <ParentDashboard user={user} db={db} appId={appId} />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['parent', 'admin']}>
                <ParentDashboard user={user} db={db} appId={appId} />
              </ProtectedRoute>
            } />

            <Route path="/student/:id" element={<StudentProfile db={db} appId={appId} />} />

            {/* Info Pages */}
            <Route path="/info/privacy" element={<InfoPage type="privacy" />} />
            <Route path="/info/terms" element={<InfoPage type="terms" />} />
            <Route path="/info/help" element={<InfoPage type="help" />} />
            <Route path="/info/safety" element={<InfoPage type="safety" />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Hide footer on Admin pages */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/superadmin') && <Footer />}

      {/* Persistent AI Assistant */}
      <Chatbot user={user} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ToastProvider>
  );
}