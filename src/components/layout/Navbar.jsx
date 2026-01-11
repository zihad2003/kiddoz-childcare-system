import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = ({ view, setView, user, handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ target, label, icon: Icon }) => (
    <button
      onClick={() => { setView(target); setMobileMenuOpen(false); }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium ${view === target ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
        }`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );

  // Admin View Navbar
  if (view === 'admin' && user) return (
    <nav className="glass sticky top-0 z-40 border-b border-purple-100 shadow-sm bg-purple-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">K</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">Kiddo<span className="text-purple-600">Z</span></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm font-bold text-slate-700">Staff Access</p>
              <p className="text-xs text-slate-400">{user.email || 'Admin User'}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition font-medium text-sm shadow-sm">
              <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Default Navbar
  return (
    <nav className="glass sticky top-0 z-40 border-b-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform rotate-3">K</div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-800">Kiddo<span className="text-purple-600">Z</span></span>
          </div>
          <div className="hidden md:flex space-x-1 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <NavItem target="home" label="Home" />
            <NavItem target="programs" label="Programs" />
            <NavItem target="enroll" label="Pricing & Enroll" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition shadow-lg font-semibold"><User size={18} /> Parent Portal</button>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition bg-slate-50 p-2 rounded-full hover:bg-red-50"><LogOut size={20} /></button>
              </>
            ) : (
              <button onClick={() => setView('login')} className="text-purple-600 font-bold hover:text-purple-800 px-6 py-2">Log In</button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 bg-slate-100 p-2 rounded-lg">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2 shadow-lg">
          <NavItem target="home" label="Home" />
          <NavItem target="programs" label="Programs" />
          <NavItem target="enroll" label="Enroll" />
          {user ? (
            <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2"><User size={18} /> Parent Portal</button>
          ) : (<NavItem target="login" label="Login" />)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;