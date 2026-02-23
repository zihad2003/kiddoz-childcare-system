import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Shield, Globe, Bell, Lock, Activity, Server, Cpu, Key, Database, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Card from '../ui/Card';

const SystemSettings = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        systemName: 'KiddoZ Platform',
        supportEmail: 'support@kiddoz.com',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        maxUploadSize: '10'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await api.get('/superadmin/settings');
            if (data && data.length > 0) {
                const combinedSettings = {};
                data.forEach(s => {
                    try {
                        combinedSettings[s.settingKey] = JSON.parse(s.settingValue);
                    } catch (e) {
                        combinedSettings[s.settingKey] = s.settingValue;
                    }
                });
                setSettings(prev => ({ ...prev, ...combinedSettings }));
            }
            setLoading(false);
        } catch (error) {
            addToast('Failed to load settings', 'error');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const savePromises = Object.entries(settings).map(([key, value]) =>
                api.post('/superadmin/settings', { key, value })
            );
            await Promise.all(savePromises);
            addToast('Platform configuration synchronized', 'success');
        } catch (error) {
            addToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-slate-200">
                <Cpu className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Syncing Core Bios...</p>
        </div>
    );

    return (
        <div className="max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Kernel Configuration Panel</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">System <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Bios</span> Override</h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Config Integrity: <span className="text-emerald-500 font-black">HIGH</span> • Master Token: <span className="text-primary-600 font-black">VALID</span></p>
                </div>
                <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={fetchSettings} className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:border-primary-300 hover:text-primary-600 hover:shadow-xl transition-all duration-500 active:scale-95 shadow-sm">
                        <RefreshCw size={16} /> Hot-Reload
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl">
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
                        {saving ? 'Synchronizing' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-10">
                    {/* General Intel */}
                    <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-900/20 group-hover:rotate-6 transition-transform">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 italic leading-none mb-1">Global Identity</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Public Node Discovery</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Platform Label</label>
                                <input
                                    type="text"
                                    value={settings.systemName}
                                    onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                    className="w-full p-5 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-black text-slate-700 italic"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Support Endpoint</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                    className="w-full p-5 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-black text-slate-700 italic"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Infrastructure Toggles */}
                    <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-red-600 rounded-2xl text-white shadow-xl shadow-red-900/20 group-hover:rotate-6 transition-transform">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 italic leading-none mb-1">Ops & Defensive Grid</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Availability Controls</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'maintenanceMode', icon: Activity, color: 'text-red-500', bg: 'hover:border-red-100', label: 'Maintenance Isolation', desc: 'Immediately restrict platform access to administrative nodes only.' },
                                { key: 'allowRegistration', icon: Lock, color: 'text-emerald-500', bg: 'hover:border-emerald-100', label: 'Enrollment Gateway', desc: 'Control the availability of new parent and staff registration vectors.' },
                                { key: 'emailNotifications', icon: Bell, color: 'text-blue-500', bg: 'hover:border-blue-100', label: 'Signal Broadcast', desc: 'Toggle global email and push notification transmission systems.' }
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                                    className={`flex items-center justify-between p-7 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 ${item.bg} transition-all duration-300 group/row cursor-pointer`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 bg-white rounded-2xl shadow-sm ${item.color} group-hover/row:scale-110 transition-transform`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-base italic leading-none mb-1">{item.label}</h4>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-16 h-9 rounded-full p-1.5 transition-all duration-500 ${settings[item.key] ? (item.key === 'maintenanceMode' ? 'bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]' : 'bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)]') : 'bg-slate-200'}`}>
                                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 ${settings[item.key] ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-10">
                    {/* Resource Control */}
                    <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/20 group-hover:rotate-6 transition-transform">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900 italic leading-none mb-1">Resource Capping</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Infrastructure Quotas</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Max Payload Volume (MB)</label>
                            <input
                                type="number"
                                value={settings.maxUploadSize}
                                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                                className="w-full p-5 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-slate-700 italic text-2xl tracking-tighter"
                            />
                            <div className="flex justify-between px-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Limit: 100MB</span>
                                <span className="text-[9px] font-bold text-indigo-500 uppercase italic">Enterprise Standard</span>
                            </div>
                        </div>
                    </Card>

                    {/* YOLO Advanced Module */}
                    <Card className="p-10 border-none shadow-[0_30px_100px_-20px_rgba(15,23,42,0.1)] bg-[#0f172a] text-white relative overflow-hidden group/push rounded-[3.5rem]">
                        <div className="absolute inset-0 opacity-10 mix-blend-overlay group-hover/push:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-900/40 group-hover:rotate-6 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <h3 className="font-black text-xl text-primary-400 italic leading-none">Neural Vision</h3>
                            </div>
                            <div
                                onClick={() => setSettings({
                                    ...settings,
                                    'yolo.liveStream': { ...settings['yolo.liveStream'], active: !settings['yolo.liveStream']?.active }
                                })}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${settings['yolo.liveStream']?.active ? 'bg-primary-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings['yolo.liveStream']?.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-3">
                                {['demo', 'ip-cam'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setSettings({
                                            ...settings,
                                            'yolo.liveStream': { ...settings['yolo.liveStream'], type: mode }
                                        })}
                                        className={`py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${settings['yolo.liveStream']?.type === mode
                                            ? 'bg-primary-600 shadow-lg shadow-primary-900/50 text-white italic'
                                            : 'bg-white/5 border border-white/10 text-slate-500'}`}
                                    >
                                        {mode === 'demo' ? 'Synthetic' : 'Hardlink'}
                                    </button>
                                ))}
                            </div>

                            {settings['yolo.liveStream']?.type === 'ip-cam' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 italic">Vision Endpoint URL</label>
                                        <input
                                            type="text"
                                            value={settings['yolo.liveStream']?.url || ''}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                'yolo.liveStream': { ...settings['yolo.liveStream'], url: e.target.value }
                                            })}
                                            placeholder="rtsp://node.identity.local:8080"
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-mono text-[11px] text-primary-300 outline-none focus:border-primary-500 focus:bg-white/10 transition-all shadow-inner"
                                        />
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-tight italic px-1">
                                        Secure tunneling via 5001 is enforced to mitigate mixed-content hijacking.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-8 border-none bg-gradient-to-br from-primary-600/10 to-indigo-600/10 rounded-[2.5rem] border border-primary-500/10">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-primary-500" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Node Status: <span className="text-emerald-500">Primary</span></p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
