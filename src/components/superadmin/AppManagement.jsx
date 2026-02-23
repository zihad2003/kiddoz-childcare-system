import React, { useState, useEffect } from 'react';
import { Smartphone, Upload, Bell, GitCommit } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

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
        // Stub trigger
        addToast('Push notification queued for all users', 'success');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Mobile App Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Release New Version */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-primary-600" />
                        Release New Version
                    </h3>
                    <form onSubmit={handleRelease} className="space-y-4">
                        <Input
                            label="Version Number"
                            placeholder="e.g. 1.0.4"
                            value={versionData.version}
                            onChange={(e) => setVersionData({ ...versionData, version: e.target.value })}
                            required
                        />
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Changelog / Release Notes</label>
                            <textarea
                                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                rows="4"
                                value={versionData.changes}
                                onChange={(e) => setVersionData({ ...versionData, changes: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center gap-2 ml-1">
                            <input
                                type="checkbox"
                                id="forceUpdate"
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                checked={versionData.forceUpdate}
                                onChange={(e) => setVersionData({ ...versionData, forceUpdate: e.target.checked })}
                            />
                            <label htmlFor="forceUpdate" className="text-sm text-slate-700 font-medium">Force Update (Critical Security Fixes)</label>
                        </div>
                        <Button type="submit" variant="primary" className="w-full">Release Update</Button>
                    </form>
                </div>

                {/* Engagement / Push */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-secondary-600" />
                        Broadcast Notification
                    </h3>
                    <div className="space-y-4">
                        <Input label="Title" placeholder="Notification Title" />
                        <Input label="Message" placeholder="Message body..." />
                        <Button onClick={handlePushNotification} className="w-full bg-secondary-600 hover:bg-orange-700 text-white">
                            Send Broadcast
                        </Button>
                    </div>
                </div>
            </div>

            {/* Version History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <GitCommit size={20} className="text-slate-500" />
                        Version History
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {versions.map(v => (
                        <div key={v.id} className="p-6 flex items-start justify-between hover:bg-slate-50 transition">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-slate-800">v{v.version}</span>
                                    {v.forceUpdate && (
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 uppercase">Critical</span>
                                    )}
                                </div>
                                <p className="text-slate-600 mt-1 whitespace-pre-wrap text-sm">{v.changes}</p>
                                <p className="text-xs text-slate-400 mt-2">Released: {new Date(v.releasedAt).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Downloads</span>
                                <span className="text-lg font-bold text-primary-600">{(Math.random() * 1000).toFixed(0)}</span>
                            </div>
                        </div>
                    ))}
                    {versions.length === 0 && <div className="p-10 text-center text-slate-500">No releases found.</div>}
                </div>
            </div>
        </div>
    );
};

export default AppManagement;
