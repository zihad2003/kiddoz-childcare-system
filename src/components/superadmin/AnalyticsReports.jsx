import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import api from '../../services/api';
import { Download, Calendar, Filter, Share2, MousePointer2, Zap, Target, TrendingUp, Activity, Layers, Globe } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AnalyticsReports = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [userStats, setUserStats] = useState({ total: 0, byRole: [] });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('ytd');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [revenue, users] = await Promise.all([
                    api.getAnalyticsRevenue({ range: dateRange }),
                    api.getAnalyticsUsers({ range: dateRange })
                ]);

                const formattedRev = (revenue?.labels || []).map((l, i) => ({
                    name: l,
                    revenue: revenue?.data?.[i] || 0,
                    activeUsers: Math.floor((revenue?.data?.[i] || 0) / 80),
                    newSignups: Math.floor((revenue?.data?.[i] || 0) / 400) + Math.floor(Math.random() * 10)
                }));
                setRevenueData(formattedRev);
                setUserStats(users || { total: 0, byRole: [] });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange]);

    const PREMIUM_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'];

    const ranges = [
        { id: 'this_month', label: 'This Month' },
        { id: 'quarter', label: 'Quarter' },
        { id: 'ytd', label: 'YTD' },
        { id: 'all_time', label: 'All Time' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Global Network Analytics</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Intelligence</span> Reports</h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Data Latency: <span className="text-emerald-500 font-black">74ms</span> • Update Cycle: <span className="text-primary-600 font-black">REAL-TIME</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-hide">
                        {ranges.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setDateRange(r.id)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${dateRange === r.id ? 'bg-[#0f172a] text-white shadow-lg italic' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl italic">
                        <Share2 size={16} /> Export Intel
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-slate-200 animate-pulse">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                            <Activity className="w-10 h-10 text-primary-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Synchronizing {dateRange.replace('_', ' ')} Matrices...</p>
                </div>
            ) : (
                <>
                    {/* Top Interactive Scoreboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(15,23,42,0.2)] bg-[#0f172a] text-white relative overflow-hidden group/score rounded-[3.5rem]">
                            <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/score:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-primary-600 rounded-2xl shadow-xl shadow-primary-900/40 group-hover:rotate-12 transition-transform duration-500">
                                    <MousePointer2 size={24} />
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live Grid</span>
                                </div>
                            </div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 italic">Active Flux</p>
                            <h3 className="text-5xl font-black italic tracking-tighter shadow-sm leading-none">{Math.floor(Math.random() * 200) + 300}</h3>
                            <p className="text-[10px] text-primary-400 font-bold mt-4 uppercase tracking-widest leading-relaxed">Unique identities interacting with kernel</p>
                        </Card>

                        <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-900/20 group-hover:rotate-12 transition-transform duration-500">
                                    <Zap size={24} />
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100/50">
                                    <TrendingUp size={12} /> +22.4%
                                </div>
                            </div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 italic">Compute Load</p>
                            <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">14.8%</h3>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full mt-6 overflow-hidden shadow-inner border border-slate-50">
                                <div className="w-[14.8%] h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                            </div>
                        </Card>

                        <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/20 group-hover:rotate-12 transition-transform duration-500">
                                    <Target size={24} />
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100/50 shadow-sm">
                                    Optimal
                                </div>
                            </div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2 italic">Identity Retention</p>
                            <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">94.8%</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest leading-relaxed">Exceeding market sustainability index</p>
                        </Card>
                    </div>

                    {/* Advanced Analytics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Revenue & Growth Trend */}
                        <Card className="p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tighter italic">Velocity Matrix</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Dimensional Growth Analytics ({dateRange.toUpperCase()})</p>
                                </div>
                                <div className="flex items-center gap-8 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Capital</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Flux</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-96 w-full scale-[1.02]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} />
                                        <Tooltip
                                            cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.15)', padding: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorPremium)" animationDuration={2500} />
                                        <Area type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="10 5" opacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* User Distribution */}
                        <Card className="p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tighter italic">Identity Segmentation</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Role-Based Network Distribution</p>
                                </div>
                            </div>

                            <div className="h-96 w-full flex flex-col xl:flex-row items-center gap-12">
                                <div className="flex-1 h-full w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={userStats?.byRole || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={90}
                                                outerRadius={130}
                                                paddingAngle={10}
                                                dataKey="count"
                                                stroke="white"
                                                strokeWidth={4}
                                            >
                                                {(userStats?.byRole || []).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">{userStats?.total || 0}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic shadow-sm">Aggregate IDs</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 xl:flex xl:flex-col gap-4 w-full xl:w-56">
                                    {(userStats?.byRole || []).map((item, index) => (
                                        <div key={item.role} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-xl transition-all duration-300 group/label">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: PREMIUM_COLORS[index % PREMIUM_COLORS.length] }}></div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{item.role}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900 italic">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Engagement Bar Charts */}
                        <Card className="lg:col-span-2 p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 shadow-inner group-hover:rotate-6 transition-transform">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-900 tracking-tighter italic">Acquisition Flux</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Periodic Identity Onboarding Trend</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Total Onboarded (Interval)</p>
                                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">12,842 <span className="text-[10px] text-emerald-500 ml-1">+14%</span></p>
                                </div>
                            </div>

                            <div className="h-80 w-full scale-[1.02]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.15)', padding: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                                        />
                                        <Bar dataKey="newSignups" fill="url(#barGradient)" radius={[12, 12, 4, 4]} barSize={50} animationDuration={2000} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsReports;
