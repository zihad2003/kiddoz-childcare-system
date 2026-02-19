import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Bell, Moon, Lock, Save, Globe } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AppSettings = () => {
    const { addToast } = useToast();
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        language: 'English',
        twoFactor: false
    });

    const handleSave = () => {
        // Simulate API call
        setTimeout(() => {
            addToast('Settings saved successfully', 'success');
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
                    <p className="text-slate-500">Manage application preferences and security.</p>
                </div>
                <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">
                    <Save size={18} className="mr-2" /> Save Changes
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6">
                    <h3 className="font-bold text-lg border-b border-slate-100 pb-2 mb-4">General Preferences</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><Bell size={20} /></div>
                            <div>
                                <p className="font-semibold text-slate-700">Push Notifications</p>
                                <p className="text-xs text-slate-400">Receive alerts for incidents & messages</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({ ...settings, notifications: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><Moon size={20} /></div>
                            <div>
                                <p className="font-semibold text-slate-700">Dark Mode</p>
                                <p className="text-xs text-slate-400">Switch to dark theme interface</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.darkMode} onChange={e => setSettings({ ...settings, darkMode: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Globe size={20} /></div>
                            <div>
                                <p className="font-semibold text-slate-700">Language</p>
                                <p className="text-xs text-slate-400">System language preference</p>
                            </div>
                        </div>
                        <select
                            value={settings.language}
                            onChange={e => setSettings({ ...settings, language: e.target.value })}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                        >
                            <option>English</option>
                            <option>Bengali</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </Card>

                <Card className="p-6 space-y-6">
                    <h3 className="font-bold text-lg border-b border-slate-100 pb-2 mb-4">Security</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><Lock size={20} /></div>
                            <div>
                                <p className="font-semibold text-slate-700">Two-Factor Auth</p>
                                <p className="text-xs text-slate-400">Add an extra layer of security</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.twoFactor} onChange={e => setSettings({ ...settings, twoFactor: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                    </div>

                    <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-4">
                        <p className="text-xs text-secondary-800 font-bold mb-1">Administrative Access</p>
                        <p className="text-xs text-secondary-600 leading-relaxed">
                            Changes to security settings will require re-authentication for all admin users. Ensure you have backup codes saved before enabling 2FA.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AppSettings;
