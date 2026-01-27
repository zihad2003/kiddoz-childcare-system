import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Download, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Activity, Wallet, ShieldAlert, BadgeInfo, Target, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import api from '../../services/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const FinancialOverview = () => {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getFinancialOverview();
                setFinancialData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading financials', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100 animate-pulse">
            <div className="p-4 bg-purple-50 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-purple-600 animate-bounce" />
            </div>
            <p className="text-slate-400 font-medium">Calculating platform treasury...</p>
        </div>
    );

    if (!financialData) return <div>Failed to load financial data.</div>;

    const netProfit = financialData.summary.netProfit || (financialData.summary.totalRevenue - financialData.summary.totalExpenses);
    const profitMargin = Math.round((netProfit / (financialData.summary.totalRevenue || 1)) * 100);

    // Process color and label data for the pie chart
    const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
    const revenueData = financialData.revenueByPlan.map(item => ({
        name: item.plan,
        value: Number(item.total)
    }));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Professional Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-600 text-white p-2 rounded-lg shadow-lg shadow-purple-200">
                            <Target size={20} />
                        </div>
                        <Badge color="bg-purple-100 text-purple-700 font-black tracking-widest text-[9px]">FISCAL YEAR 2026</Badge>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Platform Treasury</h2>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.25em] mt-3">Tactical oversight of global revenue nodes and economic efficiency</p>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <Button variant="secondary" className="flex-1 lg:flex-none h-14 font-black uppercase tracking-widest text-[10px] border-2 shadow-sm rounded-2xl flex items-center gap-3 group">
                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Export Analytics
                    </Button>
                    <Button variant="primary" className="flex-1 lg:flex-none h-14 font-black uppercase tracking-widest text-[10px] bg-slate-900 border-none shadow-2xl shadow-slate-200 rounded-2xl flex items-center gap-3">
                        <FileText size={18} className="text-purple-400" /> Fiscal Audit
                    </Button>
                </div>
            </div>

            {/* Tactical KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Platform Revenue', val: `৳${financialData.summary.totalRevenue.toLocaleString()}`, trend: '+14.2%', up: true, icon: DollarSign, color: 'from-purple-600 to-indigo-700', text: 'text-white' },
                    { label: 'Operating Costs', val: `৳${financialData.summary.totalExpenses.toLocaleString()}`, trend: '-2.1%', up: false, icon: Wallet, color: 'bg-white', text: 'text-slate-900' },
                    { label: 'Outstanding Debt', val: financialData.summary.outstandingInvoices, trend: '9 Expected', up: true, icon: CreditCard, color: 'bg-white', text: 'text-slate-900' },
                    { label: 'Efficiency Index', val: `${profitMargin}%`, trend: 'Healthy', up: true, icon: TrendingUp, color: 'bg-white', text: 'text-emerald-600' }
                ].map((stat, i) => (
                    <Card key={i} className={`p-8 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 ${stat.color === 'bg-white' ? 'bg-white' : `bg-gradient-to-br ${stat.color}`}`}>
                        {i === 0 && <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign size={80} /></div>}
                        <div className="flex justify-between items-start mb-6">
                            <p className={`font-black uppercase tracking-widest text-[9px] ${stat.text === 'text-white' ? 'text-white/60' : 'text-slate-400'}`}>{stat.label}</p>
                            <div className={`p-3 rounded-2xl ${stat.text === 'text-white' ? 'bg-white/10' : 'bg-slate-50'} transition-transform group-hover:scale-110`}>
                                <stat.icon size={18} className={stat.text === 'text-white' ? 'text-white' : 'text-purple-600'} />
                            </div>
                        </div>
                        <h3 className={`text-3xl font-black italic tracking-tight mb-4 ${stat.text}`}>{stat.val}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            {stat.up ? <ArrowUpRight size={14} className={stat.text === 'text-white' ? 'text-emerald-300' : 'text-emerald-500'} /> : <ArrowDownRight size={14} className="text-red-500" />}
                            <span className={stat.up ? (stat.text === 'text-white' ? 'text-emerald-300' : 'text-emerald-500') : 'text-red-500'}>{stat.trend}</span>
                            <span className={stat.text === 'text-white' ? 'text-white/40' : 'text-slate-300'}>vs L-Month</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Immersive Growth Chart */}
                <Card className="lg:col-span-2 p-10 border-none shadow-2xl bg-white rounded-[3rem]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight italic">Revenue Velocity</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Platform-wide income vs operational burn</p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2">
                            <button className="px-5 py-2.5 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-100">Performance</button>
                            <button className="px-5 py-2.5 hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">Forecast</button>
                        </div>
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialData.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} tickFormatter={(val) => `৳${val / 1000}k`} />
                                <Tooltip
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '3 3' }}
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.15)', padding: '20px', fontWeight: '900' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="expenses" stroke="#e2e8f0" strokeWidth={4} fill="transparent" strokeDasharray="6 6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Revenue Breakdown */}
                <div className="space-y-8">
                    <Card className="p-8 border-none shadow-2xl bg-white rounded-[3rem]">
                        <h3 className="font-black text-xl text-slate-900 tracking-tight italic mb-1">Growth Matrix</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Revenue distribution per plan</p>

                        <div className="h-48 w-full relative mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Activity size={24} className="text-purple-100" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {revenueData.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl group hover:bg-purple-50 transition-colors cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-700 transition-colors">{item.name}</span>
                                    </div>
                                    <span className="text-[11px] font-black text-slate-900">৳{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] relative overflow-hidden group/alert">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 opacity-50"></div>
                        <div className="relative z-10">
                            <h4 className="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] text-purple-400 mb-6 italic">
                                <ShieldAlert size={14} /> Tactical Fiscal Alert
                            </h4>
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md mb-6">
                                <p className="text-[11px] font-bold text-white/80 leading-relaxed italic">
                                    "High frequency of pending bills detected in Northern nodes. Deployment of automated collection prompts suggested."
                                </p>
                            </div>
                            <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all shadow-xl shadow-purple-900/50 flex items-center justify-center gap-2 group-hover/alert:translate-y-[-2px]">
                                Execute Recovery Protocol <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;

