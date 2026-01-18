import React, { useEffect, useState } from 'react';
import { Users, Building, DollarSign, Activity, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import api from '../../services/api';
import Card from '../ui/Card';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            {trend && (
                <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-semibold">
                    <TrendingUp size={14} />
                    <span>+{trend}% this month</span>
                </div>
            )}
        </div>
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={24} />
        </div>
    </div>
);

const PlatformOverview = () => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overview, revenue] = await Promise.all([
                    api.getSuperAdminOverview(),
                    api.getAnalyticsRevenue()
                ]);

                setStats(overview);

                // Format revenue data for Recharts
                const formattedRevenue = revenue.labels.map((label, index) => ({
                    name: label,
                    amount: revenue.data[index]
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

    if (loading) return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                    <p className="text-slate-500">Welcome back, Super Admin</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
                        Download Report
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-purple-500"
                    trend={12}
                />
                <StatCard
                    title="Active Centers"
                    value={stats?.activeCenters || 0}
                    icon={Building}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Students"
                    value={stats?.totalStudents || 0}
                    icon={Activity}
                    color="bg-orange-500"
                    trend={5}
                />
                <StatCard
                    title="Revenue"
                    value={`$${stats?.revenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    trend={8.5}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Revenue Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <button className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-purple-50 hover:border-purple-100 transition flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                                    <Users size={20} />
                                </div>
                                <span className="font-medium text-slate-700">Add New User</span>
                            </div>
                            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-purple-600" />
                        </button>

                        <button className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                    <Building size={20} />
                                </div>
                                <span className="font-medium text-slate-700">Add Center</span>
                            </div>
                            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-600" />
                        </button>

                        <button className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-100 transition flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                                    <Activity size={20} />
                                </div>
                                <span className="font-medium text-slate-700">System Health</span>
                            </div>
                            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-orange-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformOverview;
