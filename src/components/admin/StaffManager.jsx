import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Filter, X, Save, User, Phone, Mail, Star, Award } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { staffService } from '../../services/staffService';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../ui/Skeleton';

const StaffManager = () => {
    const { addToast } = useToast();
    const [staff, setStaff] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        setLoading(true);
        const unsubscribe = staffService.subscribeToStaff((data) => {
            setStaff(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        role: 'Nanny',
        rate: '',
        experience: '',
        area: '',
        specialty: '',
        availability: 'Available Now',
        img: ''
    });

    const openAddModal = () => {
        setFormData({
            fullName: '',
            role: 'Nanny',
            rate: '',
            experience: '',
            area: '',
            specialty: '',
            availability: 'Available Now',
            img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        });
        setCurrentStaff(null);
        setIsEditing(true);
    };

    const openEditModal = (member) => {
        setFormData(member);
        setCurrentStaff(member);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            try {
                const result = await staffService.deleteStaff(id);
                if (result.success) {
                    addToast('Staff member removed.', 'success');
                } else {
                    addToast(result.error, 'error');
                }
            } catch (err) {
                console.error(err);
                addToast('Failed to delete staff', 'error');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (currentStaff) {
                const result = await staffService.updateStaff(currentStaff.id, formData);
                if (result.success) {
                    addToast('Staff profile updated!', 'success');
                } else {
                    addToast(result.error, 'error');
                }
            } else {
                const result = await staffService.addStaff(formData);
                if (result.success) {
                    addToast('Staff member added!', 'success');
                } else {
                    addToast(result.error, 'error');
                }
            }
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            addToast('Failed to save staff member', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter and Search Logic
    const filteredStaff = staff.filter(member => {
        const matchesSearch = (member.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.specialty && member.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = filterRole === 'All' || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Staff Management</h2>
                    <p className="text-slate-500">Manage all staff: Nannies, Teachers, and Nurses.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={20} className="mr-2" /> Add Staff Member
                    </Button>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name or Specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter size={18} className="text-slate-500" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-purple-200 bg-slate-50"
                    >
                        <option value="All">All Roles</option>
                        <option value="Nanny">Home Nanny</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Nurse">School Nurse</option>
                    </select>
                </div>
            </div>

            {/* List View */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div className="flex gap-4">
                                <Skeleton variant="circular" width="64px" height="64px" />
                                <div className="flex-1 space-y-2 pt-2">
                                    <Skeleton width="60%" height="20px" />
                                    <Skeleton width="40%" height="16px" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-slate-50">
                                <Skeleton width="100%" height="16px" />
                                <Skeleton width="100%" height="16px" />
                                <Skeleton width="70%" height="16px" />
                            </div>
                        </div>
                    ))
                ) : filteredStaff.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-400">
                        No staff members found matching your criteria.
                    </div>
                ) : (
                    filteredStaff.map(member => (
                        <Card key={member.id} className="relative group hover:shadow-lg transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => openEditModal(member)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(member.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600"><Trash2 size={16} /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <img src={member.img} alt={member.fullName} className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-50" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{member.fullName}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${member.role === 'Nurse' ? 'bg-teal-100 text-teal-700' :
                                        (member.role === 'Teacher' ? 'bg-orange-100 text-orange-700' : 'bg-pink-100 text-pink-700')
                                        }`}>
                                        {member.role || 'Nanny'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 border-t border-slate-50 pt-4">
                                <p className="text-slate-500 italic text-xs mb-2 line-clamp-2">{member.specialty}</p>

                                <div className="flex justify-between">
                                    <span>Area:</span>
                                    <span className="font-semibold">{member.area || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rate/Salary:</span>
                                    <span className="font-semibold">${member.rate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Experience:</span>
                                    <span className="font-semibold">{member.experience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-semibold text-green-600">{member.availability}</span>
                                </div>
                            </div>
                        </Card>
                    )))}
            </div>

            {/* Edit/Add Modal Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <Card className="w-full max-w-lg relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <XCircle size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-6">{currentStaff ? 'Edit Staff Profile' : 'Add New Staff Member'}</h2>

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
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Role"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    options={[
                                        { label: 'Home Nanny', value: 'Nanny' },
                                        { label: 'Teacher', value: 'Teacher' },
                                        { label: 'School Nurse', value: 'Nurse' }
                                    ]}
                                />
                                <Input
                                    label={formData.role === 'Nanny' ? "Rate ($/hr)" : "Salary ($/mo)"}
                                    type="number"
                                    value={formData.rate}
                                    onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Experience"
                                    value={formData.experience}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="e.g. 5 Years"
                                    required
                                />
                                <Input
                                    label="Area/Location"
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    placeholder="e.g. Gulshan"
                                    required
                                />
                            </div>

                            <Input
                                label="Specialty / Bio (Visible to Parents)"
                                value={formData.specialty}
                                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                placeholder="e.g. Certified in CPR, loves arts & crafts..."
                            />

                            <Input
                                label="Availability Status"
                                value={formData.availability}
                                onChange={e => setFormData({ ...formData, availability: e.target.value })}
                                placeholder="Available Now"
                            />

                            <Button className="w-full mt-4" size="lg">{currentStaff ? 'Save Changes' : 'Create Profile'}</Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default StaffManager;
