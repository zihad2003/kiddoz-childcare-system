import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ScanFace,
    Activity,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, collapsed, onClick }) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                    isActive
                        ? "bg-primary-purple/20 text-white shadow-[0_0_20px_rgba(123,104,238,0.15)] ring-1 ring-white/10"
                        : "text-slate-500 hover:bg-white/5 hover:text-white",
                    collapsed && "justify-center px-0"
                )
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.div
                            layoutId="activeGlow"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-purple rounded-r-full shadow-[0_0_15px_rgba(123,104,238,0.8)]"
                        />
                    )}
                    <Icon size={20} className={cn("flex-shrink-0 transition-all duration-500", isActive ? "text-primary-purple scale-110" : "group-hover:text-white")} />
                    {!collapsed && (
                        <span className={cn("whitespace-nowrap overflow-hidden text-[11px] font-black uppercase tracking-[0.2em] transition-all", isActive ? "opacity-100 translate-x-0" : "opacity-60 group-hover:opacity-100 group-hover:translate-x-1")}>
                            {label}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = ({ user, handleLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = () => setCollapsed(!collapsed);
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const navItems = [
        { icon: LayoutDashboard, label: 'Ecosystem', to: '/dashboard' },
        { icon: ScanFace, label: 'Live Trace', to: '/dashboard/live-view' },
        { icon: Activity, label: 'Cognitive', to: '/dashboard/health-data' },
        { icon: Users, label: 'Home Experts', to: '/dashboard/nanny-service' },
        { icon: FileText, label: 'Gateways', to: '/dashboard/billing' },
        { icon: BookOpen, label: 'Archives', to: '/dashboard/resources' },
    ];

    const filteredNavItems = navItems.filter(item => !item.role || item.role === user?.role || (user?.role === 'admin'));

    return (
        <>
            {/* Mobile Menu Button - Styled for visibility on light/dark backgrounds */}
            <button
                onClick={toggleMobile}
                className="md:hidden fixed top-4 left-4 z-[100] p-3 bg-bg-dark text-white rounded-2xl shadow-2xl border border-white/10"
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden fixed inset-0 bg-bg-dark/80 z-[80] backdrop-blur-md"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed md:relative z-[90] h-screen flex flex-col transition-all duration-500 overflow-hidden",
                    "bg-bg-dark border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.5)]",
                    collapsed ? "w-24" : "w-[280px]",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Visual Background Accent */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary-purple/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="h-24 flex items-center justify-between px-8 mb-4 relative z-10">
                    {!collapsed && (
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-2xl">
                                <span className="text-2xl font-black text-bg-dark">K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-white tracking-tighter leading-none">KiddoZ</span>
                                <span className="text-[9px] font-black text-primary-purple uppercase tracking-[0.3em] mt-1">Ecosystem</span>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="w-full flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-bg-dark shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                                <span className="text-2xl font-black">K</span>
                            </div>
                        </div>
                    )}

                    {!collapsed && (
                        <button
                            onClick={toggleCollapsed}
                            className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}
                </div>

                {/* User Status Interface */}
                {!collapsed && user && (
                    <div className="mx-6 mb-10 p-5 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/5 to-primary-magenta/5" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-purple to-primary-magenta flex items-center justify-center text-white font-black shadow-lg shadow-primary-900/40 relative">
                                {user.name ? user.name[0] : 'U'}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent-mint border-4 border-bg-dark shadow-glow" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-black text-white tracking-tight">{user.name || 'Guardian'}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{user.role || 'Active Sync'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Interaction Flow */}
                <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar relative z-10">
                    {filteredNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            collapsed={collapsed}
                            onClick={() => setMobileOpen(false)}
                        />
                    ))}
                </div>

                {/* System Interaction Footer */}
                <div className="p-8 relative z-10 mt-auto border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all group",
                            collapsed && "justify-center px-0 bg-transparent shadow-none"
                        )}
                    >
                        <LogOut size={20} className="group-hover:text-primary-magenta transition-colors" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">End Session</span>}
                    </button>
                    {collapsed && (
                        <button onClick={toggleCollapsed} className="w-full flex justify-center mt-6 text-white/20 hover:text-white transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>

            </motion.aside>
        </>
    );
};

export default Sidebar;
