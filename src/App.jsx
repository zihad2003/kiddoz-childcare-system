import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// Modules - Layout & UI
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Footer from './components/layout/Footer';
import Programs from './components/layout/Programs';
import AuthPage from './components/layout/AuthPage';

// Modules - Functional Dashboards
import EnrollmentPage from './components/enrollment/EnrollmentPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ParentDashboard from './components/dashboard/ParentDashboard';
import Chatbot from './components/ai/Chatbot';
import InfoPage from './components/layout/InfoPage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuqk1xwSehbTEuPsJ5rJdMOioRIc6LndI",
  authDomain: "kiddoz-163cd.firebaseapp.com",
  projectId: "kiddoz-163cd",
  storageBucket: "kiddoz-163cd.firebasestorage.app",
  messagingSenderId: "352290108946",
  appId: "1:352290108946:web:4a89579bfa3c6fa18d8acb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
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

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  // Loading State UI
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-600" />
    </div>
  );

  // Authentication View
  if (view === 'login') return <AuthPage auth={auth} setView={setView} />;

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col">
      <Navbar
        view={view}
        setView={setView}
        user={user}
        handleLogout={handleLogout}
      />

      <main className="flex-grow">
        {/* Public Landing Pages */}
        {view === 'home' && <Hero setView={setView} />}
        {(view === 'home' || view === 'programs') && <Programs />}

        {/* Enrollment Wizard */}
        {view === 'enroll' && (
          <EnrollmentPage
            user={user}
            setView={setView}
            db={db}
            appId={appId}
            PLANS={PLANS}
          />
        )}

        {/* Protected Dashboard Views */}
        {view === 'admin' && user && (
          <AdminDashboard
            user={user}
            setView={setView}
            db={db}
            appId={appId}
          />
        )}

        {view === 'dashboard' && user && (
          <ParentDashboard
            user={user}
            setView={setView}
            db={db}
            appId={appId}
          />
        )}

        {/* Info Pages (Footer Links) */}
        {view === 'info-privacy' && <InfoPage type="privacy" />}
        {view === 'info-terms' && <InfoPage type="terms" />}
        {view === 'info-help' && <InfoPage type="help" />}
        {view === 'info-safety' && <InfoPage type="safety" />}
      </main>

      {view !== 'admin' && <Footer setView={setView} />}

      {/* Persistent AI Assistant */}
      <Chatbot user={user} />
    </div>
  );
}