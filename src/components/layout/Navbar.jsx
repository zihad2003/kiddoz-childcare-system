import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { programsData } from '../../data/programsData';

const Navbar = ({ user, handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isProgramActive = location.pathname.startsWith('/programs');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProgramsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProgramsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const NavItem = ({ to, label, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium ${isActive(to) ? 'bg-primary-100 text-primary-800' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
        }`}
    >
      {Icon && <Icon size={18} />}
      {label}
    </Link>
  );

  // Admin View Navbar
  if (location.pathname.startsWith('/admin') && user) return (
    <nav className="glass sticky top-0 z-40 border-b border-primary-100 shadow-sm bg-primary-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">K</div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">Kiddo<span className="text-primary-600">Z</span></span>
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
          <Link to="/" className="flex items-center cursor-pointer gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform rotate-3">K</div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-800">Kiddo<span className="text-primary-600">Z</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <NavItem to="/" label="Home" />

            {/* Programs Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProgramsOpen(!programsOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition font-medium ${isProgramActive
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                Programs
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {programsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* View All */}
                  <Link
                    to="/programs"
                    className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition border-b border-primary-100"
                  >
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center text-xs font-black shadow">✦</span>
                    View All Programs
                  </Link>

                  {/* Individual Programs */}
                  {programsData.map((program, i) => (
                    <Link
                      key={program.id}
                      to={`/programs/${program.id}`}
                      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition group ${i < programsData.length - 1 ? 'border-b border-slate-50' : ''
                        }`}
                    >
                      <img
                        src={program.img}
                        alt={program.title}
                        className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-primary-700 transition">{program.title}</p>
                        <p className="text-xs text-slate-400">{program.age}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavItem to="/enroll" label="Pricing & Enroll" />
            <NavItem to="/admin-features" label="Admin Solutions" />
          </div>

          {/* Right Side CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {['admin', 'teacher', 'nurse', 'nanny'].includes(user.role) ? (
                  <Link to="/admin" className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-900 transition shadow-lg font-semibold"><User size={18} /> Staff Portal</Link>
                ) : user.role === 'superadmin' ? (
                  <Link to="/superadmin" className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition shadow-lg font-semibold"><User size={18} /> Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 transition shadow-lg font-semibold"><User size={18} /> Parent Portal</Link>
                )}
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition bg-slate-50 p-2 rounded-full hover:bg-red-50"><LogOut size={20} /></button>
              </>
            ) : (
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-800 px-6 py-2">Log In</Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 bg-slate-100 p-2 rounded-lg">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <NavItem to="/" label="Home" />

          {/* Mobile Programs Section */}
          <div className="space-y-1">
            <Link
              to="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-xl transition font-medium ${isProgramActive ? 'bg-primary-100 text-primary-800' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
            >
              Programs
            </Link>
            <div className="pl-4 space-y-1">
              {programsData.map((program) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${location.pathname === `/programs/${program.id}`
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                >
                  <img src={program.img} alt={program.title} className="w-8 h-8 rounded-lg object-cover" />
                  {program.title}
                </Link>
              ))}
            </div>
          </div>

          <NavItem to="/enroll" label="Enroll" />
          {user ? (
            <Link
              to={['admin', 'teacher', 'nurse', 'nanny'].includes(user.role) ? '/admin' : user.role === 'superadmin' ? '/superadmin' : '/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <User size={18} />
              {['admin', 'teacher', 'nurse', 'nanny'].includes(user.role) ? 'Staff Portal' : user.role === 'superadmin' ? 'Admin Panel' : 'Parent Portal'}
            </Link>
          ) : (<NavItem to="/login" label="Login" />)}
        </div>
      )}
    </nav>
  );
};
export default Navbar;