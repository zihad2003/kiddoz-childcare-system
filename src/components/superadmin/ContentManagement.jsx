import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash, Bell, Calendar, Tag, AlertCircle, Trash2, Send, Activity, ShieldAlert, Zap, Globe } from 'lucide-react';
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
            const data = await api.get('/superadmin/bulletins');
            setBulletins(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            addToast('Failed to load bulletins', 'error');
            setBulletins([]);
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

    const getPriorityStyles = (p) => {
        switch (p) {
            case 'Critical': return 'bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-rose-100';
            case 'High': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-100';
            case 'Medium': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shadow-indigo-100';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-indigo-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-indigo-200">
                <Bell className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Syncing Bulletin Feed...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-indigo-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] italic leading-none">Global Network Communications</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-primary-600">Broadcast</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Signal Status: <span className="text-emerald-500 font-black">STABLE</span> • Reach: <span className="text-primary-600 font-black">ENTIRE GRID</span></p>
                </div>
                <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => setIsModalOpen(true)} className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl italic">
                        <Plus size={18} /> Initialize Broadcast
                    </button>
                </div>
            </div>

            {bulletins.length === 0 ? (
                <Card className="p-20 text-center border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white rounded-[4rem]">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                        <Globe size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter">Quiet Grid</h3>
                    <p className="max-w-md mx-auto font-bold text-slate-400 uppercase tracking-widest text-[10px] leading-relaxed">No active signals found in the global buffer. Initialize a new broadcast to reach the node network.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {bulletins.map(item => (
                        <Card key={item.id} className="p-0 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] bg-white relative group rounded-[3.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-700">
                            <div className="flex flex-col h-full">
                                <div className={`h-2.5 w-full bg-gradient-to-r ${item.priority === 'Critical' ? 'from-rose-500 to-rose-600' : item.priority === 'High' ? 'from-amber-400 to-amber-500' : 'from-indigo-500 to-indigo-600'}`}></div>
                                <div className="p-10 flex-1 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                                        <Bell size={120} />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
                                        <Badge color={getPriorityStyles(item.priority)} className="font-black text-[9px] uppercase tracking-[0.2em] px-4 py-2 border italic rounded-full shadow-sm">
                                            {item.priority}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] italic">
                                            <Tag size={12} className="text-indigo-500" /> {item.category}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tighter group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                    <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8 line-clamp-3 italic opacity-80">{item.content}</p>

                                    <div className="mt-auto pt-8 border-t border-slate-100/50 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
                                            <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleDelete(item.id)} className="p-4 bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-95 shadow-sm border border-slate-100/50">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Broadcast Terminal Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Initialize Identity Broadcast"
            >
                <form onSubmit={handleCreate} className="p-8 space-y-8">
                    <Input
                        label="Signal Headline"
                        placeholder="e.g. Critical Kernel Sync Postponed"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        icon={Send}
                    />
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Payload Content</label>
                        <textarea
                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-indigo-500 focus:bg-white outline-none transition-all min-h-[160px] font-bold text-slate-700 italic text-sm placeholder:text-slate-300 shadow-inner"
                            placeholder="Describe the broadcast signal in detail..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Classification Tag</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-slate-700 uppercase italic text-[11px] tracking-widest h-14 shadow-sm"
                            >
                                <option value="Announcement">Global Announce</option>
                                <option value="Maintenance">Infrastructure</option>
                                <option value="Policy">Security Policy</option>
                                <option value="Event">Network Event</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Priority Protocol</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-slate-700 uppercase italic text-[11px] tracking-widest h-14 shadow-sm"
                            >
                                <option value="Low">Low Yield</option>
                                <option value="Medium">Standard Flux</option>
                                <option value="High">Priority Node</option>
                                <option value="Critical">Critical Forge</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-16 font-black uppercase tracking-[0.25em] text-[10px] italic rounded-[1.5rem]" onClick={() => setIsModalOpen(false)}>Abort Broadcast</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-16 font-black uppercase tracking-[0.25em] text-[10px] italic rounded-[1.5rem] shadow-2xl shadow-indigo-900/20 bg-indigo-600 border-none">
                            Transmit Signal
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ContentManagement;
