import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const SystemSettings = () => {
    const { addToast } = useToast();
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        systemName: 'KiddoZ Platform',
        supportEmail: 'support@kiddoz.com',
        maxUploadSize: '10'
    });

    const handleSave = () => {
        // Mock save
        addToast('System settings saved', 'success');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">General Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">System Name</label>
                                <input
                                    type="text"
                                    value={settings.systemName}
                                    onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Feature Toggles</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-slate-800">Maintenance Mode</h4>
                                    <p className="text-sm text-slate-500">Disable access for all non-admin users</p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle-maint"
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                    />
                                    <label htmlFor="toggle-maint" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.maintenanceMode ? 'bg-purple-600' : 'bg-slate-300'}`}></label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-slate-800">Allow New Registrations</h4>
                                    <p className="text-sm text-slate-500">Control if new users can sign up</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.allowRegistration}
                                    onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                                    className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 border-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                        <Button variant="secondary" className="flex items-center gap-2">
                            <RefreshCw size={18} /> Reset
                        </Button>
                        <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
                            <Save size={18} /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
