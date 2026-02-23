import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Trash2, ShieldOff, CheckCircle, Mail, Phone, MapPin, Plus, Edit2, UserPlus, Info, ShieldCheck, XCircle, AlertTriangle, Shield, Fingerprint, Activity, Zap } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';
import Card from '../ui/Card';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { addToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'parent',
        phone: '',
        status: 'active',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                role: roleFilter
            };
            const data = await api.getAllUsers(params);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            addToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.updateUser(editingUser.id, formData);
                addToast('User updated successfully!', 'success');
            } else {
                await api.addUser(formData);
                addToast('User registered successfully!', 'success');
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ fullName: '', email: '', role: 'parent', phone: '', status: 'active', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Update/Add User Error:', error);
            addToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently remove this user? This action cannot be undone.')) return;
        try {
            await api.deleteUser(userId);
            addToast('User deleted successfully', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Delete User Error:', error);
            addToast(error.response?.data?.message || 'Failed to delete user', 'error');
        }
    };

    const toggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        try {
            await api.updateUser(user.id, { status: newStatus });
            addToast(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`, 'success');
            fetchUsers();
        } catch (error) {
            console.error('Toggle Status Error:', error);
            addToast('Failed to change status', 'error');
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            status: user.status || 'active',
            password: ''
        });
        setIsModalOpen(true);
    };

    const roleColors = {
        superadmin: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
        admin: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        parent: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        teacher: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        nurse: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        nanny: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge color="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" className="font-black italic px-3 py-1"><div className="flex items-center gap-1.5"><ShieldCheck size={10} /> ACTIVE</div></Badge>;
            case 'suspended':
                return <Badge color="bg-rose-500/10 text-rose-600 border-rose-500/20" className="font-black italic px-3 py-1"><div className="flex items-center gap-1.5"><XCircle size={10} /> REVOKED</div></Badge>;
            default:
                return <Badge color="bg-amber-500/10 text-amber-600 border-amber-500/20" className="font-black italic px-3 py-1"><div className="flex items-center gap-1.5"><AlertTriangle size={10} /> PENDING</div></Badge>;
        }
    };

    if (loading && users.length === 0) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Authenticating Identity Grid...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Global Identity Governance</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Identity <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Matrix</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Registered Signatures: <span className="text-emerald-500 font-black">{users.length}</span> • Protection Status: <span className="text-primary-600 font-black">ENCRYPTED</span></p>
                </div>
                <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => { setEditingUser(null); setFormData({ fullName: '', email: '', role: 'parent', phone: '', status: 'active', password: '' }); setIsModalOpen(true); }} className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl">
                        <UserPlus size={18} /> Initialize Enrollment
                    </button>
                </div>
            </div>

            {/* Sub-Header / Filters */}
            <Card className="p-8 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 relative w-full">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, identity, or digital footprint..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:border-primary-500 focus:shadow-xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 italic"
                    />
                </div>
                <div className="w-full md:w-80 relative">
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        icon={Filter}
                        options={[
                            { value: 'All', label: 'All Classifications' },
                            { value: 'superadmin', label: 'Super Admin' },
                            { value: 'admin', label: 'Center Admin' },
                            { value: 'parent', label: 'Parent Node' },
                            { value: 'teacher', label: 'Operational Staff' },
                            { value: 'nanny', label: 'Specialized Nanny' }
                        ]}
                        className="border-none"
                    />
                </div>
            </Card>

            {/* User List Matrix */}
            <Card className="p-0 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative overflow-hidden group rounded-[3.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Digital Identity</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Classification</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Comm-Link Status</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Operational Mode</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic text-right">Kernel Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-all duration-300 group/row select-none">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-[1.25rem] bg-white border-2 border-slate-100 shadow-md group-hover/row:scale-110 group-hover/row:rotate-3 transition-all duration-500 overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random&bold=true`} alt={user.fullName} />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 italic tracking-tighter text-lg leading-none mb-1 group-hover/row:text-primary-600 transition-colors">{user.fullName}</p>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">SIGNATURE: {user.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge color={roleColors[user.role] || 'bg-slate-100 text-slate-500'} className="px-4 py-1.5 font-black uppercase tracking-widest text-[9px] border italic rounded-full shadow-sm">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                                <Mail size={12} className="text-slate-300" />
                                                <span className="group-hover/row:translate-x-1 transition-transform">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                    <Phone size={11} className="text-slate-300" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {statusBadge(user.status || 'active')}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-40 group-hover/row:opacity-100 transition-all duration-500">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-3.5 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:shadow-xl rounded-2xl transition-all active:scale-90"
                                                title="Override Credentials"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(user)}
                                                className={`p-3.5 border rounded-2xl transition-all active:scale-90 shadow-sm ${user.status === 'suspended' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                                                title={user.status === 'suspended' ? 'Restore Pulse' : 'Kill Switch'}
                                            >
                                                {user.status === 'suspended' ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-3.5 bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-200 hover:shadow-xl rounded-2xl transition-all active:scale-90"
                                                title="Purge Identity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Forge */}
                <div className="px-10 py-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Activity size={18} className="text-primary-500 animate-pulse" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">Matrix Feed Status</p>
                            <p className="text-sm font-black text-slate-900 italic tracking-tighter">Synchronized with Identity Hub</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm active:scale-95 disabled:opacity-20" disabled>Rel previous</button>
                        <button className="px-8 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm active:scale-95">Rel next</button>
                    </div>
                </div>
            </Card>

            {/* Enrollment Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Modify Identity Vector" : "Initialize New Platform Signature"}
            >
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Legal Identification"
                            placeholder="John R. Ghost"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            icon={Fingerprint}
                        />
                        <Input
                            label="Digital Comm-Link"
                            type="email"
                            placeholder="identity@net.local"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            icon={Mail}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Select
                            label="Role Classification"
                            icon={Zap}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            options={[
                                { value: 'superadmin', label: 'HIGH ADMIN' },
                                { value: 'admin', label: 'NODE ADMIN' },
                                { value: 'parent', label: 'PARENT IDENTITY' },
                                { value: 'teacher', label: 'FIELD OPS' },
                                { value: 'nurse', label: 'BIO STAFF' },
                                { value: 'nanny', label: 'SUPPORT NODE' }
                            ]}
                        />
                        <Input
                            label="Binary Key (Password)"
                            type="password"
                            placeholder={editingUser ? "UNMODIFIED" : "MIN 8 BYTES"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editingUser}
                            icon={Zap}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Voice Transmission Node"
                            placeholder="+880.INT..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            icon={Phone}
                        />
                        <Select
                            label="Access Protocol Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'active', label: 'Operational Access' },
                                { value: 'suspended', label: 'Revoke Pulses' },
                                { value: 'pending', label: 'Idle Stage' }
                            ]}
                        />
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-16 font-black uppercase tracking-[0.25em] text-[10px] italic rounded-[1.5rem]" onClick={() => setIsModalOpen(false)}>Terminate Protocol</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-16 font-black uppercase tracking-[0.25em] text-[10px] italic rounded-[1.5rem] shadow-2xl shadow-primary-900/20">
                            {editingUser ? "Sync Override" : "Finalize Enrollment"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
