import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Search, Clock, Fingerprint } from 'lucide-react';
import api from '../../services/api';
import Badge from '../ui/Badge';

const SecurityCompliance = () => {
    const [logs, setLogs] = useState([]);
    const [compliance, setCompliance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsData, complianceData] = await Promise.all([
                api.getAuditLogs(),
                api.getCompliance()
            ]);
            setLogs(logsData);
            setCompliance(complianceData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching security data');
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        if (action.includes('DELETE') || action.includes('SUSPEND')) return 'bg-red-100 text-red-700';
        if (action.includes('CREATE') || action.includes('ADD')) return 'bg-green-100 text-green-700';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-100 text-blue-700';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Security & Compliance</h2>

            {/* Compliance Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">System Compliance Status</h3>
                        <p className="text-slate-500">Last checked: {compliance ? new Date(compliance.lastCheck).toLocaleDateString() : 'Checking...'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold">
                        <CheckCircle size={20} />
                        {compliance?.status || 'Active'}
                    </div>
                </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Fingerprint size={20} className="text-purple-600" />
                        Audit Trail
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Resource</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-500">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-500">No audit logs found.</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                            {log.user?.fullName || 'System'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={getActionColor(log.action)}>{log.action}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                            {log.resource}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {log.ipAddress || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityCompliance;
