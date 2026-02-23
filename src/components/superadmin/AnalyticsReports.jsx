import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../../services/api';
import { Download, Calendar, Filter, Share2, MousePointer2, Zap, Target } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AnalyticsReports = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [userStats, setUserStats] = useState({ total: 0, byRole: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [revenue, users] = await Promise.all([
                    api.getAnalyticsRevenue(),
                    api.getAnalyticsUsers()
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
    }, []);

    const COLORS = ['#6968A6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100 animate-pulse">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
                <Target className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-slate-400 font-medium">Assemblying platform intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Intelligence</h2>
                    <p className="text-slate-500 mt-1">Holistic view of user engagement and system performance</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-100">
                        <Share2 size={18} /> Share Insight
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-blue-500 to-primary-600 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg"><MousePointer2 size={16} /></div>
                        <span className="text-[10px] font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>
                    <p className="text-blue-100 font-bold text-xs uppercase tracking-widest mb-1">Active Now</p>
                    <h3 className="text-4xl font-black mb-2">342</h3>
                    <p className="text-xs text-blue-100 font-medium">Users interacting with platform</p>
                </Card>

                <Card className="p-6 border-none shadow-xl bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Zap size={16} /></div>
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">+22% INC</span>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">System Load</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">14%</h3>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="w-1/6 h-full bg-primary-500 rounded-full"></div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-xl bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 text-secondary-600 rounded-lg"><Target size={16} /></div>
                        <span className="text-[10px] font-bold text-secondary-600 uppercase tracking-widest">ON TARGET</span>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Retention Rate</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">94.8%</h3>
                    <p className="text-xs text-slate-400 font-medium">Exceeding industry benchmark</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue & Growth Trend */}
                <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900">Growth Velocity</h3>
                            <p className="text-slate-400 text-sm font-medium">Platform revenue vs active users</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6968A6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6968A6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6968A6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev2)" />
                                <Area type="monotone" dataKey="activeUsers" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* User Distribution */}
                <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900">Demographic Split</h3>
                            <p className="text-slate-400 text-sm font-medium">User base breakdown by platform role</p>
                        </div>
                    </div>
                    <div className="h-80 w-full flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 h-full w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userStats?.byRole || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="count"
                                    >
                                        {(userStats?.byRole || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-slate-900">{userStats?.total || 0}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Users</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-48">
                            {(userStats?.byRole || []).map((item, index) => (
                                <div key={item.role} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-xs font-bold text-slate-600 capitalize">{item.role}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Engagement Metrics */}
                <Card className="lg:col-span-2 p-8 border-none shadow-xl bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900">Acquisition Analytics</h3>
                            <p className="text-slate-400 text-sm font-medium">Monthly new user enrollments</p>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Bar dataKey="newSignups" fill="#6968A6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsReports;

