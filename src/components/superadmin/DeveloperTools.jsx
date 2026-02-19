import React, { useState, useEffect } from 'react';
import { Key, Globe, Plus, Trash2, Copy, Check } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';

const DeveloperTools = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [webhooks, setWebhooks] = useState([]);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [keysData, hooksData] = await Promise.all([
                api.getApiKeys(),
                api.getWebhooks()
            ]);
            setApiKeys(keysData);
            setWebhooks(hooksData);
        } catch (error) {
            console.error('Error fetching developer data', error);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        try {
            const data = await api.createApiKey({ name: newKeyName, permissions: ['read', 'write'] });
            setGeneratedKey(data.key);
            fetchData();
            addToast('API Key created successfully', 'success');
        } catch (error) {
            addToast('Failed to create API key', 'error');
        }
    };

    const handleRevokeKey = async (id) => {
        if (!window.confirm('Revoke this API Key? integrations using it will stop working.')) return;
        try {
            await api.revokeApiKey(id);
            addToast('API Key revoked', 'success');
            fetchData();
        } catch (error) {
            addToast('Failed to revoke key', 'error');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        addToast('Copied to clipboard', 'success');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Developer Tools</h2>

            {/* API Keys Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Key size={20} className="text-primary-600" />
                            API Keys
                        </h3>
                        <p className="text-sm text-slate-500">Manage access tokens for third-party integrations</p>
                    </div>
                    <Button onClick={() => { setGeneratedKey(null); setIsKeyModalOpen(true); }} variant="primary" size="sm">
                        <Plus size={16} className="mr-2" /> Generate Key
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Key Prefix</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Created</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {apiKeys.map(key => (
                                <tr key={key.id}>
                                    <td className="px-6 py-4 font-medium text-slate-800">{key.name}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {key.key ? `${key.key.substring(0, 8)}...` : '••••••••'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(key.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge color={key.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                            {key.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleRevokeKey(key.id)}
                                            className="text-slate-400 hover:text-red-600 transition p-2"
                                            disabled={key.status === 'revoked'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {apiKeys.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No active API keys</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Webhooks Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Globe size={20} className="text-blue-600" />
                        Webhooks
                    </h3>
                    <p className="text-sm text-slate-500">Event subscriptions</p>
                </div>
                <div className="p-6 text-center text-slate-500 italic">
                    No webhooks configured yet.
                </div>
            </div>

            {/* Create Key Modal */}
            <Modal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} title="Generate API Key">
                {!generatedKey ? (
                    <form onSubmit={handleCreateKey} className="space-y-4">
                        <Input
                            label="Key Name"
                            placeholder="e.g. Mobile App Production"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            required
                        />
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm mb-4">
                            This key will have full <strong>read/write</strong> access to the KiddoZ API.
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setIsKeyModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary">Generate</Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Check size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">API Key Generated</h3>
                            <p className="text-sm text-slate-500">Copy this key now. You won't see it again.</p>
                        </div>

                        <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between border border-slate-200">
                            <code className="text-primary-700 font-mono font-bold text-sm break-all">{generatedKey}</code>
                            <button onClick={() => copyToClipboard(generatedKey)} className="text-slate-500 hover:text-primary-600">
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>

                        <Button className="w-full mt-4" onClick={() => setIsKeyModalOpen(false)}>Done</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DeveloperTools;
