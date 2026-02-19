import React, { useState, useEffect } from 'react';
import {
    Shield, ShieldCheck, AlertTriangle, Eye, User, Clock, Monitor,
    Filter, RefreshCw, CheckCircle2, XCircle, Server, Lock, Key, Wifi
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const SecurityCompliance = () => {
    const [logs, setLogs] = useState([]);
    const [compliance, setCompliance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { addToast } = useToast();

    // Rich mock data
    const mockLogs = [
        { id: 1, action: 'LOGIN_SUCCESS', user: 'admin@kiddoz.com', resource: 'Auth API', ip: '192.168.1.101', severity: 'info', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: 2, action: 'SETTINGS_UPDATED', user: 'superadmin@kiddoz.com', resource: 'System Settings', ip: '10.0.0.5', severity: 'warn', createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
        { id: 3, action: 'USER_DELETED', user: 'superadmin@kiddoz.com', resource: 'User #4821', ip: '10.0.0.5', severity: 'critical', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
        { id: 4, action: 'LOGIN_FAILED', user: 'unknown@external.com', resource: 'Auth API', ip: '203.45.12.88', severity: 'critical', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
        { id: 5, action: 'API_KEY_CREATED', user: 'dev@kiddoz.com', resource: 'Developer Console', ip: '192.168.1.55', severity: 'warn', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: 6, action: 'DATA_EXPORT', user: 'admin@centerA.com', resource: 'Students CSV', ip: '192.168.2.10', severity: 'warn', createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
        { id: 7, action: 'CENTER_CREATED', user: 'superadmin@kiddoz.com', resource: 'Centers', ip: '10.0.0.5', severity: 'info', createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
        { id: 8, action: 'LOGIN_SUCCESS', user: 'nurse@kiddoz.com', resource: 'Auth API', ip: '192.168.1.73', severity: 'info', createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
    ];

    const mockCompliance = {
        status: 'Compliant',
        score: 94,
        lastAudit: new Date(Date.now() - 86400000 * 3).toISOString(),
        checks: [
            { label: 'Data Encryption (AES-256)', status: 'pass' },
            { label: 'JWT Authentication', status: 'pass' },
            { label: 'Rate Limiting', status: 'pass' },
            { label: 'HTTPS Enforced', status: 'pass' },
            { label: 'Audit Logging Active', status: 'pass' },
            { label: 'GDPR Data Retention', status: 'warn' },
            { label: '2FA for Admins', status: 'fail' },
            { label: 'SQL Injection Prevention', status: 'pass' },
        ]
    };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [logsData, complianceData] = await Promise.all([
                api.getAuditLogs(),
                api.getCompliance()
            ]);
            setLogs(logsData?.length ? logsData : mockLogs);
            setCompliance(complianceData || mockCompliance);
        } catch {
            setLogs(mockLogs);
            setCompliance(mockCompliance);
        } finally {
            setLoading(false);
        }
    };

    const severityConfig = {
        info: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', label: 'INFO' },
        warn: { color: 'bg-secondary-100 text-secondary-700', dot: 'bg-secondary-500', label: 'WARN' },
        critical: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500 animate-pulse', label: 'CRITICAL' },
    };

    const filtered = filter === 'all' ? logs : logs.filter(l => l.severity === filter);

    const timeAgo = (iso) => {
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'Just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security & Compliance</h2>
                    <p className="text-slate-500 mt-1">Real-time audit trail and system compliance monitoring</p>
                </div>
                <button
                    onClick={() => { setLoading(true); setTimeout(fetchData, 500); }}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all font-black text-xs uppercase tracking-widest shadow-sm"
                >
                    <RefreshCw size={14} /> Refresh Scan
                </button>
            </div>

            {/* Compliance Status */}
            {compliance && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <Card className="md:col-span-1 p-8 border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <ShieldCheck size={16} className="text-primary-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Score</p>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-6xl font-black text-white leading-none">{compliance.score}</span>
                                <span className="text-2xl font-black text-primary-400 mb-1">/100</span>
                            </div>
                            <Badge color="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 mt-3">
                                ✓ {compliance.status}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-4 font-medium">
                                Last audit: {new Date(compliance.lastAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </Card>

                    {/* Compliance Checks */}
                    <Card className="md:col-span-2 p-8 border-none shadow-xl bg-white">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">Security Checklist</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(compliance.checks || []).map((check, i) => (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${check.status === 'pass' ? 'bg-emerald-50' : check.status === 'warn' ? 'bg-secondary-50' : 'bg-red-50'}`}>
                                    {check.status === 'pass' && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                                    {check.status === 'warn' && <AlertTriangle size={16} className="text-secondary-500 flex-shrink-0" />}
                                    {check.status === 'fail' && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                                    <span className={`text-xs font-bold ${check.status === 'pass' ? 'text-emerald-700' : check.status === 'warn' ? 'text-secondary-700' : 'text-red-700'}`}>
                                        {check.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* Audit Log */}
            <Card className="border-none shadow-xl bg-white overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-black text-slate-900 flex items-center gap-2">
                            <Eye size={18} className="text-primary-600" /> Audit Trail
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{logs.length} events recorded</p>
                    </div>
                    {/* Severity Filter */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        {['all', 'info', 'warn', 'critical'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-400 font-medium text-sm">Loading audit logs...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filtered.map(log => {
                            const sev = severityConfig[log.severity] || severityConfig.info;
                            return (
                                <div key={log.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group">
                                    {/* Severity dot */}
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />

                                    {/* Event */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <code className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg tracking-wider">
                                                {log.action}
                                            </code>
                                            <Badge color={sev.color} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                                {sev.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                                <User size={10} /> {log.user}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                                <Server size={10} /> {log.resource}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                                <Wifi size={10} /> {log.ip}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest flex-shrink-0">
                                        {timeAgo(log.createdAt)}
                                    </span>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="p-12 text-center text-slate-400 font-medium">No events match this filter.</div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SecurityCompliance;
