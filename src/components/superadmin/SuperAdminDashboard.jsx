import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building, PieChart, DollarSign, FileText,
    BadgeCheck, Shield, Settings, Code, Smartphone, MessageSquare,
    FileBarChart, Bell, LogOut, Menu, X, Sparkles
} from 'lucide-react';
import PlatformOverview from './PlatformOverview';
import UserManagement from './UserManagement';
import CenterManagement from './CenterManagement';
import AnalyticsReports from './AnalyticsReports';
import FinancialOverview from './FinancialOverview';
import ContentManagement from './ContentManagement';
import StaffDirectory from './StaffDirectory';
import SecurityCompliance from './SecurityCompliance';
import SystemSettings from './SystemSettings';
import DeveloperTools from './DeveloperTools';
import AppManagement from './AppManagement';
import SupportFeedback from './SupportFeedback';
import ReportsGenerator from './ReportsGenerator';

const SuperAdminDashboard = ({ user, handleLogout }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const navGroups = [
        {
            label: 'Intelligence',
            items: [
                { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
                { id: 'analytics', label: 'Market Intel', icon: PieChart },
                { id: 'reports', label: 'Data Reports', icon: FileBarChart },
            ]
        },
        {
            label: 'Entity Control',
            items: [
                { id: 'users', label: 'User Directory', icon: Users },
                { id: 'centers', label: 'Facility Grid', icon: Building },
                { id: 'staff', label: 'Staff Corps', icon: BadgeCheck },
                { id: 'content', label: 'Global Feed', icon: FileText },
            ]
        },
        {
            label: 'Engine',
            items: [
                { id: 'financials', label: 'Treasury', icon: DollarSign },
                { id: 'security', label: 'Firewall & Logs', icon: Shield },
                { id: 'support', label: 'Comms Support', icon: MessageSquare },
            ]
        },
        {
            label: 'Infrastructure',
            items: [
                { id: 'settings', label: 'System Kernel', icon: Settings },
                { id: 'developer', label: 'Matrix Tools', icon: Code },
                { id: 'app', label: 'Mobile Ops', icon: Smartphone },
            ]
        }
    ];

    const allNavItems = navGroups.flatMap(g => g.items);

    const renderContent = () => {
        const content = (() => {
            switch (activeTab) {
                case 'overview': return <PlatformOverview setActiveTab={setActiveTab} />;
                case 'users': return <UserManagement />;
                case 'centers': return <CenterManagement />;
                case 'analytics': return <AnalyticsReports />;
                case 'financials': return <FinancialOverview />;
                case 'content': return <ContentManagement />;
                case 'staff': return <StaffDirectory />;
                case 'security': return <SecurityCompliance />;
                case 'settings': return <SystemSettings />;
                case 'developer': return <DeveloperTools />;
                case 'app': return <AppManagement />;
                case 'support': return <SupportFeedback />;
                case 'reports': return <ReportsGenerator />;
                default: return <PlatformOverview setActiveTab={setActiveTab} />;
            }
        })();

        return (
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
                {content}
            </div>
        );
    };

    const currentLabel = allNavItems.find(i => i.id === activeTab)?.label || 'Dashboard';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-50 w-72 h-screen bg-[#0f172a] text-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* mesh gradient background subtle */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, #6366f1 0%, transparent 50%), radial-gradient(circle at 100% 100%, #8b5cf6 0%, transparent 50%)' }}></div>

                {/* Logo Section */}
                <div className="p-8 relative">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-2xl text-white shadow-2xl">
                                K
                            </div>
                        </div>
                        <div>
                            <h1 className="font-black text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">KiddoZ</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em]">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-8 scrollbar-hide relative z-10">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] px-4 mb-3 italic">{group.label}</p>
                            <div className="space-y-1">
                                {group.items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                            ${activeTab === item.id
                                                ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40 scale-110' : 'bg-slate-800/50 group-hover:bg-slate-800 group-hover:scale-110'}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                        {activeTab === item.id && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_white]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-6 mt-auto relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Super+Admin'}&background=6366f1&color=fff&bold=true`}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-2xl border-2 border-white/10 shadow-xl"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-white truncate italic">{user?.fullName || 'Super Admin'}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Master Control</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest border border-red-500/20"
                        >
                            <LogOut size={14} /> Close Session
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 z-40 transition-all duration-500 shadow-[0_1px_24px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-3 text-slate-500 hover:text-primary-600 rounded-2xl hover:bg-primary-50 transition-all"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Global Search Bar */}
                        <div className="hidden md:flex items-center relative max-w-md w-full group">
                            <Code size={18} className="absolute left-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system resources (e.g. #staff-id)..."
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-4 p-1 px-1.5 bg-slate-200 rounded-md text-[9px] font-black text-slate-500 tracking-tighter shadow-sm border border-slate-300">
                                CTR K
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Server Status */}
                        <div className="hidden lg:flex items-center gap-4 border-r border-slate-200 pr-6 mr- 2">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Server Core</p>
                                <p className="text-xs font-black text-emerald-600 italic">Connected</p>
                            </div>
                            <div className="flex -space-x-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </div>
                        </div>

                        {/* Notifications & Actions */}
                        <div className="flex items-center gap-3">
                            <button className="p-3 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 transition-all rounded-2xl relative">
                                <Bell size={20} />
                                {notifications > 0 && (
                                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-lg shadow-red-200 animate-bounce">
                                        {notifications}
                                    </span>
                                )}
                            </button>
                            <button className="p-3 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 transition-all rounded-2xl">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Hero Bar (Internal) */}
                <div className="px-8 py-6 bg-white/40 border-b border-slate-200/40 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Matrix Mode</p>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{currentLabel}</h2>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Timestamp</p>
                        <p className="text-sm font-black text-slate-700 italic mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Main Scrolling Content Area */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] relative">
                    {/* mesh background deco */}
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
