import React, { useState, useEffect } from 'react';
import { Settings, Save, Download, Shield, Clock, Bell, Database, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AppSettings = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await api.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            addToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }));
        setHasChanges(true);
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            const updates = {};
            Object.keys(settings).forEach(key => {
                updates[key] = settings[key].value;
            });

            await api.updateSettings(updates);
            addToast('Settings saved successfully', 'success');
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save settings:', error);
            addToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const exportData = async (type) => {
        try {
            await api.exportData(type);
            addToast(`${type} data exported successfully`, 'success');
        } catch (error) {
            console.error('Export failed:', error);
            addToast('Export failed', 'error');
        }
    };

    const ToggleSwitch = ({ enabled, onChange, label, description }) => (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
            <div className="flex-1">
                <p className="font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
            <div
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                onClick={onChange}
            >
                <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${enabled ? 'right-1' : 'left-1'
                        }`}
                />
            </div>
        </div>
    );

    const SelectInput = ({ value, onChange, options, label, description }) => (
        <div className="py-4 border-b border-slate-100 last:border-0">
            <label className="block">
                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                <p className="text-xs text-slate-500 mb-2">{description}</p>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </label>
        </div>
    );

    const NumberInput = ({ value, onChange, label, description, min, max, suffix }) => (
        <div className="py-4 border-b border-slate-100 last:border-0">
            <label className="block">
                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                <p className="text-xs text-slate-500 mb-2">{description}</p>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        min={min}
                        max={max}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                    />
                    {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
                </div>
            </label>
        </div>
    );

    const TimeInput = ({ value, onChange, label, description }) => (
        <div className="py-4 border-b border-slate-100 last:border-0">
            <label className="block">
                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                <p className="text-xs text-slate-500 mb-2">{description}</p>
                <input
                    type="time"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
            </label>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Save Button - Sticky */}
            {hasChanges && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom duration-300">
                    <Button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:bg-purple-700 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* General Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Settings className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">General Settings</h3>
                        <p className="text-sm text-slate-500">Core application configuration</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <ToggleSwitch
                        enabled={settings['general.notifications']?.value}
                        onChange={() => updateSetting('general.notifications', !settings['general.notifications']?.value)}
                        label="System Notifications"
                        description="Enable email alerts for staff members"
                    />
                    <ToggleSwitch
                        enabled={settings['general.maintenance']?.value}
                        onChange={() => updateSetting('general.maintenance', !settings['general.maintenance']?.value)}
                        label="Maintenance Mode"
                        description="Temporarily disable parent portal access"
                    />
                    <ToggleSwitch
                        enabled={settings['general.autoBackup']?.value}
                        onChange={() => updateSetting('general.autoBackup', !settings['general.autoBackup']?.value)}
                        label="Automatic Backups"
                        description="Enable daily database backups at midnight"
                    />
                    <ToggleSwitch
                        enabled={settings['general.darkMode']?.value}
                        onChange={() => updateSetting('general.darkMode', !settings['general.darkMode']?.value)}
                        label="Dark Mode"
                        description="Enable dark theme for the admin interface"
                    />
                </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="text-red-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Security Settings</h3>
                        <p className="text-sm text-slate-500">Authentication and access control</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <SelectInput
                        value={settings['security.sessionTimeout']?.value}
                        onChange={(val) => updateSetting('security.sessionTimeout', val)}
                        options={[
                            { value: '15min', label: '15 minutes' },
                            { value: '30min', label: '30 minutes' },
                            { value: '1hr', label: '1 hour' },
                            { value: '2hr', label: '2 hours' },
                            { value: '4hr', label: '4 hours' }
                        ]}
                        label="Session Timeout"
                        description="Automatic logout after inactivity"
                    />
                    <ToggleSwitch
                        enabled={settings['security.require2FA']?.value}
                        onChange={() => updateSetting('security.require2FA', !settings['security.require2FA']?.value)}
                        label="Require Two-Factor Authentication"
                        description="Enforce 2FA for all admin accounts"
                    />
                    <NumberInput
                        value={settings['security.passwordExpiry']?.value}
                        onChange={(val) => updateSetting('security.passwordExpiry', val)}
                        label="Password Expiry Period"
                        description="Force password change after this many days"
                        min={0}
                        max={365}
                        suffix="days"
                    />
                    <NumberInput
                        value={settings['security.loginAttempts']?.value}
                        onChange={(val) => updateSetting('security.loginAttempts', val)}
                        label="Failed Login Attempts Limit"
                        description="Lock account after this many failed attempts"
                        min={3}
                        max={10}
                        suffix="attempts"
                    />
                </div>
            </Card>

            {/* Operational Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Operational Settings</h3>
                        <p className="text-sm text-slate-500">Daily operations and capacity management</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <TimeInput
                        value={settings['operational.checkinStart']?.value}
                        onChange={(val) => updateSetting('operational.checkinStart', val)}
                        label="Check-in Start Time"
                        description="Daily student check-in begins at"
                    />
                    <TimeInput
                        value={settings['operational.checkoutEnd']?.value}
                        onChange={(val) => updateSetting('operational.checkoutEnd', val)}
                        label="Check-out End Time"
                        description="Daily student check-out ends at"
                    />
                    <NumberInput
                        value={settings['operational.maxCapacity']?.value}
                        onChange={(val) => updateSetting('operational.maxCapacity', val)}
                        label="Maximum Student Capacity"
                        description="Total number of students allowed"
                        min={1}
                        max={500}
                        suffix="students"
                    />
                    <NumberInput
                        value={settings['operational.staffRatio']?.value}
                        onChange={(val) => updateSetting('operational.staffRatio', val)}
                        label="Staff-to-Child Ratio"
                        description="Number of children per staff member"
                        min={1}
                        max={20}
                        suffix="children/staff"
                    />
                    <NumberInput
                        value={settings['operational.lateGracePeriod']?.value}
                        onChange={(val) => updateSetting('operational.lateGracePeriod', val)}
                        label="Late Pickup Grace Period"
                        description="Grace period before late fees apply"
                        min={0}
                        max={60}
                        suffix="minutes"
                    />
                    <NumberInput
                        value={settings['operational.tempThreshold']?.value}
                        onChange={(val) => updateSetting('operational.tempThreshold', val)}
                        label="Temperature Alert Threshold"
                        description="Alert when student temperature exceeds"
                        min={95}
                        max={105}
                        suffix="°F"
                    />
                </div>
            </Card>

            {/* Communication Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Bell className="text-green-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Communication Settings</h3>
                        <p className="text-sm text-slate-500">Notification and alert preferences</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <ToggleSwitch
                        enabled={settings['communication.emailEnabled']?.value}
                        onChange={() => updateSetting('communication.emailEnabled', !settings['communication.emailEnabled']?.value)}
                        label="Email Notifications"
                        description="Send notifications via email"
                    />
                    <ToggleSwitch
                        enabled={settings['communication.smsEnabled']?.value}
                        onChange={() => updateSetting('communication.smsEnabled', !settings['communication.smsEnabled']?.value)}
                        label="SMS Notifications"
                        description="Send notifications via SMS (requires SMS gateway)"
                    />
                    <SelectInput
                        value={settings['communication.notificationFrequency']?.value}
                        onChange={(val) => updateSetting('communication.notificationFrequency', val)}
                        options={[
                            { value: 'immediate', label: 'Immediate' },
                            { value: 'hourly', label: 'Hourly Digest' },
                            { value: 'daily', label: 'Daily Digest' }
                        ]}
                        label="Parent Notification Frequency"
                        description="How often to send notifications to parents"
                    />
                </div>
            </Card>

            {/* Data Management */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Database className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Data Management</h3>
                        <p className="text-sm text-slate-500">Backup, export, and retention policies</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={settings['data.autoDelete']?.value}
                        onChange={() => updateSetting('data.autoDelete', !settings['data.autoDelete']?.value)}
                        label="Auto-Delete Old Records"
                        description="Automatically remove records older than retention period"
                    />
                    <SelectInput
                        value={settings['data.retentionPeriod']?.value}
                        onChange={(val) => updateSetting('data.retentionPeriod', val)}
                        options={[
                            { value: '1yr', label: '1 Year' },
                            { value: '2yr', label: '2 Years' },
                            { value: '3yr', label: '3 Years' },
                            { value: '5yr', label: '5 Years' },
                            { value: 'indefinite', label: 'Indefinite' }
                        ]}
                        label="Data Retention Period"
                        description="How long to keep historical records"
                    />
                    <SelectInput
                        value={settings['data.exportFormat']?.value}
                        onChange={(val) => updateSetting('data.exportFormat', val)}
                        options={[
                            { value: 'csv', label: 'CSV (Comma Separated)' },
                            { value: 'json', label: 'JSON (JavaScript Object)' },
                            { value: 'pdf', label: 'PDF (Portable Document)' }
                        ]}
                        label="Default Export Format"
                        description="Preferred format for data exports"
                    />

                    <div className="pt-4 border-t border-slate-200">
                        <p className="font-semibold text-slate-700 mb-3">Export Data</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Button
                                onClick={() => exportData('students')}
                                variant="outline"
                                className="justify-center border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                            >
                                <Download size={16} className="mr-2" />
                                Export Student Data
                            </Button>
                            <Button
                                onClick={() => exportData('staff')}
                                variant="outline"
                                className="justify-center border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                                <Download size={16} className="mr-2" />
                                Export Staff Data
                            </Button>
                            <Button
                                onClick={() => exportData('billing')}
                                variant="outline"
                                className="justify-center border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            >
                                <Download size={16} className="mr-2" />
                                Export Billing Data
                            </Button>
                            <Button
                                onClick={() => exportData('logs')}
                                variant="outline"
                                className="justify-center border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                            >
                                <Download size={16} className="mr-2" />
                                Download System Logs
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Info Banner */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                    <div className="flex-1">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Changes to security and operational settings may affect user access and system behavior.
                            Please review carefully before saving.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AppSettings;
