import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Users, Mail, Phone, Plus, Edit2, Trash2, Search, Loader2, XCircle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';

const ParentManager = () => {
    const { addToast } = useToast();
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentParent, setCurrentParent] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        setLoading(true);
        const unsubscribe = parentService.subscribeToParents((data) => {
            setParents(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const openAddModal = () => {
        setFormData({ fullName: '', email: '', phone: '', address: '' });
        setCurrentParent(null);
        setIsEditing(true);
    };

    const openEditModal = (parent) => {
        setFormData(parent);
        setCurrentParent(parent);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this parent?')) {
            const result = await parentService.deleteParent(id);
            if (result.success) {
                addToast('Parent removed.', 'success');
            } else {
                addToast(result.error, 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let result;
        if (currentParent) {
            result = await parentService.updateParent(currentParent.id, formData);
        } else {
            result = await parentService.addParent(formData);
        }

        if (result.success) {
            addToast(`Parent ${currentParent ? 'updated' : 'added'} successfully!`, 'success');
            setIsEditing(false);
        } else {
            addToast(result.error, 'error');
        }
        setIsSubmitting(false);
    };

    const filteredParents = parents.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search parents by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                </div>
                <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
                    <Plus size={18} className="mr-2" /> Add Parent
                </Button>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <Skeleton width="60%" height="24px" />
                            <div className="space-y-2">
                                <Skeleton width="80%" height="16px" />
                                <Skeleton width="50%" height="16px" />
                            </div>
                            <Skeleton width="100%" height="40px" className="mt-4" />
                        </div>
                    ))}
                </div>
            ) : filteredParents.length === 0 ? (
                <Card className="text-center py-20 border-2 border-dashed border-slate-100">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No parents found.</p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredParents.map(parent => (
                        <Card key={parent.id} className="relative group hover:shadow-lg transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(parent)} className="p-2 text-slate-400 hover:text-purple-600 transition"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(parent.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-4">{parent.fullName}</h3>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {parent.email}</div>
                                <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {parent.phone}</div>
                                {parent.address && <div className="mt-2 text-xs text-slate-400 border-t pt-2">{parent.address}</div>}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md relative animate-in zoom-in duration-300">
                        <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"><XCircle size={24} /></button>
                        <h2 className="text-xl font-bold mb-6">{currentParent ? 'Edit Parent' : 'Add New Parent'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone Number"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Home Address</label>
                                <textarea
                                    value={formData.address || ''}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition h-20"
                                />
                            </div>
                            <Button type="submit" isLoading={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700">
                                {currentParent ? 'Update Profile' : 'Save Parent'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ParentManager;
