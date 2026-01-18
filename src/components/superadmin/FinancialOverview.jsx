import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Download, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import api from '../../services/api';
import Card from '../ui/Card';

const FinancialOverview = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const revenue = await api.getAnalyticsRevenue();
                const formatted = revenue.labels.map((label, index) => ({
                    month: label,
                    income: revenue.data[index],
                    expenses: revenue.data[index] * 0.4 // Mock expenses as 40% of income
                }));
                setRevenueData(formatted);
                setLoading(false);
            } catch (error) {
                console.error('Error loading financials', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading financials...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-purple-600 hover:border-purple-200 transition">
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-purple-100 font-medium mb-1">Total Revenue (YTD)</p>
                    <h3 className="text-3xl font-bold">$142,500.00</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-200 bg-white/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp size={16} /> +15.3% vs last year
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Outstanding Invoices</p>
                            <h3 className="text-3xl font-bold text-slate-800">$12,450</h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-500">
                        18 invoices pending payment
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">Monthly Recurring</p>
                            <h3 className="text-3xl font-bold text-slate-800">$28,900</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-500">
                        Based on active subscriptions
                    </div>
                </div>
            </div>

            {/* Income vs Expenses Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Income vs Expenses</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar name="Income" dataKey="income" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar name="Expenses" dataKey="expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;
