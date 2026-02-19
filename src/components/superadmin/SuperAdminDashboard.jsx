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

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const navGroups = [
        {
            label: 'Core',
            items: [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'analytics', label: 'Analytics', icon: PieChart },
                { id: 'reports', label: 'Reports', icon: FileBarChart },
            ]
        },
        {
            label: 'Management',
            items: [
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'centers', label: 'Centers', icon: Building },
                { id: 'staff', label: 'Staff Directory', icon: BadgeCheck },
                { id: 'content', label: 'Content', icon: FileText },
            ]
        },
        {
            label: 'Operations',
            items: [
                { id: 'financials', label: 'Financials', icon: DollarSign },
                { id: 'security', label: 'Security & Logs', icon: Shield },
                { id: 'support', label: 'Support & Feedback', icon: MessageSquare },
            ]
        },
        {
            label: 'System',
            items: [
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'developer', label: 'Developer Tools', icon: Code },
                { id: 'app', label: 'App Management', icon: Smartphone },
            ]
        }
    ];

    const allNavItems = navGroups.flatMap(g => g.items);

    const renderContent = () => {
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
    };

    const currentLabel = allNavItems.find(i => i.id === activeTab)?.label || 'Dashboard';

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-30 w-72 h-screen bg-[#085078] text-white flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Logo */}
                <div className="p-6 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-500 to-secondary-500 flex items-center justify-center font-black text-xl shadow-lg shadow-primary-900/50">
                            K
                        </div>
                        <div>
                            <h1 className="font-black text-base tracking-tight">KiddoZ</h1>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={10} className="text-yellow-400" />
                                <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest">Super Admin</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {navGroups.map(group => (
                        <div key={group.label}>
                            <p className="text-[9px] font-black text-primary-400/60 uppercase tracking-[0.2em] px-3 mb-2">{group.label}</p>
                            <div className="space-y-0.5">
                                {group.items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                                            ${activeTab === item.id
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-600 text-white font-bold shadow-lg shadow-primary-900/50'
                                                : 'text-primary-200/70 hover:bg-white/8 hover:text-white'
                                            }`}
                                    >
                                        {activeTab === item.id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                                        )}
                                        <item.icon
                                            size={18}
                                            className={activeTab === item.id ? 'text-white' : 'text-primary-400 group-hover:text-primary-200 transition-colors'}
                                        />
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Super+Admin'}&background=6968A6&color=fff`}
                            alt="avatar"
                            className="w-9 h-9 rounded-full border-2 border-primary-500 shadow-md"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{user?.fullName || 'Super Admin'}</p>
                            <p className="text-[10px] text-primary-400 font-medium">System Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-300/80 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-slate-500 hover:text-primary-600 p-2 rounded-xl hover:bg-slate-50 transition"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">{currentLabel}</h2>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest hidden md:block">KiddoZ Super Admin Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="relative p-2.5 text-slate-400 hover:text-primary-600 transition rounded-xl hover:bg-slate-50">
                            <Bell size={20} />
                            {notifications > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
