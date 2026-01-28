import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Modules - Layout & UI
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
import TourCTA from './components/layout/TourCTA';

import Preloader from './components/ui/Preloader';
import InteractivePreloader from './components/ui/InteractivePreloader';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuqk1xwSehbTEuPsJ5rJdMOioRIc6LndI",
  authDomain: "kiddoz-163cd.firebaseapp.com",
  projectId: "kiddoz-163cd",
  storageBucket: "kiddoz-163cd.firebasestorage.app",
  messagingSenderId: "352290108946",
  appId: "1:352290108946:web:4a89579bfa3c6fa18d8acb"
};

// Initialize Firebase (Data only)
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase Error:", e);
}
const appId = 'kiddoz-163cd';

// Pricing Plans Constant
const PLANS = [
  {
    id: 'basic',
    name: 'Little Explorer',
    price: '$450',
    period: '/month',
    features: ['Day Care (8AM - 4PM)', 'Healthy Snacks', 'Nap Time Monitoring', 'Daily Reports'],
    color: 'bg-blue-50 border-blue-100 text-blue-900',
    btnColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'growth',
    name: 'Growth Scholar',
    price: '$750',
    period: '/month',
    features: ['Pre-School Curriculum', 'Full Meals Included', 'Development Tracking', 'Access to Live View'],
    color: 'bg-purple-50 border-purple-100 text-purple-900',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    popular: true
  },
  {
    id: 'vip',
    name: 'VIP Guardian',
    price: '$1200',
    period: '/month',
    features: ['Extended Hours', 'Priority Nanny Booking', '1-on-1 Tutoring', 'Premium Health Insights'],
    color: 'bg-amber-50 border-amber-100 text-amber-900',
    btnColor: 'bg-amber-500 hover:bg-amber-600'
  }
];

function AppContent() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showApp, setShowApp] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Loading State UI
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-600" />
    </div>
  );

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      {!showApp && <InteractivePreloader onComplete={() => setShowApp(true)} />}
      <div className="bg-purple-600 text-white p-1 text-center text-[10px] z-[200] fixed top-0 w-full opacity-50">KiddoZ System Active</div>
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
            <Route path="/nanny-service" element={<NannyServiceDetails />} /> {/* Dedicated Nanny Route */}
            <Route path="/book-nanny" element={<NannyBookingPage />} /> {/* Nanny Booking Route */}
            <Route path="/programs/:programId" element={<ProgramDetails />} /> {/* Dynamic Route */}

            <Route path="/login" element={<AuthPage db={db} />} />
            <Route path="/signup" element={<AuthPage db={db} />} />

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
              <AdminDashboard user={user} handleLogout={handleLogout} />
            } />

            <Route path="/dashboard/*" element={
              <ParentDashboard user={user} db={db} appId={appId} />
            } />

            <Route path="/superadmin/*" element={
              <SuperAdminDashboard user={user} handleLogout={handleLogout} />
            } />

            <Route path="/dashboard" element={
              <ParentDashboard user={user} db={db} appId={appId} />
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