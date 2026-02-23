import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Download, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Activity, Wallet, ShieldAlert, BadgeInfo, Target, FileText, Zap, Globe, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import api from '../../services/api';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const FinancialOverview = () => {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('ytd');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.getFinancialOverview({ range: dateRange });
                setFinancialData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading financials', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange]);

    const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    const ranges = [
        { id: 'this_month', label: 'This Month' },
        { id: 'quarter', label: 'Quarter' },
        { id: 'ytd', label: 'YTD' },
        { id: 'all_time', label: 'All Time' },
    ];

    if (loading && !financialData) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-emerald-200">
                <DollarSign className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Compiling Capital Flux...</p>
        </div>
    );

    if (!financialData && !loading) return (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <ShieldAlert size={48} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] italic">Failed to reconcile platform treasury nodes.</p>
        </div>
    );

    const netProfit = financialData?.summary?.netProfit || (financialData?.summary?.totalRevenue - financialData?.summary?.totalExpenses);
    const profitMargin = Math.round((netProfit / (financialData?.summary?.totalRevenue || 1)) * 100);

    const revenueByPlanTransformed = financialData?.revenueByPlan?.map(item => ({
        name: item.plan,
        value: Number(item.total)
    })) || [];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-emerald-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] italic leading-none">Fiscal Intelligence & Treasury</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Capital <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Flux</span> Matrix</h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Treasury Status: <span className="text-emerald-500 font-black">SOLVENT</span> • Efficiency: <span className="text-primary-600 font-black">{profitMargin}% MARGIN</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-hide">
                        {ranges.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setDateRange(r.id)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${dateRange === r.id ? 'bg-emerald-600 text-white shadow-lg italic' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl italic">
                        <Download size={18} /> Export Analytics
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-emerald-200">
                        <DollarSign className="w-10 h-10 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Refetching {dateRange.toUpperCase()} Matrix...</p>
                </div>
            ) : (
                <>
                    {/* Tactical KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Platform Revenue', val: `৳${financialData.summary.totalRevenue.toLocaleString()}`, trend: '+14.2%', up: true, icon: DollarSign, color: 'bg-[#0f172a] text-white icon:bg-emerald-500 shadow-emerald-900/40' },
                            { label: 'Operating Burn', val: `৳${financialData.summary.totalExpenses.toLocaleString()}`, trend: '-2.1%', up: false, icon: Wallet, color: 'bg-white text-slate-900 icon:bg-slate-900 shadow-slate-200' },
                            { label: 'Pending Credits', val: financialData.summary.outstandingInvoices, trend: '9 Signals', up: true, icon: CreditCard, color: 'bg-white text-slate-900 icon:bg-indigo-600 shadow-indigo-100' },
                            { label: 'Economic Index', val: `${profitMargin}%`, trend: 'Healthy', up: true, icon: TrendingUp, color: 'bg-white text-emerald-600 icon:bg-emerald-100 shadow-emerald-50' }
                        ].map((stat, i) => (
                            <Card key={i} className={`p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] rounded-[3.5rem] relative overflow-hidden group/kpi hover:-translate-y-2 transition-all duration-700 ${stat.color.split(' ')[0] === 'bg-[#0f172a]' ? 'bg-[#0f172a]' : 'bg-white'}`}>
                                {i === 0 && <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/kpi:opacity-10 transition-opacity"><DollarSign size={120} /></div>}
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <p className={`font-black uppercase tracking-[0.25em] text-[10px] italic ${stat.color.includes('text-white') ? 'text-slate-400' : 'text-slate-400'}`}>{stat.label}</p>
                                    <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover/kpi:rotate-12 ${stat.color.includes('icon:bg-emerald-500') ? 'bg-emerald-500 text-white shadow-emerald-900/40' : (stat.color.includes('icon:bg-slate-900') ? 'bg-slate-900 text-white' : (stat.color.includes('icon:bg-indigo-600') ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-emerald-50 text-emerald-600'))}`}>
                                        <stat.icon size={22} />
                                    </div>
                                </div>
                                <h3 className={`text-4xl font-black italic tracking-tighter mb-5 leading-none ${stat.color.includes('text-white') ? 'text-white' : (stat.color.includes('text-emerald-600') ? 'text-emerald-600' : 'text-slate-900')}`}>{stat.val}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic relative z-10">
                                    {stat.up ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                                    <span className={stat.up ? 'text-emerald-500' : 'text-rose-500'}>{stat.trend}</span>
                                    <span className="text-slate-300 ml-1">Rel Periodic</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Immersive Growth Chart */}
                        <Card className="lg:col-span-2 p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tighter italic">Capital Velocity Matrix</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Node Revenue vs Burn Dynamics ({dateRange.toUpperCase()})</p>
                                </div>
                                <div className="flex bg-slate-50 p-2 rounded-2xl gap-2 border border-slate-100">
                                    {['Active Matrix', 'Forecast Mode'].map((mode, i) => (
                                        <button key={mode} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white shadow-lg text-slate-900 italic' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[450px] w-full scale-[1.02]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={financialData.monthlyRevenue}>
                                        <defs>
                                            <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} tickFormatter={(val) => `৳${val / 1000}k`} />
                                        <Tooltip
                                            cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.15)', padding: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorEmerald)" animationDuration={2500} />
                                        <Area type="monotone" dataKey="expenses" stroke="#cbd5e1" strokeWidth={3} fill="transparent" strokeDasharray="10 5" opacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Economic Segmentation */}
                        <div className="space-y-10">
                            <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tighter italic mb-1 relative z-10">Flux Core</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 relative z-10">Revenue Yield Segmentation</p>

                                <div className="h-60 w-full relative mb-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revenueByPlanTransformed}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={10}
                                                dataKey="value"
                                                stroke="white"
                                                strokeWidth={4}
                                            >
                                                {revenueByPlanTransformed.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
                                        <Activity size={24} className="text-slate-100 mb-2" />
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    {revenueByPlanTransformed.map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100/50 rounded-[1.5rem] group/seg hover:bg-white hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full group-hover/seg:scale-125 transition-transform" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900 italic tracking-tighter">৳{item.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(15,23,42,0.1)] bg-[#0f172a] text-white rounded-[3.5rem] relative overflow-hidden group/fiscal-push">
                                <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/fiscal-push:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                                <div className="relative z-10">
                                    <h4 className="flex items-center gap-3 font-black uppercase tracking-[0.25em] text-[10px] text-emerald-400 mb-8 italic">
                                        <ShieldAlert size={14} className="animate-pulse" /> Fiscal Anomaly Detected
                                    </h4>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md mb-8">
                                        <p className="text-xs font-bold text-white/80 leading-relaxed italic">
                                            "Pending liabilities in Northern Territory nodes exceed standard thresholds. Immediate collection protocol suggested."
                                        </p>
                                    </div>
                                    <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl shadow-emerald-900/50 flex items-center justify-center gap-3 group-hover/fiscal-push:-translate-y-1 italic active:scale-95">
                                        Execute Recovery <Zap size={14} />
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FinancialOverview;
