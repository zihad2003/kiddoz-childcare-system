import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Shield, Globe, Bell, Lock, Activity, Server } from 'lucide-react';
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
            const data = await api.get('/superadmin/settings').then(res => res.data);
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
            // Save each setting key
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
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Loading platform configuration...</p>
        </div>
    );

    return (
        <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Infrastructure</h2>
                    <p className="text-slate-500 mt-1">Configure global parameters and security protocols</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={fetchSettings} className="font-bold border-2">
                        <RefreshCw size={18} className="mr-2" /> Reset
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving} className="font-bold shadow-lg shadow-primary-100 px-8">
                        {saving ? 'Synchronizing...' : (
                            <><Save size={18} className="mr-2" /> Deploy Changes</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* General Config */}
                <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><Globe size={20} /></div>
                        <h3 className="text-xl font-black text-slate-900">General Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Identity</label>
                            <input
                                type="text"
                                value={settings.systemName}
                                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Support Email</label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                    </div>
                </Card>

                {/* Operations & Safety */}
                <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Shield size={20} /></div>
                        <h3 className="text-xl font-black text-slate-900">Operations & Safety</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-red-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <Activity className="text-red-400" size={24} />
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm italic">Maintenance Protocol</h4>
                                    <p className="text-xs text-slate-400 font-medium">Immediately restrict platform access to administrative personnel only.</p>
                                </div>
                            </div>
                            <div
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <Lock className="text-emerald-400" size={24} />
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm italic">Enrollment Gateway</h4>
                                    <p className="text-xs text-slate-400 font-medium">Control the availability of new parent and staff registration.</p>
                                </div>
                            </div>
                            <div
                                onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${settings.allowRegistration ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${settings.allowRegistration ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <Bell className="text-blue-400" size={24} />
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm italic">Signal Broadcast</h4>
                                    <p className="text-xs text-slate-400 font-medium">Toggle global email and push notification systems.</p>
                                </div>
                            </div>
                            <div
                                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${settings.emailNotifications ? 'bg-blue-500' : 'bg-slate-300'}`}
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Infrastructure */}
                <Card className="p-8 border-none shadow-xl bg-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-secondary-50 text-secondary-600 rounded-2xl"><Server size={20} /></div>
                        <h3 className="text-xl font-black text-slate-900">Infrastructure & AI</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Payload Size (MB)</label>
                            <input
                                type="number"
                                value={settings.maxUploadSize}
                                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-secondary-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                            />
                        </div>

                        {/* YOLO Config */}
                        <div className="space-y-4 p-6 bg-slate-900 rounded-3xl text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Activity className="text-primary-400" size={18} />
                                    <h4 className="font-black text-sm italic">Live Broadcast Matrix</h4>
                                </div>
                                <div
                                    onClick={() => setSettings({
                                        ...settings,
                                        'yolo.liveStream': { ...settings['yolo.liveStream'], active: !settings['yolo.liveStream']?.active }
                                    })}
                                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${settings['yolo.liveStream']?.active ? 'bg-primary-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${settings['yolo.liveStream']?.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {['demo', 'ip-cam'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setSettings({
                                            ...settings,
                                            'yolo.liveStream': { ...settings['yolo.liveStream'], type: mode }
                                        })}
                                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${settings['yolo.liveStream']?.type === mode
                                            ? 'bg-primary-600 border border-primary-400 text-white'
                                            : 'bg-slate-800 border border-slate-700 text-slate-500'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>

                            {settings['yolo.liveStream']?.type === 'ip-cam' && (
                                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">IP Camera URL</label>
                                        <input
                                            type="text"
                                            value={settings['yolo.liveStream']?.url || ''}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                'yolo.liveStream': { ...settings['yolo.liveStream'], url: e.target.value }
                                            })}
                                            placeholder="http://192.168.1.100:8080"
                                            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl font-mono text-xs text-primary-300 outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-tight italic">
                                        Streams are proxied via 5001 to avoid mixed-content blocking.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SystemSettings;

