import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash, Bell, Calendar, Tag, AlertCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const ContentManagement = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Announcement',
        priority: 'Medium'
    });

    useEffect(() => {
        fetchBulletins();
    }, []);

    const fetchBulletins = async () => {
        try {
            const data = await api.get('/superadmin/bulletins').then(res => res.data);
            setBulletins(data);
            setLoading(false);
        } catch (error) {
            addToast('Failed to load bulletins', 'error');
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/superadmin/bulletins', formData);
            addToast('Announcement published successfully', 'success');
            setIsModalOpen(false);
            setFormData({ title: '', content: '', category: 'Announcement', priority: 'Medium' });
            fetchBulletins();
        } catch (error) {
            addToast('Failed to publish', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this announcement?')) {
            try {
                await api.delete(`/superadmin/bulletins/${id}`);
                addToast('Announcement removed', 'success');
                fetchBulletins();
            } catch (error) {
                addToast('Failed to delete', 'error');
            }
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Critical': return 'bg-red-100 text-red-700';
            case 'High': return 'bg-orange-100 text-orange-700';
            case 'Medium': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Content</h2>
                    <p className="text-slate-500 mt-1">Manage global announcements and bulletin board notices</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-purple-100">
                    <Plus size={20} className="mr-2" /> <span className="font-bold">New Announcement</span>
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-medium">Syncing bulletin board...</p>
                </div>
            ) : bulletins.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl border-none overflow-hidden">
                    <div className="p-20 text-center text-slate-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">The Board is Empty</h3>
                        <p className="max-w-md mx-auto font-medium text-slate-400">Share your first announcement with the KiddoZ community by clicking the button above.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bulletins.map(item => (
                        <Card key={item.id} className="p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                            <div className="flex flex-col h-full">
                                <div className={`h-2 ${item.priority === 'Critical' ? 'bg-red-500' : item.priority === 'High' ? 'bg-orange-500' : 'bg-purple-500'}`}></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <Badge color={getPriorityColor(item.priority)} className="font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5">
                                            {item.priority}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Tag size={10} /> {item.category}
                                        </div>
                                        {item.status === 'Draft' && (
                                            <Badge color="bg-slate-100 text-slate-500" className="text-[8px] uppercase tracking-widest px-2 py-0.5 ml-auto">Draft</Badge>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">{item.content}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-330 uppercase tracking-widest">
                                            <Calendar size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Compose Announcement"
            >
                <form onSubmit={handleCreate} className="space-y-6 p-2">
                    <Input
                        label="Headline"
                        placeholder="e.g. System Maintenance This Weekend"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Description</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all min-h-[120px] font-medium text-slate-700"
                            placeholder="Provide detailed information..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Select
                            label="Classification"
                            options={[
                                { value: 'Announcement', label: 'Announcement' },
                                { value: 'Maintenance', label: 'Maintenance' },
                                { value: 'Policy', label: 'Policy' },
                                { value: 'Event', label: 'Event' }
                            ]}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <Select
                            label="Priority Level"
                            options={[
                                { value: 'Low', label: 'Low' },
                                { value: 'Medium', label: 'Medium' },
                                { value: 'High', label: 'High' },
                                { value: 'Critical', label: 'Critical' }
                            ]}
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-12 font-bold" onClick={() => setIsModalOpen(false)}>Discard</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-12 font-bold shadow-lg shadow-purple-100">Broadcast Now</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ContentManagement;

