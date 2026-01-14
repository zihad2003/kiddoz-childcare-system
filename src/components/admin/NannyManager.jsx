import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_NANNIES } from '../../data/mockData';
import { UserCheck, Star, Trash2, Edit2, Plus, CheckCircle, XCircle } from 'lucide-react';

const NannyManager = () => {
    // Local state to simulate database for Demo purposes
    const [nannies, setNannies] = useState(MOCK_NANNIES);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNanny, setCurrentNanny] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        rate: '',
        experience: '',
        area: '',
        specialty: '',
        availability: 'Available Now',
        img: ''
    });

    const openAddModal = () => {
        setFormData({
            name: '',
            rate: '',
            experience: '',
            area: '',
            specialty: '',
            availability: 'Available Now',
            img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        });
        setCurrentNanny(null);
        setIsEditing(true);
    };

    const openEditModal = (nanny) => {
        setFormData(nanny);
        setCurrentNanny(nanny);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this nanny?')) {
            setNannies(val => val.filter(n => n.id !== id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (currentNanny) {
            // Edit Mode
            setNannies(val => val.map(n => n.id === currentNanny.id ? { ...formData, id: currentNanny.id } : n));
        } else {
            // Add Mode
            const newNanny = {
                ...formData,
                id: `n-${Date.now()}`,
                rating: 5.0,
                reviews: 0
            };
            setNannies(val => [...val, newNanny]);
        }
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Nanny Management</h2>
                    <p className="text-slate-500">Add, edit, or remove nanny profiles</p>
                </div>
                <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
                    <Plus size={20} className="mr-2" /> Add New Nanny
                </Button>
            </div>

            {/* List View */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nannies.map(nanny => (
                    <Card key={nanny.id} className="relative group hover:shadow-lg transition-all">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(nanny)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(nanny.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600"><Trash2 size={16} /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <img src={nanny.img} alt={nanny.name} className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-50" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{nanny.name}</h3>
                                <p className="text-xs text-slate-500">{nanny.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 border-t border-slate-50 pt-4">
                            <div className="flex justify-between">
                                <span>Area:</span>
                                <span className="font-semibold">{nanny.area}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rate:</span>
                                <span className="font-semibold">${nanny.rate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Experience:</span>
                                <span className="font-semibold">{nanny.experience}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-semibold text-green-600">{nanny.availability}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Edit/Add Modal Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <Card className="w-full max-w-lg relative animate-in zoom-in duration-300">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <XCircle size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-6">{currentNanny ? 'Edit Nanny Profile' : 'Add New Nanny'}</h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group cursor-pointer" title="Click to regenerate random avatar">
                                    <img src={formData.img} alt="Avatar" className="w-24 h-24 rounded-full bg-slate-100 mx-auto" />
                                    <div
                                        onClick={() => setFormData({ ...formData, img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                                    >
                                        Change
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Rate ($/hr)"
                                    type="number"
                                    value={formData.rate}
                                    onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Experience (e.g. 5 Years)"
                                    value={formData.experience}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Area (e.g. Gulshan)"
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Specialty"
                                    value={formData.specialty}
                                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    placeholder="e.g. Infant Care"
                                />
                            </div>

                            <Input
                                label="Availability Status"
                                value={formData.availability}
                                onChange={e => setFormData({ ...formData, availability: e.target.value })}
                            />

                            <Button className="w-full mt-4" size="lg">{currentNanny ? 'Save Changes' : 'Create Profile'}</Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default NannyManager;
