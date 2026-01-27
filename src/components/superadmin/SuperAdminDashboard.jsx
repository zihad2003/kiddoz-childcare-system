import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Users, Building, PieChart, DollarSign, FileText, BadgeCheck, Shield, Settings, Code, Smartphone, MessageSquare, FileBarChart, Bell, LogOut, ChevronDown, Menu, X } from 'lucide-react';
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

    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'centers', label: 'Centers', icon: Building },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'staff', label: 'Staff Directory', icon: BadgeCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <PlatformOverview setActiveTab={setActiveTab} />;
            case 'users': return <UserManagement />;
            case 'centers': return <CenterManagement />;
            case 'analytics': return <AnalyticsReports />;
            case 'financials': return <FinancialOverview />;
            case 'content': return <ContentManagement />;
            case 'staff': return <StaffDirectory />;
            case 'settings': return <SystemSettings />;
            default: return <PlatformOverview setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-30 w-72 h-screen bg-purple-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center font-bold text-xl shadow-lg">K</div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">KiddoZ Admin</h1>
                            <p className="text-xs text-slate-300">Super Admin Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white"><X /></button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-purple-700">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id ? 'bg-white text-purple-900 font-semibold shadow-lg scale-105' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-purple-600' : 'group-hover:text-white/80'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-purple-600"><Menu /></button>

                    <div className="flex-1 px-6">
                        <h2 className="text-xl font-bold text-slate-800 capitalize">{navItems.find(i => i.id === activeTab)?.label}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-purple-600 transition rounded-full hover:bg-slate-50">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800">{user?.fullName || 'Super Admin'}</p>
                                <p className="text-xs text-slate-500">System Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Super+Admin'}&background=8b5cf6&color=fff`} alt="Profile" />
                            </div>
                            <ChevronDown size={16} className="text-slate-400 cursor-pointer" />
                        </div>
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
