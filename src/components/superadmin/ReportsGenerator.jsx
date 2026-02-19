import React, { useState } from 'react';
import {
    FileBarChart, Download, Calendar, FileText, Users, Shield,
    Building, TrendingUp, Clock, CheckCircle, ChevronRight, Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ReportsGenerator = () => {
    const { addToast } = useToast();
    const [generating, setGenerating] = useState(null);
    const [dateRange, setDateRange] = useState('this_month');

    const handleDownload = (report) => {
        setGenerating(report.id);
        addToast(`Generating "${report.title}"...`, 'info');
        setTimeout(() => {
            setGenerating(null);
            addToast(`"${report.title}" is ready`, 'success');
        }, 2000);
    };

    const reports = [
        {
            id: 'financial_ytd',
            title: 'Financial Statement (YTD)',
            description: 'Year-to-date revenue, expenses, and net profit breakdown across all centers.',
            type: 'PDF',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            accent: 'border-l-emerald-500',
            size: '~2.4 MB',
        },
        {
            id: 'user_activity',
            title: 'User Activity Log',
            description: 'Comprehensive log of all user logins, actions, and engagement patterns.',
            type: 'CSV',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            accent: 'border-l-blue-500',
            size: '~1.1 MB',
        },
        {
            id: 'audit_log',
            title: 'Security Audit Report',
            description: 'Full system audit trail including security events, failed logins, and policy changes.',
            type: 'Excel',
            icon: Shield,
            color: 'text-red-600',
            bg: 'bg-red-50',
            accent: 'border-l-red-500',
            size: '~3.2 MB',
        },
        {
            id: 'center_perf',
            title: 'Center Performance Review',
            description: 'Occupancy rates, revenue contribution, and staff efficiency metrics per center.',
            type: 'PDF',
            icon: Building,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            accent: 'border-l-primary-500',
            size: '~1.8 MB',
        },
        {
            id: 'enrollment',
            title: 'Enrollment & Retention',
            description: 'Student enrollment trends, churn rates, and plan distribution analytics.',
            type: 'PDF',
            icon: FileText,
            color: 'text-secondary-600',
            bg: 'bg-orange-50',
            accent: 'border-l-secondary-500',
            size: '~900 KB',
        },
        {
            id: 'staff_payroll',
            title: 'Staff Payroll Summary',
            description: 'Payroll disbursements, staff costs by role, and month-over-month comparison.',
            type: 'Excel',
            icon: FileBarChart,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            accent: 'border-l-primary-500',
            size: '~1.5 MB',
        },
    ];

    const recentReports = [
        { title: 'Financial Statement (YTD)', date: '2026-02-01', type: 'PDF', status: 'Delivered' },
        { title: 'User Activity Log', date: '2026-01-28', type: 'CSV', status: 'Delivered' },
        { title: 'Security Audit Report', date: '2026-01-15', type: 'Excel', status: 'Delivered' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports Generator</h2>
                    <p className="text-slate-500 mt-1">Generate and export platform intelligence reports</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'this_month', label: 'This Month' },
                        { id: 'last_quarter', label: 'Quarter' },
                        { id: 'ytd', label: 'YTD' },
                        { id: 'all_time', label: 'All Time' },
                    ].map(r => (
                        <button
                            key={r.id}
                            onClick={() => setDateRange(r.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${dateRange === r.id ? 'bg-primary-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                    <Card
                        key={report.id}
                        className={`p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border-l-4 ${report.accent} bg-white`}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 ${report.bg} ${report.color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <report.icon size={22} />
                                </div>
                                <Badge color="bg-slate-100 text-slate-600" className="text-[9px] font-black uppercase tracking-widest px-2 py-1">
                                    {report.type}
                                </Badge>
                            </div>
                            <h3 className="font-black text-slate-900 mb-2 text-sm leading-tight">{report.title}</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-5">{report.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{report.size}</span>
                                <button
                                    onClick={() => handleDownload(report)}
                                    disabled={generating === report.id}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-primary-600 transition-all uppercase tracking-widest disabled:opacity-50 shadow-sm"
                                >
                                    {generating === report.id ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Download size={13} />
                                    )}
                                    {generating === report.id ? 'Generating...' : 'Export'}
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Scheduled Reports */}
                <Card className="lg:col-span-3 border-none shadow-xl bg-gradient-to-br from-[#085078] to-primary-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </div>
                    <div className="relative z-10 p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={16} className="text-yellow-400" />
                            <h3 className="text-xl font-black">Automated Monthly Reports</h3>
                        </div>
                        <p className="text-primary-200 text-sm font-medium leading-relaxed mb-8 max-w-md">
                            Schedule comprehensive platform insights to be auto-generated and emailed to stakeholders on the 1st of every month.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-primary-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                <Calendar size={14} /> Configure Schedule
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10">
                                View Past Reports <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Recent Reports */}
                <Card className="lg:col-span-2 border-none shadow-xl bg-white p-6">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-5">Recent Reports</h4>
                    <div className="space-y-4">
                        {recentReports.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors group">
                                <div>
                                    <p className="text-xs font-black text-slate-700 group-hover:text-primary-700 transition-colors">{r.title}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{r.date} · {r.type}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    <button className="text-slate-300 hover:text-primary-600 transition">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ReportsGenerator;
