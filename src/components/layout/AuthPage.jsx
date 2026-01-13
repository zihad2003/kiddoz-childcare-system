import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const AuthPage = ({ auth, db }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Determine mode based on URL
  const isSignUp = location.pathname === '/signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear error when switching modes
  useEffect(() => {
    setError('');
  }, [location.pathname]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      addToast(isSignUp ? 'Account created successfully! Welcome.' : 'Signed in successfully. Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
      if (err.code === 'auth/invalid-email') msg = "Invalid email address.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 chars.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 p-4 font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      <Card className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in duration-500 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-lg shadow-purple-200">K</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500">{isSignUp ? 'Join the KiddoZ family today' : 'Sign in to continue to KiddoZ'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 mb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="(555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>
          <Button type="submit" isLoading={loading} className="w-full h-12 text-lg shadow-lg shadow-purple-200 mt-2">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate(isSignUp ? '/login' : '/signup')}
              className="text-sm text-purple-600 font-bold hover:text-purple-700 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-400">or try demo access</span></div>
        </div>

        {/* Demo Mini Bar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">One-Click Demo Entry</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={async () => { await signInAnonymously(auth); navigate('/dashboard'); }}
              className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition group"
            >
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform"><User size={20} /></div>
              <span className="text-xs font-bold text-slate-700">Parent View</span>
            </button>
            <button
              onClick={async () => { await signInAnonymously(auth); navigate('/admin'); }}
              className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition group"
            >
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
              <span className="text-xs font-bold text-slate-700">Admin View</span>
            </button>
          </div>
        </div>

        <div className="pt-6 text-center">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-purple-600 font-bold transition flex items-center justify-center gap-2 mx-auto text-sm">
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;