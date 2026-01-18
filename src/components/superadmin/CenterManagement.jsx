import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const CenterManagement = () => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contactEmail: '',
        contactPhone: '',
        capacity: ''
    });

    useEffect(() => {
        fetchCenters();
    }, []);

    const fetchCenters = async () => {
        try {
            const data = await api.getCenters();
            setCenters(data);
        } catch (error) {
            console.error('Error fetching centers:', error);
            addToast('Failed to load centers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.addCenter(formData);
            addToast('Center created successfully!', 'success');
            setIsModalOpen(false);
            setFormData({ name: '', location: '', contactEmail: '', contactPhone: '', capacity: '' });
            fetchCenters();
        } catch (error) {
            addToast('Failed to create center', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Center Management</h2>
                    <p className="text-slate-500">Manage all facility locations</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <div className="flex items-center gap-2">
                        <Plus size={18} /> Add Center
                    </div>
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading centers...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {centers.map(center => (
                        <div key={center.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                    <Building size={24} />
                                </div>
                                <Badge color={center.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                                    {center.status}
                                </Badge>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-2">{center.name}</h3>

                            <div className="space-y-3 text-sm text-slate-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    {center.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" />
                                    {center.contactEmail || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-slate-400" />
                                    {center.contactPhone || 'N/A'}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Capacity: <span className="text-slate-800">{center.capacity}</span>
                                </span>
                                <button className="p-2 text-slate-400 hover:text-purple-600 transition">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Center"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Center Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Location / Address"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                        <Input
                            label="Phone"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                    />

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="flex-1">Create Center</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CenterManagement;
