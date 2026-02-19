import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, UserCheck, Plus, Edit2, Trash2, Building, Briefcase, Star, MapPin } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Card from '../ui/Card';

const StaffDirectory = () => {
    const [staff, setStaff] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        role: 'Teacher',
        centerId: '',
        phone: '',
        availability: 'Available Now'
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [staffData, centerData] = await Promise.all([
                api.get('/superadmin/staff/all'),
                api.getCenters()
            ]);
            setStaff(Array.isArray(staffData) ? staffData : []);
            setCenters(Array.isArray(centerData) ? centerData : []);
            setLoading(false);
        } catch (error) {
            addToast('Failed to load staff data', 'error');
            setStaff([]);
            setCenters([]);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                await api.put(`/superadmin/staff/${editingStaff.id}`, formData);
                addToast('Staff updated successfully', 'success');
            } else {
                await api.post('/superadmin/staff', { ...formData, id: `ST-${Math.floor(Math.random() * 900) + 100}` });
                addToast('Staff added successfully', 'success');
            }
            setIsModalOpen(false);
            setEditingStaff(null);
            fetchInitialData();
        } catch (error) {
            addToast('Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            try {
                await api.delete(`/superadmin/staff/${id}`);
                addToast('Staff removed', 'success');
                fetchInitialData();
            } catch (error) {
                addToast('Deletion failed', 'error');
            }
        }
    };

    const filteredStaff = staff.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.role?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Governance</h2>
                    <p className="text-slate-500 mt-1">Manage global human resources across all centers</p>
                </div>
                <Button variant="primary" onClick={() => { setEditingStaff(null); setFormData({ name: '', role: 'Teacher', centerId: '', phone: '', availability: 'Available Now' }); setIsModalOpen(true); }} className="shadow-lg shadow-primary-100">
                    <Plus size={20} className="mr-2" /> <span className="font-bold">Register New Staff</span>
                </Button>
            </div>

            <Card className="p-4 border-none shadow-xl bg-white">
                <Input
                    placeholder="Filter by name, role, or specialty..."
                    icon={Search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none bg-slate-50 focus:ring-primary-500"
                />
            </Card>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-medium">Synchronizing staff registry...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStaff.map(member => (
                        <Card key={member.id} className="p-0 border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500">
                                            <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random&bold=true`} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-lg shadow-lg">
                                            <UserCheck size={14} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge color="bg-primary-100 text-primary-700" className="font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                                            {member.role}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-secondary-400">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-black">{member.rating ? member.rating.toFixed(1) : '5.0'}</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="font-black text-xl text-slate-900 mb-1 truncate">{member.name}</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Building size={14} className="text-slate-300" />
                                    {centers.find(c => c.id === member.centerId)?.name || 'General Platform'}
                                </p>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Briefcase size={14} /></div>
                                        <span>{member.experience || '3+ Years'} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                        <span>{member.availability || 'Available'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => { setEditingStaff(member); setFormData({ ...member }); setIsModalOpen(true); }}
                                        className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs hover:bg-primary-50 hover:text-primary-600 transition tracking-widest uppercase border border-slate-100"
                                    >
                                        Modify Profile
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition border border-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStaff ? "Edit Staff Credentials" : "Register New Personnel"}
            >
                <form onSubmit={handleSave} className="space-y-6 p-2">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-6">
                        <Select
                            label="Professional Role"
                            options={[
                                { value: 'Teacher', label: 'Teacher' },
                                { value: 'Nurse', label: 'Nurse' },
                                { value: 'Nanny', label: 'Nanny' },
                                { value: 'Admin', label: 'Admin' }
                            ]}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                        <Select
                            label="Assigned Center"
                            options={centers.map(c => ({ value: c.id, label: c.name }))}
                            value={formData.centerId}
                            onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Contact Phone"
                        placeholder="+8801..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <div className="pt-6 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-12 font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-12 font-bold shadow-lg shadow-primary-100">
                            {editingStaff ? "Update Record" : "Finalize Registration"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StaffDirectory;

