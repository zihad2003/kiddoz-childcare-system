import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Trash2, ShieldOff, CheckCircle, Mail, Phone, MapPin, Plus, Edit2, UserPlus, Info, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

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
            password: '' // Keep empty for edits unless specifically changing
        });
        setIsModalOpen(true);
    };

    const roleColors = {
        superadmin: 'bg-purple-100 text-purple-700',
        admin: 'bg-blue-100 text-blue-700',
        parent: 'bg-emerald-100 text-emerald-700',
        teacher: 'bg-orange-100 text-orange-700',
        nurse: 'bg-pink-100 text-pink-700',
        nanny: 'bg-indigo-100 text-indigo-700',
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge color="bg-emerald-50 text-emerald-700 border-emerald-100"><div className="flex items-center gap-1.5"><ShieldCheck size={12} /> ACTIVE</div></Badge>;
            case 'suspended':
                return <Badge color="bg-red-50 text-red-700 border-red-100"><div className="flex items-center gap-1.5"><XCircle size={12} /> SUSPENDED</div></Badge>;
            default:
                return <Badge color="bg-amber-50 text-amber-700 border-amber-100"><div className="flex items-center gap-1.5"><AlertTriangle size={12} /> PENDING</div></Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">Identity Matrix</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Platform Access & Governance</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="primary" onClick={() => { setEditingUser(null); setFormData({ fullName: '', email: '', role: 'parent', phone: '', status: 'active', password: '' }); setIsModalOpen(true); }} className="whitespace-nowrap shadow-xl shadow-purple-100 group">
                        <UserPlus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Register New Identity
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, email, or credentials..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-none bg-slate-50 font-medium"
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select
                        icon={Filter}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[
                            { value: 'All', label: 'All Roles' },
                            { value: 'superadmin', label: 'Super Admin' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'parent', label: 'Parent' },
                            { value: 'teacher', label: 'Teacher' },
                            { value: 'nanny', label: 'Nanny' },
                        ]}
                        className="border-none bg-slate-50 font-black italic text-xs uppercase"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900/5 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Identity</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Comm-Link</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Synchronizing Identities...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest">No matching records found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition border-l-4 border-transparent hover:border-purple-500">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden group">
                                                    <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt={user.fullName} className="group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 italic leading-tight">{user.fullName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">ID: {user.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <Badge color={roleColors[user.role] || 'bg-slate-100 text-slate-700'}>
                                                <span className="font-black uppercase tracking-widest text-[9px]">{user.role}</span>
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-xs font-bold text-slate-600 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-slate-300" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={12} className="text-slate-300" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            {statusBadge(user.status || 'active')}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition shadow-sm"
                                                    title="Modify Record"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(user)}
                                                    className={`p-2.5 rounded-xl transition shadow-sm ${user.status === 'suspended' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                    title={user.status === 'suspended' ? 'Activate User' : 'Suspend Access'}
                                                >
                                                    {user.status === 'suspended' ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition shadow-sm"
                                                    title="Purge Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-slate-900/5 text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center border-t border-slate-100">
                    <span className="italic">Matrix Capacity: {users.length} Active Signatures</span>
                    <div className="flex gap-3">
                        <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition shadow-sm disabled:opacity-30" disabled>Rel previous</button>
                        <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition shadow-sm">Rel next</button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Modify Identity Credentials" : "Initialize New Platform Signature"}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Identity Name"
                            placeholder="John R. Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                        <Input
                            label="Comm-Link (Email)"
                            type="email"
                            placeholder="identity@kiddoz.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                Role Classification <Info size={12} className="text-purple-400" />
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all font-black text-slate-700 uppercase text-xs tracking-widest"
                            >
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Center Admin</option>
                                <option value="parent">Parent</option>
                                <option value="teacher">Teacher</option>
                                <option value="nanny">Specialized Nanny</option>
                            </select>
                        </div>
                        <Input
                            label="Encrypted Access Key (Password)"
                            type="password"
                            placeholder={editingUser ? "Keep blank to retain current" : "Min 8 characters"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editingUser}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Secure Voice Line"
                            placeholder="+8801..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                Operational Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all font-black text-slate-700 uppercase text-xs tracking-widest"
                            >
                                <option value="active">Active Access</option>
                                <option value="suspended">Access Revoked</option>
                                <option value="pending">Verification Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-14 font-black uppercase tracking-widest text-xs" onClick={() => setIsModalOpen(false)}>Abort Protocol</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-100">
                            {editingUser ? "Overwrite Signature" : "Upload Identity"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;

