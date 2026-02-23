import React, { useState } from 'react';
import {
    FileBarChart, Download, Calendar, FileText, Users, Shield,
    Building, TrendingUp, Clock, CheckCircle, ChevronRight, Sparkles, Activity, FileSpreadsheet, Globe
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
        addToast(`Initializing encrypted extraction for "${report.title}"...`, 'info');
        setTimeout(() => {
            setGenerating(null);
            addToast(`Report "${report.title}" compiled and downloaded successfully.`, 'success');
        }, 2500);
    };

    const reports = [
        {
            id: 'financial_statement',
            title: 'Financial Statement',
            description: 'Revenue, expenses, and net profit breakdown across all child-nodes.',
            type: 'PDF',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
            accent: 'border-emerald-500/20',
            size: '2.4 MB',
        },
        {
            id: 'user_activity',
            title: 'Identity Activity Log',
            description: 'Comprehensive log of all biometric logins, actions, and engagement patterns.',
            type: 'CSV',
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-500/10',
            accent: 'border-indigo-500/20',
            size: '1.1 MB',
        },
        {
            id: 'audit_log',
            title: 'Security Audit Matrix',
            description: 'Full system audit trail including security events, firewall triggers, and policy changes.',
            type: 'XLSX',
            icon: Shield,
            color: 'text-rose-600',
            bg: 'bg-rose-500/10',
            accent: 'border-rose-500/20',
            size: '3.2 MB',
        },
        {
            id: 'center_perf',
            title: 'Node Performance Review',
            description: 'Occupancy rates, revenue contribution, and staff efficiency metrics per facility.',
            type: 'PDF',
            icon: Building,
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
            accent: 'border-blue-500/20',
            size: '1.8 MB',
        },
        {
            id: 'enrollment',
            title: 'Enrollment & Retention',
            description: 'Student enrollment trends, churn rates, and segment distribution analytics.',
            type: 'PDF',
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
            accent: 'border-amber-500/20',
            size: '900 KB',
        },
        {
            id: 'staff_payroll',
            title: 'Staff Payroll Register',
            description: 'Disbursement logs, staff costs by role, and month-over-month fiscal comparison.',
            type: 'XLSX',
            icon: FileBarChart,
            color: 'text-teal-600',
            bg: 'bg-teal-500/10',
            accent: 'border-teal-500/20',
            size: '1.5 MB',
        },
    ];

    const recentReports = [
        { title: 'Financial Statement (Q4)', date: '2026-02-01', type: 'PDF', status: 'Archive' },
        { title: 'Identity Activity Log', date: '2026-01-28', type: 'CSV', status: 'Extracted' },
        { title: 'Security Audit Matrix', date: '2026-01-15', type: 'XLSX', status: 'Secured' },
    ];

    const ranges = [
        { id: 'this_month', label: 'This Month' },
        { id: 'quarter', label: 'Quarter' },
        { id: 'ytd', label: 'YTD' },
        { id: 'all_time', label: 'All Time' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header / Command Selector */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-indigo-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] italic leading-none">Data Extraction Protocol</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Report <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-primary-600">Forge</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Signal Status: <span className="text-emerald-500 font-black">ENCRYPTED</span> • Protocol: <span className="text-primary-600 font-black">EXTRACTION MODE</span></p>
                </div>
                <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-hide w-full xl:w-auto">
                    {ranges.map(r => (
                        <button
                            key={r.id}
                            onClick={() => {
                                setDateRange(r.id);
                                addToast(`Temporal buffer set to ${r.label}`, 'info');
                            }}
                            className={`flex-1 xl:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${dateRange === r.id ? 'bg-[#0f172a] text-white shadow-lg italic' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {reports.map(report => (
                    <Card
                        key={report.id}
                        className="p-0 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative group rounded-[3.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-700"
                    >
                        <div className="p-10">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-5 ${report.bg} ${report.color} rounded-[1.5rem] shadow-sm group-hover:rotate-12 transition-transform duration-500`}>
                                    <report.icon size={28} />
                                </div>
                                <div className="text-right">
                                    <Badge color="bg-slate-100 text-slate-400" className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full italic border border-slate-200/50">
                                        {report.type}
                                    </Badge>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">{report.size}</p>
                                </div>
                            </div>
                            <h3 className="font-black text-slate-900 mb-3 text-xl italic tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">{report.title}</h3>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed mb-8 italic opacity-80">{report.description}</p>

                            <button
                                onClick={() => handleDownload(report)}
                                disabled={generating === report.id}
                                className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] disabled:opacity-50 shadow-xl flex items-center justify-center gap-3 italic group-hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95"
                            >
                                {generating === report.id ? (
                                    <Activity className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download size={14} />
                                )}
                                {generating === report.id ? 'EXTRACTING...' : 'INITIATE FORGE'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Automated Forge Terminal */}
                <Card className="lg:col-span-3 border-none shadow-[0_30px_100px_-20px_rgba(15,23,42,0.15)] bg-[#0f172a] text-white relative overflow-hidden rounded-[4rem] group/forge">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/forge:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none group-hover/forge:scale-125 transition-transform duration-1000"></div>

                    <div className="relative z-10 p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles size={20} className="text-indigo-400 animate-pulse" />
                            <h3 className="text-3xl font-black italic tracking-tighter">Automated Extraction Nodes</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-bold italic leading-relaxed mb-10 max-w-lg opacity-80">
                            Configure persistent data collection nodes to auto-generate and transmit platform intelligence to designated stakeholders on the 1st of every temporal cycle.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/40 hover:-translate-y-1 transition-all active:scale-95 italic">
                                <Calendar size={14} /> Setup Recurrence
                            </button>
                            <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/10 italic">
                                Sync Archives <ChevronRight size={14} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Extraction History */}
                <Card className="lg:col-span-2 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white p-10 rounded-[4rem]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                            <Clock size={20} className="text-slate-300" />
                        </div>
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.25em] italic">Forge Archives</h4>
                    </div>
                    <div className="space-y-4">
                        {recentReports.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <FileSpreadsheet size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-700 italic leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{r.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{r.date}</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{r.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">{r.status}</span>
                                    </div>
                                    <button className="p-3 text-slate-300 hover:text-indigo-600 bg-white shadow-sm border border-slate-100 rounded-xl transition-all active:scale-95">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors italic">
                        View Complete Ledger
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default ReportsGenerator;
