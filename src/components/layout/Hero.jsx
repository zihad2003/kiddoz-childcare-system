import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';
import heroImg from '../../assets/images/landing/hero_new.png';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user && ['superadmin', 'admin', 'teacher', 'nurse', 'nanny'].includes(user.role);

  return (
    <div className="relative overflow-hidden bg-slate-50 pt-20 pb-20 md:pt-32 md:pb-48">
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 1s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[120%] bg-gradient-to-b from-primary-50 via-white to-slate-50 -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/40 rounded-full blur-[100px] animate-blob -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-200/40 rounded-full blur-[120px] animate-blob animation-delay-2000 -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
        {/* Text Content */}
        <div className="flex-1 text-left lg:pr-10 z-10">
          <div className="opacity-0 animate-fade-in-up">
            <Badge color="bg-primary-100 text-primary-700 border border-primary-200 mb-6 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              Next Generation Childcare
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1] text-slate-900 opacity-0 animate-fade-in-up delay-100">
            Safe. Smart. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-400 to-secondary-300 animate-gradient-x bg-[length:200%_auto]">
              Connected.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed opacity-0 animate-fade-in-up delay-200">
            KiddoZ is the complete ecosystem for modern families. Experience peace of mind with <span className="text-primary-600 font-bold bg-primary-50 px-1 rounded">AI Health Tracking</span> and real-time <span className="text-secondary-500 font-bold bg-secondary-50 px-1 rounded">Smart Monitoring</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-300">
            {!isStaff && (
              <button
                onClick={() => navigate('/tour')}
                className="group relative bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="flex items-center gap-2">
                  Book a Virtual Tour
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </button>
            )}
            <button
              onClick={() => navigate('/enroll')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-8 py-4 rounded-2xl transition hover:shadow-lg hover:border-primary-200"
            >
              Enroll Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center gap-6 pt-8 border-t border-slate-100 opacity-0 animate-fade-in-up delay-300">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm transition-transform hover:scale-110 z-0 hover:z-10">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="parent" />
                </div>
              ))}
            </div>
            <div className="text-slate-500 text-sm">
              <span className="font-bold text-slate-900 block">500+ Happy Families</span> trust KiddoZ
            </div>
          </div>
        </div>

        {/* Hero Image / Animation Area */}
        <div className="flex-1 relative group w-full max-w-2xl lg:max-w-none opacity-0 animate-slide-in-right delay-200">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-secondary-400 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-700 -rotate-3 animate-pulse" />
          <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl transform transition duration-700 hover:scale-[1.01] rotate-1 hover:rotate-0 bg-white">
            <img
              src={heroImg}
              alt="KiddoZ Learning Environment"
              className="w-full h-auto object-cover aspect-[4/3] transform transition duration-700 group-hover:scale-105"
            />
            {/* Overlay UI elements */}
            <div className="absolute top-6 right-6 glass p-4 rounded-2xl shadow-xl animate-float backdrop-blur-md bg-white/30 border border-white/40">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest text-shadow-sm">Live View</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 glass-dark p-4 rounded-2xl shadow-xl backdrop-blur-xl bg-slate-900/80 border border-white/10 animate-float delay-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">A+</div>
                <div>
                  <div className="text-[10px] uppercase text-slate-300 font-bold tracking-widest leading-none mb-1">Health Score</div>
                  <div className="text-lg font-black text-white leading-none">Perfect</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating decorative cards */}
          <div className="absolute -top-10 -right-5 w-24 h-24 bg-gradient-to-br from-secondary-300 to-secondary-400 rounded-3xl -z-10 animate-float delay-100 shadow-xl opacity-80" />
          <div className="absolute -bottom-10 -left-5 w-32 h-32 bg-gradient-to-tr from-primary-400 to-secondary-400 rounded-[3rem] -z-10 animate-float delay-500 shadow-xl opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
