import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { User, ShieldCheck, ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AuthPage = ({ auth }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 p-4 font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      <Card className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in duration-500 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-lg shadow-purple-200">K</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to continue to KiddoZ</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition" />
          </div>
          <Button className="w-full h-12 text-lg shadow-lg shadow-purple-200 mt-2">
            Sign In
          </Button>
        </div>

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