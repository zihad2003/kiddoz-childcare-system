import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, FileText, Plus, X, User, MapPin, Clock, Search, Filter, CheckCircle2, AlertCircle, Trash2, Signature, Zap, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../ui/Skeleton';

const IncidentReportManager = ({ students = [] }) => {
    const { addToast } = useToast();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('All');

    const [formData, setFormData] = useState({
        studentId: '',
        type: 'Injury',
        severity: 'Low',
        description: '',
        location: '',
        actionTaken: '',
        witnesses: '',
        teacherSignature: ''
    });

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const data = await api.getIncidents();
            setIncidents(data);
        } catch (err) {
            addToast("Failed to sync with Security Vault", "error");
        }
        setLoading(false);
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        if (!formData.studentId || !formData.description) {
            return addToast("Missing critical intelligence parameters", "error");
        }

        try {
            // Simulate teacher signature commitment
            const simulatedSignature = `sig_teacher_${Date.now()}`;
            await api.addIncident({ ...formData, teacherSignature: simulatedSignature });
            addToast("Incident protocol committed successfully", "success");
            setShowForm(false);
            fetchIncidents();
            setFormData({
                studentId: '', type: 'Injury', severity: 'Low', description: '',
                location: '', actionTaken: '', witnesses: '', teacherSignature: ''
            });
        } catch (err) {
            addToast("Protocol commit failed", "error");
        }
    };

    const resolveIncident = async (id) => {
        try {
            await api.updateIncident(id, { status: 'Resolved' });
            addToast("Incident node resolved and archived", "success");
            fetchIncidents();
        } catch (err) {
            addToast("Resolution link failed", "error");
        }
    };

    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = inc.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'Critical': return "bg-red-500/10 text-red-500 border-red-500/20";
            case 'High': return "bg-secondary-500/10 text-secondary-500 border-secondary-500/20";
            case 'Medium': return "bg-secondary-500/10 text-secondary-500 border-secondary-500/20";
            default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pr-2">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-2xl shadow-bg-dark/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-purple/5 blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-bg-dark rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                        <ShieldAlert className="text-primary-magenta animate-pulse" size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-bg-dark tracking-tighter">Security Incident Hub</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Tactical Safety & Compliance Monitoring</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10 w-full lg:w-auto">
                    <div className="flex-1 lg:w-72 relative group">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-purple transition-colors" />
                        <input
                            placeholder="Search Vault Archive..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold tracking-tight outline-none focus:bg-white focus:ring-8 focus:ring-primary-purple/5 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-10 py-4 bg-bg-dark text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                    >
                        <Plus size={20} className="text-primary-magenta" /> File New Incident
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Stats / Filters Sidebar */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6">Severity Filter</h4>
                        <div className="space-y-3">
                            {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                                <button
                                    key={sev}
                                    onClick={() => setFilterSeverity(sev)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all font-bold text-sm tracking-tight",
                                        filterSeverity === sev
                                            ? "bg-bg-dark text-white border-bg-dark shadow-lg -translate-y-1"
                                            : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-white"
                                    )}
                                >
                                    {sev}
                                    {filterSeverity === sev && <ChevronRight size={16} className="text-primary-magenta" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-bg-dark p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-magenta/20 blur-[60px]" />
                        <div className="relative z-10">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Vault Health</h4>
                            <div className="text-3xl font-black tracking-tighter mb-4">98.2%</div>
                            <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-2">
                                <Activity size={12} /> SECURE_UPLINK_STABLE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Incident List */}
                <div className="xl:col-span-9">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div className="flex gap-4">
                                            <Skeleton width="64px" height="64px" variant="rounded" />
                                            <div className="space-y-2">
                                                <Skeleton width="150px" height="24px" />
                                                <Skeleton width="100px" height="16px" />
                                            </div>
                                        </div>
                                        <Skeleton width="80px" height="20px" />
                                    </div>
                                    <Skeleton width="100%" height="40px" variant="rounded" />
                                </div>
                            ))}
                        </div>
                    ) : filteredIncidents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredIncidents.map(inc => (
                                <div key={inc.id} className="group bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                    {/* Background Accent */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-10 rounded-full -mr-20 -mt-20",
                                        inc.severity === 'Critical' ? 'bg-red-500' : 'bg-primary-purple'
                                    )} />

                                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                        <div className={cn(
                                            "w-20 h-20 rounded-[1.8rem] flex items-center justify-center border transition-transform group-hover:rotate-12",
                                            getSeverityStyles(inc.severity)
                                        )}>
                                            <AlertTriangle size={32} />
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-2xl font-black text-bg-dark tracking-tighter">{inc.type} Report</h3>
                                                        <span className={cn(
                                                            "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                            getSeverityStyles(inc.severity)
                                                        )}>
                                                            {inc.severity}_SENSITIVITY
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                                        <User size={12} className="text-primary-magenta" /> SUBJECT: {inc.student?.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-bg-dark tracking-tight">{new Date(inc.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(inc.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                                                <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{inc.description}"</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <MapPin size={16} className="text-primary-purple" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{inc.location || 'SECTOR_UNKNOWN'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <Signature size={16} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{inc.status.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "w-3 h-3 rounded-full animate-pulse",
                                                        inc.status === 'Resolved' ? 'bg-emerald-500' : 'bg-secondary-500'
                                                    )} />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-bg-dark">LINK_STATUS_STABLE</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col gap-3">
                                            {inc.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => resolveIncident(inc.id)}
                                                    className="p-4 bg-bg-dark text-white rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 group/btn"
                                                >
                                                    <CheckCircle2 size={24} className="group-hover/btn:text-emerald-400 transition-colors" />
                                                </button>
                                            )}
                                            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100">
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
                            <ShieldCheck size={80} className="text-slate-200 mb-8" />
                            <h3 className="text-2xl font-black text-bg-dark tracking-tighter">Zero Breaches Detected</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Security Perimeter Remains Nominal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-bg-dark/60 backdrop-blur-3xl animate-fade-in">
                    <div className="w-full max-w-4xl bg-white rounded-[4rem] border-white shadow-[0_60px_150px_rgba(0,0,0,0.6)] relative overflow-hidden animate-zoom-in h-[85vh] flex flex-col">
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-red-500/5 via-primary-magenta/5 to-primary-purple/5" />

                        <div className="p-12 relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-bg-dark rounded-2xl flex items-center justify-center text-white shadow-2xl scale-110">
                                        <AlertTriangle className="text-primary-magenta" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-bg-dark tracking-tighter">New Intelligence Extraction</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Security Sector: Incident Reporting</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-bg-dark hover:rotate-90 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSumbit} className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-10 pb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Authorization</label>
                                        <select
                                            value={formData.studentId}
                                            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:ring-8 focus:ring-primary-purple/5 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Managed Subject...</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.name} - {s.id}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Incident Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none"
                                            >
                                                <option>Injury</option>
                                                <option>Behavioral</option>
                                                <option>Medical</option>
                                                <option>Illness</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Severity Tier</label>
                                            <select
                                                value={formData.severity}
                                                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                                className="w-full bg-slate-100 font-black text-bg-dark border border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none"
                                            >
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                                <option>Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Extraction Log (Description)</label>
                                        <textarea
                                            placeholder="Provide detailed chronological intelligence of the event..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-medium tracking-tight outline-none focus:bg-white transition-all h-32 resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Geo-Location Sector</label>
                                        <input
                                            placeholder="e.g. Playground, Sector 04..."
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-8 focus:ring-primary-purple/5 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Counter-Procedures (Action Taken)</label>
                                        <input
                                            placeholder="e.g. First Aid Applied, Parent Called..."
                                            value={formData.actionTaken}
                                            onChange={e => setFormData({ ...formData, actionTaken: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-bg-dark text-white relative overflow-hidden flex flex-col sm:flex-row gap-8 items-center">
                                    <div className="p-5 bg-white/10 rounded-2xl shadow-inner border border-white/5">
                                        <Signature size={40} className="text-primary-magenta" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-black text-lg tracking-tight mb-1">Authorization Commitment</h5>
                                        <p className="text-white/60 text-[9px] font-black uppercase tracking-widest leading-relaxed">By committing this report, you authorize that the intelligence provided is accurate and complies with center security protocols.</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-12 py-5 bg-primary-magenta text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#ff4fd8] transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Zap size={18} /> Commit Intelligence
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentReportManager;
