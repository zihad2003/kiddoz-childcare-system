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
        className={`hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 group border-none shadow-xl overflow-hidden relative cursor-pointer
        ${onClick ? 'active:scale-95' : ''} bg-white group hover:-translate-y-2`}
    >
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-1000 ${color}`}></div>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${color} shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] text-white flex items-center justify-center group-hover:rotate-6 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100/50 shadow-sm">
                    <TrendingUp size={12} className="group-hover:translate-y-[-2px] transition-transform" />
                    <span>+{trend}%</span>
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
            {subtitle && (
                <div className="flex items-center gap-2 mt-3">
                    <div className="w-1 h-3 rounded-full bg-slate-200"></div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{subtitle}</p>
                </div>
            )}
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
        <div className="flex flex-col items-center justify-center py-40 bg-white/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-200 animate-pulse">
            <div className="relative">
                <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                    <Shield className="w-10 h-10 text-primary-600" />
                </div>
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Syncing Command Hub...</p>
        </div>
    );

    const renderDeepDiveContent = () => {
        switch (activeDeepDive) {
            case 'users':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px] italic">Verified Network Identities</h4>
                            <button onClick={() => { setActiveDeepDive(null); setActiveTab('users'); }} className="group/link text-primary-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline">
                                Full Registry <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid gap-3">
                            {[
                                { name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'Parent', time: '2 mins ago' },
                                { name: 'Michael Chen', email: 'm.chen@outlook.com', role: 'Staff', time: '15 mins ago' },
                                { name: 'Emma Wilson', email: 'emma@wilson.net', role: 'Parent', time: '1 hour ago' },
                                { name: 'Sophia Grace', email: 's.grace@edu.com', role: 'Parent', time: '5 hours ago' }
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:border-primary-100 transition-all duration-300 group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-md opacity-0 group-hover/item:opacity-20 transition-opacity"></div>
                                            <div className="relative w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&bold=true`} alt={user.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-base italic leading-tight">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase mt-1">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge color={user.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} className="font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-1">
                                            {user.role}
                                        </Badge>
                                        <p className="text-[9px] font-black text-slate-300 italic uppercase tracking-tighter">{user.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'centers':
                return (
                    <div className="space-y-6">
                        <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px] italic mb-6">Physical Infrastructure Nodes</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'KiddoZ Gulshan Branch', capacity: 120, current: 104, health: 'Peak', color: 'from-emerald-400 to-emerald-600' },
                                { name: 'KiddoZ Uttara Node', capacity: 80, current: 72, health: 'Optimal', color: 'from-blue-400 to-blue-600' },
                                { name: 'KiddoZ Dhanmondi Hub', capacity: 100, current: 85, health: 'Optimal', color: 'from-indigo-400 to-indigo-600' }
                            ].map((center, i) => (
                                <div key={i} className="p-7 bg-white border border-slate-100 rounded-[2.5rem] relative overflow-hidden group/center hover:shadow-2xl transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h5 className="font-black text-slate-900 italic tracking-tighter text-lg">{center.name}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-[10px] font-black text-slate-400 tracking-[0.1em] uppercase">Status: <span className="text-emerald-500">{center.health}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{Math.round((center.current / center.capacity) * 100)}%</span>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Usage</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                        <div
                                            className={`h-full bg-gradient-to-r ${center.color} transition-all duration-1000 rounded-full`}
                                            style={{ width: `${(center.current / center.capacity) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{center.current} Students Live</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Node Capacity: {center.capacity}</span>
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
                            <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px] italic mb-6">Market Segmentation Distribution</h4>
                            <div className="grid grid-cols-2 gap-5">
                                {[
                                    { label: 'Growth Scholars', count: 18, color: 'from-primary-500 to-primary-700', note: 'Essential' },
                                    { label: 'Little Explorers', count: 14, color: 'from-blue-500 to-blue-700', note: 'Standard' },
                                    { label: 'Tiny Creators', count: 12, color: 'from-emerald-500 to-emerald-700', note: 'Premium' },
                                    { label: 'Future Leaders', count: 6, color: 'from-indigo-500 to-indigo-700', note: 'Elite' }
                                ].map((plan, i) => (
                                    <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex items-center gap-5">
                                        <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${plan.color}`}></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 italic leading-none mb-1">{plan.label}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{plan.note} Segment</p>
                                            <p className="text-2xl font-black text-slate-900 mt-2">{plan.count} <span className="text-xs text-slate-300 lowercase font-bold tracking-normal italic">Active</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-[#0f172a] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity size={80} />
                            </div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-6 italic">Live Engagement Pulse (24h)</h5>
                            <div className="flex items-end gap-3.5 h-32 relative z-10">
                                {[40, 75, 45, 95, 65, 85, 55].map((h, i) => (
                                    <div key={i} className="flex-1 bg-white/5 rounded-2xl relative group/bar overflow-hidden">
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-1000 ease-out" style={{ height: `${h}%` }}>
                                            <div className="absolute top-0 inset-x-0 h-1 bg-white/40"></div>
                                        </div>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[10px] font-black text-primary-300">{h}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'revenue':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-200/50"><PieIcon size={24} /></div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-[10px] italic">Capital Intake Audit</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">YTD Performance Overview</p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Cycle</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue (Gross)</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Delta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {revenueData.slice(-5).reverse().map((data, i) => (
                                        <tr key={i} className="hover:bg-slate-50 group/row transition-all duration-300 border-transparent border-l-4 hover:border-emerald-500">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover/row:bg-emerald-400 transition-colors"></div>
                                                    <span className="font-bold text-slate-600 italic text-sm">{data.name.toUpperCase()} 2026</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-black text-slate-900 text-base italic">৳{data.amount.toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 font-black text-emerald-600 text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50">
                                                    <TrendingUp size={12} /> +{Math.floor(Math.random() * 8) + 4}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-3 italic">Total Network Treasury</p>
                                <h3 className="text-5xl font-black italic tracking-tighter shadow-sm">৳{stats?.revenue?.toLocaleString()}</h3>
                                <div className="mt-8 grid grid-cols-2 gap-6">
                                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/5 hover:bg-white/15 transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic opacity-70 mb-1">Tax Provision</p>
                                        <p className="font-black text-lg italic leading-tight text-emerald-100">৳{(stats?.revenue * 0.15).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/5 hover:bg-white/15 transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic opacity-70 mb-1">CapEx Buffer</p>
                                        <p className="font-black text-lg italic leading-tight text-emerald-100">৳{(stats?.revenue * 0.25).toLocaleString()}</p>
                                    </div>
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
            case 'users': return "Identity Matrix Intelligence";
            case 'centers': return "Infrastructural Grid Oversight";
            case 'students': return "Segmentation Intel Report";
            case 'revenue': return "Liquidity Capital Audit";
            default: return "Command Deep-Dive";
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Main Header / Welcome */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">System Architecture Overview</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Platform Command <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Matrix</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Kernel Status: <span className="text-emerald-500 font-black">STABLE</span> • System Uptime: <span className="text-primary-600 font-black">99.98%</span> • Identity: <span className="text-slate-900 font-black">MASTER ADMIN</span></p>
                </div>
                <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => setActiveTab('analytics')} className="flex-1 xl:flex-none px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:border-primary-300 hover:text-primary-600 hover:shadow-xl transition-all duration-500 active:scale-95 shadow-sm">
                        Data Analytics
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="flex-1 xl:flex-none px-10 py-4 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl">
                        Kernel Config
                    </button>
                </div>
            </div>

            {/* Main KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Platform Identities"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-primary-600"
                    trend={12.4}
                    subtitle="Verified User Network"
                    onClick={() => setActiveDeepDive('users')}
                />
                <StatCard
                    title="active Nodes"
                    value={`${stats?.activeCenters || 0}`}
                    icon={Building}
                    color="bg-blue-600"
                    subtitle="Integrated Facilities"
                    onClick={() => setActiveDeepDive('centers')}
                />
                <StatCard
                    title="Student Corpus"
                    value={stats?.totalStudents || 0}
                    icon={Activity}
                    color="bg-indigo-600"
                    trend={5.4}
                    subtitle="Active Enrollments"
                    onClick={() => setActiveDeepDive('students')}
                />
                <StatCard
                    title="Net Liquidity"
                    value={`৳${(stats?.revenue / 1000000).toFixed(1)}M`}
                    icon={DollarSign}
                    color="bg-emerald-600"
                    trend={8.5}
                    subtitle="Total Treasury intake"
                    onClick={() => setActiveDeepDive('revenue')}
                />
            </div>

            {/* Secondary Intel / Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group/chart rounded-[3.5rem]">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-100/30 rounded-full blur-[100px] pointer-events-none group-hover/chart:scale-150 transition-transform duration-1000"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-6">
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tighter italic">Intelligence Velocity</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.1em] text-[11px] mt-1">Global Revenue Correlation Index</p>
                        </div>
                        <div className="flex items-center gap-8 bg-slate-50/80 backdrop-blur-sm p-4 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-[0_0_12px_rgba(139,92,246,0.6)]"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Capital</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 opacity-40"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Interactions</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-96 w-full relative z-10 scale-[1.02]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenuePremium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6968A6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6968A6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} tickFormatter={(value) => `৳${value / 1000}K`} />
                                <Tooltip
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.15)', padding: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                                    formatter={(value) => [`৳${value.toLocaleString()}`, 'NET VOLUME']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#6968A6" strokeWidth={6} fillOpacity={1} fill="url(#colorRevenuePremium)" animationDuration={2000} />
                                <Area type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} fill="transparent" strokeDasharray="10 5" opacity={0.4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-10">
                    <Card className="p-10 border-none shadow-[0_30px_80px_-20px_rgba(15,23,42,0.2)] bg-[#0f172a] text-white relative overflow-hidden group/strategic rounded-[3.5rem]">
                        <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/strategic:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        <h3 className="font-black text-xl mb-8 relative z-10 text-primary-400 italic">Strategic Commands</h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                { label: 'Identity Grid', icon: Shield, color: 'bg-primary-600', note: 'Access Oversight', tab: 'users' },
                                { label: 'Node Network', icon: Building, color: 'bg-blue-600', note: 'Center Dynamics', tab: 'centers' },
                                { label: 'Resource Feed', icon: BadgeCheck, color: 'bg-emerald-600', note: 'Staff Intelligence', tab: 'staff' }
                            ].map((action, i) => (
                                <button key={i} onClick={() => setActiveTab(action.tab)} className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 flex items-center gap-5 group/cmd active:scale-[0.98]">
                                    <div className={`p-3.5 rounded-2xl ${action.color} text-white shadow-xl shadow-black/20 group-hover/cmd:scale-110 transition-all duration-500`}>
                                        <action.icon size={22} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-black tracking-tight text-base italic leading-tight group-hover/cmd:text-primary-300 transition-colors">{action.label}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{action.note}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/cmd:opacity-100 transition-opacity">
                                        <ArrowUpRight size={18} className="text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-10 border-none shadow-2xl bg-white overflow-hidden text-center justify-center flex flex-col items-center relative rounded-[3.5rem] group/health">
                        <div className="absolute inset-0 opacity-[0.02] group-hover/health:opacity-10 transition-opacity" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/circuit-board.png")' }}></div>
                        <h3 className="font-black text-xl text-slate-900 mb-6 italic group-hover/health:scale-110 transition-transform duration-500">System Vitality</h3>
                        <div className="relative inline-flex items-center justify-center mb-8">
                            <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-10 group-hover/health:opacity-30 transition-opacity"></div>
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={452.3} strokeDashoffset={4.52} strokeLinecap="round" className="text-emerald-500 shadow-xl" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter italic">99.9%</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Uptime</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest leading-none">Status: Operational</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Matrix Detail Modal Overlay */}
            <Modal
                isOpen={!!activeDeepDive}
                onClose={() => setActiveDeepDive(null)}
                title={getDeepDiveTitle()}
                maxWidth="max-w-3xl"
            >
                <div className="p-2 animate-in fade-in zoom-in-95 duration-500">
                    {renderDeepDiveContent()}
                    <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                        <Button variant="secondary" onClick={() => setActiveDeepDive(null)} className="font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-2xl border-2 italic bg-slate-50 hover:bg-slate-100">
                            Dismiss Intel Matrix
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PlatformOverview;

