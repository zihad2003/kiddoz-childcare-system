import React, { useEffect, useState } from 'react';
import { Users, Building, DollarSign, Activity, TrendingUp, ArrowUpRight, Shield, Zap, Target, MousePointer2, FileText, BadgeCheck, CheckCircle, PieChart as PieIcon, Calendar, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => (
    <Card
        onClick={onClick}
        className={`hover:shadow-2xl transition-all duration-500 group border-none shadow-xl overflow-hidden relative cursor-pointer ${onClick ? 'active:scale-95' : ''}`}
    >
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${color}`}></div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center shadow-inner`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <TrendingUp size={12} />
                    <span>{trend}%</span>
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
    </Card>
);

const PlatformOverview = ({ setActiveTab }) => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDeepDive, setActiveDeepDive] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overview, revenue] = await Promise.all([
                    api.getSuperAdminOverview(),
                    api.getAnalyticsRevenue()
                ]);

                setStats(overview);

                const formattedRevenue = revenue.labels.map((label, index) => ({
                    name: label,
                    amount: revenue.data[index],
                    users: Math.floor(revenue.data[index] / 150)
                }));
                setRevenueData(formattedRevenue);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border-2 border-dashed border-slate-100 animate-pulse">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary-600 animate-bounce" />
            </div>
            <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Initializing Admin Command Center...</p>
        </div>
    );

    const renderDeepDiveContent = () => {
        switch (activeDeepDive) {
            case 'users':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recently Registered Identities</h4>
                            <button onClick={() => setActiveTab('users')} className="text-primary-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline">
                                Full Directory <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'Parent', time: '2 mins ago' },
                                { name: 'Michael Chen', email: 'm.chen@outlook.com', role: 'Staff', time: '15 mins ago' },
                                { name: 'Emma Wilson', email: 'emma@wilson.net', role: 'Parent', time: '1 hour ago' },
                                { name: 'David Miller', email: 'dmiller@tech.com', role: 'Staff', time: '3 hours ago' },
                                { name: 'Sophia Grace', email: 's.grace@edu.com', role: 'Parent', time: '5 hours ago' }
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-primary-100 transition shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 overflow-hidden border-2 border-white">
                                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm italic">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge color={user.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} className="font-black text-[9px] uppercase tracking-widest px-2 mb-1">
                                            {user.role}
                                        </Badge>
                                        <p className="text-[10px] font-bold text-slate-400 italic lowercase tracking-tight">{user.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'centers':
                return (
                    <div className="space-y-6">
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Active Facility Infrastructure</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'KiddoZ Gulshan Branch', capacity: 120, current: 104, health: 'Peak', color: 'bg-emerald-500' },
                                { name: 'KiddoZ Uttara Node', capacity: 80, current: 72, health: 'Optimal', color: 'bg-blue-500' },
                                { name: 'KiddoZ Dhanmondi Hub', capacity: 100, current: 85, health: 'Optimal', color: 'bg-primary-500' }
                            ].map((center, i) => (
                                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h5 className="font-black text-slate-900 italic tracking-tight">{center.name}</h5>
                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Status: <span className="text-emerald-500 font-black">{center.health}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-slate-900 leading-none">{Math.round((center.current / center.capacity) * 100)}%</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupancy</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full ${center.color} transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                                            style={{ width: `${(center.current / center.capacity) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{center.current} Active Students</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Capacity: {center.capacity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'students':
                return (
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Enrollment Strategy Breakdown</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Growth Scholars', count: 18, color: 'bg-primary-500', note: 'Standard Plan' },
                                    { label: 'Little Explorers', count: 14, color: 'bg-primary-500', note: 'Advanced Hub' },
                                    { label: 'Tiny Creators', count: 12, color: 'bg-emerald-500', note: 'Creative Studio' },
                                    { label: 'Future Leaders', count: 6, color: 'bg-secondary-500', note: 'Premium Track' }
                                ].map((plan, i) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-slate-100 transition shadow-sm flex items-center gap-4">
                                        <div className={`w-3 h-10 rounded-full ${plan.color} shadow-lg shadow-${plan.color.split('-')[1]}-200`}></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 italic leading-none mb-1">{plan.label}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{plan.note}</p>
                                            <p className="text-xl font-black text-slate-900 mt-2">{plan.count} <span className="text-[10px] text-slate-400 italic">Students</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-900 rounded-3xl text-white">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-300 mb-4">Engagement Pulse</h5>
                            <div className="flex items-end gap-3 h-24">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className="flex-1 bg-white/10 rounded-t-lg relative group">
                                        <div className="absolute inset-x-0 bottom-0 bg-primary-500 rounded-t-lg transition-all duration-700" style={{ height: `${h}%` }}></div>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">{h}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'revenue':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"><PieIcon size={20} /></div>
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Realized Revenue Stream Audit</h4>
                        </div>
                        <div className="overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Period</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Liquidity</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {revenueData.slice(-5).reverse().map((data, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition border-transparent border-l-4 hover:border-emerald-500">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-300" />
                                                    <span className="font-bold text-slate-700 italic text-sm">{data.name} 2026</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900 text-sm italic">৳{data.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 font-black text-emerald-600 text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    <TrendingUp size={10} /> +{Math.floor(Math.random() * 8) + 4}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-100">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Platform Treasury Summary</p>
                            <h3 className="text-3xl font-black italic">৳{stats?.revenue?.toLocaleString()}</h3>
                            <div className="mt-4 flex gap-4">
                                <div className="flex-1 bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                    <p className="text-[9px] font-black uppercase tracking-widest italic opacity-70">Tax Est.</p>
                                    <p className="font-black text-sm leading-tight">৳{(stats?.revenue * 0.15).toLocaleString()}</p>
                                </div>
                                <div className="flex-1 bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                    <p className="text-[9px] font-black uppercase tracking-widest italic opacity-70">Reinvestment</p>
                                    <p className="font-black text-sm leading-tight">৳{(stats?.revenue * 0.25).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getDeepDiveTitle = () => {
        switch (activeDeepDive) {
            case 'users': return "Identity Intel";
            case 'centers': return "Infrastructure Matrix";
            case 'students': return "Enrollment Pulse";
            case 'revenue': return "Liquidity Audit";
            default: return "Intelligence View";
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Administrative Intelligence</h2>
                    <p className="text-slate-500 font-medium mt-3">Platform stability: <span className="text-emerald-600 font-black">OPTIMAL (99.9%)</span> • Welcome back, Command Room</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('analytics')} className="px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 hover:border-primary-200 hover:text-primary-600 transition shadow-sm">
                        View Analytics
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black transition shadow-2xl shadow-slate-200">
                        System Configuration
                    </button>
                </div>
            </div>

            {/* Main KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Platform Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-primary-600 shadow-primary-200"
                    trend={12}
                    subtitle="Registered identities"
                    onClick={() => setActiveDeepDive('users')}
                />
                <StatCard
                    title="Active Nodes"
                    value={`${stats?.activeCenters || 0} Facilities`}
                    icon={Building}
                    color="bg-blue-600 shadow-blue-200"
                    subtitle="Operational childcare centers"
                    onClick={() => setActiveDeepDive('centers')}
                />
                <StatCard
                    title="Student Body"
                    value={stats?.totalStudents || 0}
                    icon={Activity}
                    color="bg-secondary-600 shadow-secondary-200"
                    trend={5.4}
                    subtitle="Total active enrollments"
                    onClick={() => setActiveDeepDive('students')}
                />
                <StatCard
                    title="Net Liquidity"
                    value={`৳${stats?.revenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="bg-emerald-600 shadow-emerald-200"
                    trend={8.5}
                    subtitle="Realized revenue (YTD)"
                    onClick={() => setActiveDeepDive('revenue')}
                />
            </div>

            {/* Middle Section: Performance & Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-10 border-none shadow-2xl bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="text-yellow-400 opacity-20 group-hover:opacity-100 transition-opacity duration-1000" size={60} />
                    </div>
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="font-black text-2xl text-slate-900">Revenue Velocity</h3>
                            <p className="text-slate-400 font-medium">Cross-temporal performance analytics</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary-600 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-400 opacity-30"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Correlation</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenueStats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6968A6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6968A6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `৳${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                                    formatter={(value) => [`৳${value.toLocaleString()}`, 'Metric']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#6968A6" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenueStats)" />
                                <Area type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} fill="transparent" strokeDasharray="8 4" opacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="p-8 border-none shadow-2xl bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <h3 className="font-black text-xl mb-6 relative z-10 text-primary-400">Strategic Commands</h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'Identity Control', icon: Shield, color: 'bg-primary-600', note: 'User & Access Management', tab: 'users' },
                                { label: 'Center Network', icon: Building, color: 'bg-blue-600', note: 'Global Facility Oversight', tab: 'centers' },
                                { label: 'Global Staffing', icon: BadgeCheck, color: 'bg-emerald-600', note: 'Professional Directory', tab: 'staff' }
                            ].map((action, i) => (
                                <button key={i} onClick={() => setActiveTab(action.tab)} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-4 group/btn">
                                    <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg group-hover/btn:scale-110 transition-transform`}>
                                        <action.icon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-black tracking-tight text-sm ${action.color.replace('bg-', 'text-').replace('600', '400')}`}>{action.label}</p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{action.note}</p>
                                    </div>
                                    <ArrowUpRight size={18} className="ml-auto text-slate-500 group-hover/btn:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-2xl bg-white overflow-hidden text-center relative">
                        <div className="pt-2">
                            <h3 className="font-black text-xl text-slate-900 mb-2">Platform Health</h3>
                            <div className="mt-8 relative inline-flex items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={36.4} strokeLinecap="round" className="text-emerald-500" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-900">99.9%</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uptime</span>
                                </div>
                            </div>
                            <p className="mt-6 text-sm font-bold text-slate-500">Service Reliability: <span className="text-emerald-600">Peak</span></p>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={!!activeDeepDive}
                onClose={() => setActiveDeepDive(null)}
                title={getDeepDiveTitle()}
                maxWidth="max-w-2xl"
            >
                {renderDeepDiveContent()}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <Button variant="secondary" onClick={() => setActiveDeepDive(null)} className="font-bold border-2">
                        Dismiss Intelligence
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default PlatformOverview;

