import React, { useState, useEffect } from 'react';
import { Smartphone, Upload, Bell, GitCommit, ShieldCheck, Zap, ArrowRight, Activity } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const AppManagement = () => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // New Version Form
    const [versionData, setVersionData] = useState({ version: '', changes: '', forceUpdate: false });

    useEffect(() => {
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            const data = await api.getAppVersions();
            setVersions(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleRelease = async (e) => {
        e.preventDefault();
        try {
            await api.createAppVersion(versionData);
            addToast('New version released!', 'success');
            setVersionData({ version: '', changes: '', forceUpdate: false });
            fetchVersions();
        } catch (error) {
            addToast('Failed to release version', 'error');
        }
    };

    const handlePushNotification = async () => {
        addToast('Push notification queued for all users', 'success');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                <Smartphone className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Syncing App Registry...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Mobile Infrastructure Control</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">App Lifecycle <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Forge</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Deployment Status: <span className="text-emerald-500 font-black">ACTIVE</span> • Distribution Nodes: <span className="text-primary-600 font-black">12</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Release New Version */}
                <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>

                    <div className="flex items-center gap-5 mb-10 relative z-10">
                        <div className="p-4 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-900/20 group-hover:rotate-6 transition-transform">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-900 italic leading-none mb-1">Binary Deployment</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">New Version Injection</p>
                        </div>
                    </div>

                    <form onSubmit={handleRelease} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Version Indicator</label>
                            <Input
                                placeholder="e.g. 2.0.1"
                                className="bg-slate-50/50 border-slate-200/60 rounded-2xl font-black italic text-lg h-14"
                                value={versionData.version}
                                onChange={(e) => setVersionData({ ...versionData, version: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Changelog Metadata</label>
                            <textarea
                                className="w-full bg-slate-50/50 border border-slate-200/60 text-slate-800 rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-sm min-h-[120px]"
                                placeholder="Detail the structural changes..."
                                value={versionData.changes}
                                onChange={(e) => setVersionData({ ...versionData, changes: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-3 p-5 bg-red-50/50 rounded-2xl border border-red-100/50 group/check cursor-pointer" onClick={() => setVersionData({ ...versionData, forceUpdate: !versionData.forceUpdate })}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${versionData.forceUpdate ? 'bg-red-500 border-red-500' : 'bg-white border-red-200'}`}>
                                {versionData.forceUpdate && <ShieldCheck size={14} className="text-white" />}
                            </div>
                            <span className="text-[11px] font-black text-red-700 uppercase tracking-widest italic">Escalate to Critical Security Fix</span>
                        </div>
                        <Button type="submit" variant="primary" className="w-full h-16 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] italic shadow-2xl shadow-primary-900/30 hover:-translate-y-1 transition-all">
                            Release To App Store
                        </Button>
                    </form>
                </Card>

                {/* Engagement / Push */}
                <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(15,23,42,0.1)] bg-[#0f172a] text-white relative overflow-hidden group/push rounded-[3.5rem]">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/push:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="flex items-center gap-5 mb-10 relative z-10">
                        <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-900/40 group-hover:rotate-6 transition-transform">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-primary-400 italic leading-none mb-1">Global Oscillator</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cross-Network Notification</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Transmission Header</label>
                            <Input
                                placeholder="Attention Required"
                                className="bg-white/5 border-white/10 rounded-2xl font-black italic text-white h-14 focus:bg-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Payload Body</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-bold text-sm min-h-[120px] focus:bg-white/10"
                                placeholder="Describe the notification payload..."
                            />
                        </div>
                        <div className="pt-4">
                            <Button onClick={handlePushNotification} className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] italic shadow-2xl shadow-orange-900/50 hover:-translate-y-1 transition-all">
                                Broadcast To Identity Network
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Version History Table */}
            <Card className="p-12 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 shadow-inner group-hover:rotate-6 transition-transform">
                            <GitCommit size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-900 italic leading-none mb-1">Deployment Ledger</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Historical Binary Records</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                        <Activity size={16} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Live Feed Connected</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {versions.map(v => (
                        <div key={v.id} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-white hover:shadow-2xl hover:border-primary-100 transition-all duration-500 group/vrow">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter">v{v.version}</h4>
                                    {v.forceUpdate && (
                                        <Badge color="bg-red-500 text-white" className="font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-red-200">
                                            Critical Forge
                                        </Badge>
                                    )}
                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                                        <Zap size={10} /> {new Date(v.releasedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl">{v.changes}</p>
                            </div>
                            <div className="flex items-center gap-8 mt-6 md:mt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Network Reach</p>
                                    <p className="text-2xl font-black text-primary-600 italic tracking-tighter leading-none">{(Math.random() * 5000 + 1000).toFixed(0)} <span className="text-[10px] text-slate-300 ml-1">IDs</span></p>
                                </div>
                                <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:shadow-xl transition-all active:scale-95">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {versions.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                            <GitCommit size={48} className="mx-auto text-slate-200 mb-6" />
                            <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] italic">No Binary Records Found in Ledger</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AppManagement;
