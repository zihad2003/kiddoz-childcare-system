import React from 'react';
import { FileBarChart, Download, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ReportsGenerator = () => {
    const { addToast } = useToast();

    const handleDownload = (type) => {
        addToast(`Generating ${type} report...`, 'info');
        // Mock download
        setTimeout(() => {
            addToast(`${type} report downloaded successfully`, 'success');
        }, 1500);
    };

    const reports = [
        { id: 'financial_ytd', title: 'Financial Statement (YTD)', type: 'PDF', icon: '💰' },
        { id: 'user_activity', title: 'User Activity Log', type: 'CSV', icon: '👥' },
        { id: 'audit_log', title: 'System Security Audit', type: 'Excel', icon: '🔒' },
        { id: 'center_perf', title: 'Center Performance Review', type: 'PDF', icon: 'building' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Reports Generator</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map(report => (
                    <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-purple-200 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-50 transition">
                                {report.icon === 'building' ? <FileBarChart size={24} className="text-purple-600" /> : report.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{report.title}</h3>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{report.type}</p>
                            </div>
                        </div>
                        <Button variant="secondary" onClick={() => handleDownload(report.title)}>
                            <Download size={18} />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="bg-purple-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Automated Monthly Reports</h3>
                    <p className="text-purple-200 mb-6 max-w-md">Schedule detailed insights to be delivered directly to your inbox on the 1st of every month.</p>
                    <Button className="bg-white text-purple-900 hover:bg-purple-50 border-none">Configure Schedule</Button>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-purple-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            </div>
        </div>
    );
};

export default ReportsGenerator;
