import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail, Plus, Edit2, Users, Briefcase, DollarSign, TrendingUp, MoreVertical, Trash2, Info, ArrowRight, UserCheck, ShieldCheck, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const CenterManagement = () => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [viewingCenter, setViewingCenter] = useState(null);
    const [editingCenter, setEditingCenter] = useState(null);
    const { addToast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contactEmail: '',
        contactPhone: '',
        capacity: '',
        status: 'active'
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCenter) {
                await api.updateCenter(editingCenter.id, formData);
                addToast('Center updated successfully!', 'success');
            } else {
                await api.addCenter(formData);
                addToast('Center created successfully!', 'success');
            }
            setIsModalOpen(false);
            setEditingCenter(null);
            setFormData({ name: '', location: '', contactEmail: '', contactPhone: '', capacity: '', status: 'active' });
            fetchCenters();
        } catch (error) {
            console.error('Update/Add Center Error:', error);
            addToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this facility? This action cannot be undone if there are no linked records.')) return;
        try {
            await api.deleteCenter(id);
            addToast('Center removed successfully', 'success');
            fetchCenters();
        } catch (error) {
            console.error('Delete Center Error:', error);
            addToast(error.response?.data?.message || 'Failed to delete center', 'error');
        }
    };

    const openEditModal = (center) => {
        setEditingCenter(center);
        setFormData({
            name: center.name,
            location: center.location,
            contactEmail: center.contactEmail || '',
            contactPhone: center.contactPhone || '',
            capacity: center.capacity,
            status: center.status
        });
        setIsModalOpen(true);
    };

    const openDetailView = async (center) => {
        try {
            const details = await api.getCenterDetails(center.id);
            setViewingCenter(details);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Failed to load center details:', error);
            addToast('Intelligence Scan failed. Relink nodes and retry.', 'error');
        }
    };

    const COLORS = ['#6968A6', '#e2e8f0'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ... header and loading state same ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none italic uppercase">Facility Matrix</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Global oversight & tactical management of childcare nodes</p>
                </div>
                <Button variant="primary" onClick={() => { setEditingCenter(null); setFormData({ name: '', location: '', contactEmail: '', contactPhone: '', capacity: '', status: 'active' }); setIsModalOpen(true); }} className="shadow-2xl shadow-primary-200 px-8 py-6 rounded-2xl group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-600 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="relative flex items-center gap-3">
                        <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="font-black tracking-widest uppercase text-xs">Initialize Node</span>
                    </div>
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Synchronizing facility matrix...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {centers.map(center => {
                        const occupancyData = [
                            { name: 'Occupied', value: center.studentCount },
                            { name: 'Available', value: Math.max(0, center.capacity - center.studentCount) }
                        ];

                        return (
                            <Card key={center.id} className="overflow-hidden border-none shadow-2xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group rounded-[2.5rem] bg-white">
                                <div className="p-0 flex flex-col md:flex-row">
                                    {/* Left Side: Center Info */}
                                    <div className="p-10 flex-1 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <Building size={120} />
                                        </div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-500">
                                                <Building size={28} />
                                            </div>
                                            <Badge color={center.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'} className="px-4 py-1.5 font-black rounded-full uppercase text-[9px] tracking-[0.15em] shadow-sm">
                                                {center.status}
                                            </Badge>
                                        </div>

                                        <h3 className="font-black text-3xl text-slate-900 mb-2 truncate italic group-hover:text-primary-600 transition-colors tracking-tight">{center.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 mb-8 text-[11px] font-black uppercase tracking-widest">
                                            <MapPin size={14} className="text-primary-500" />
                                            {center.location}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            <div className="bg-slate-50 rounded-[2rem] p-6 flex flex-col items-start gap-1 border-2 border-transparent hover:border-primary-100 transition-all cursor-default">
                                                <div className="p-2.5 bg-white text-primary-600 rounded-2xl shadow-sm mb-2"><Users size={18} /></div>
                                                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">Students</p>
                                                <p className="text-2xl font-black text-slate-900 leading-none">{center.studentCount}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-[2rem] p-6 flex flex-col items-start gap-1 border-2 border-transparent hover:border-emerald-100 transition-all cursor-default">
                                                <div className="p-2.5 bg-white text-emerald-600 rounded-2xl shadow-sm mb-2"><Briefcase size={18} /></div>
                                                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">Personnel</p>
                                                <p className="text-2xl font-black text-slate-900 leading-none">{center.staffCount}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openDetailView(center)}
                                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all tracking-[0.2em] uppercase shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group/btn"
                                        >
                                            <Activity size={16} className="text-primary-400 group-hover/btn:animate-pulse" /> Intelligence Scan
                                        </button>
                                    </div>

                                    {/* Right Side: Visual Analytics */}
                                    <div className="md:w-64 bg-slate-50/30 p-8 flex flex-col items-center justify-center border-l border-slate-100 backdrop-blur-sm">
                                        <div className="w-full h-44 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={occupancyData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={70}
                                                        paddingAngle={8}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {occupancyData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'black' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
                                                <span className="text-3xl font-black text-slate-900 leading-none">{center.occupancy}%</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Utilized</span>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-4 mt-6">
                                            <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none px-1">
                                                <span>Capacity Limit</span>
                                                <span className="text-slate-900">{center.capacity} PAX</span>
                                            </div>
                                            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000"
                                                    style={{ width: `${center.occupancy}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex gap-3 w-full">
                                            <button
                                                onClick={() => openEditModal(center)}
                                                className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1"
                                            >
                                                <Edit2 size={12} /> Mod
                                            </button>
                                            <button
                                                onClick={() => handleDelete(center.id)}
                                                className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm hover:-translate-y-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ... Modal for Create/Edit same ... */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCenter ? "Modify Facility Credentials" : "Initialize New Strategic Node"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Facility Designation" placeholder="e.g. KiddoZ Mirpur" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Deployment Coordinates" placeholder="Street, Area, City" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Comm-Link Email" type="email" placeholder="admin@center.com" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                        <Input label="Secure Voice Line" placeholder="+8801..." value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Payload Capacity" type="number" placeholder="Max Students" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Operational Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition-all font-black text-slate-700 uppercase italic text-xs"
                            >
                                <option value="active">Active Service</option>
                                <option value="inactive">Node Offline</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-6 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-14 font-black uppercase tracking-widest text-xs" onClick={() => setIsModalOpen(false)}>Abort</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-14 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary-100">
                            {editingCenter ? "Confirm Modification" : "Initialize Node"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Detail View Modal Overhaul */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={viewingCenter ? `${viewingCenter.name} Intelligence Scan` : 'Intelligence Scan'}
                maxWidth="max-w-6xl"
            >
                {viewingCenter && (
                    <div className="space-y-12 pb-8">
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Enrollment', val: viewingCenter.studentCount, icon: Users, color: 'text-primary-500', bg: 'bg-primary-50' },
                                { label: 'Personnel', val: viewingCenter.staffCount, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'Capacity', val: viewingCenter.capacity, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Profitability', val: `৳${viewingCenter.revenue?.toLocaleString()}`, icon: DollarSign, color: 'text-primary-500', bg: 'bg-primary-50' }
                            ].map((stat, i) => (
                                <Card key={i} className="p-8 border-none bg-white shadow-xl flex flex-col items-center text-center group hover:scale-105 transition-transform">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-3xl mb-4 shadow-sm group-hover:rotate-12 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.val}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{stat.label}</p>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Analytics Col */}
                            <div className="lg:col-span-2 space-y-10">
                                <Card className="p-10 border-none shadow-2xl bg-white rounded-[3rem]">
                                    <div className="flex justify-between items-center mb-10">
                                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-3 italic">
                                            <TrendingUp size={16} className="text-primary-600" /> Facility Load Velocity
                                        </h4>
                                        <Badge color="bg-primary-100 text-primary-700 font-black">+12.4% vs Last Month</Badge>
                                    </div>
                                    <div className="w-full h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={viewingCenter.occupancyTrend}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                                                <Bar dataKey="value" fill="#6968A6" radius={[10, 10, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <Card className="p-8 border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={100} /></div>
                                        <h5 className="font-black uppercase tracking-widest text-[10px] text-primary-400 mb-6 italic">Personnel Deployment</h5>
                                        <div className="space-y-4">
                                            {(viewingCenter.staff || []).slice(0, 3).map((s, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full border-2 border-primary-500 overflow-hidden">
                                                            <img src={s.img_url || `https://ui-avatars.com/api/?name=${s.name}&background=random`} alt={s.name} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm italic">{s.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.role}</p>
                                                        </div>
                                                    </div>
                                                    <Badge color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black text-[9px]">{s.rating} ★</Badge>
                                                </div>
                                            ))}
                                            <button className="w-full text-center py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">Expand Directory</button>
                                        </div>
                                    </Card>

                                    <Card className="p-8 border-none shadow-xl bg-slate-50 rounded-[2.5rem]">
                                        <h5 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-6 italic">Recent Enrollment Node</h5>
                                        <div className="space-y-4">
                                            {(viewingCenter.students || []).slice(0, 3).map((s, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary-600 text-xs shadow-inner">ID</div>
                                                        <div>
                                                            <p className="font-black text-sm italic text-slate-900">{s.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.plan}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300">#{s.id}</span>
                                                </div>
                                            ))}
                                            <button className="w-full text-center py-4 bg-slate-200/50 hover:bg-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">Audit Students</button>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Sidebar Actions */}
                            <div className="space-y-8">
                                <Card className="p-8 border-none shadow-2xl bg-primary-600 text-white rounded-[2.5rem] relative overflow-hidden group/card shadow-primary-100">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 group-hover/card:scale-110 transition-transform duration-1000"></div>
                                    <div className="relative z-10">
                                        <h4 className="font-black italic text-xl mb-2">Strategic Forecast</h4>
                                        <p className="text-white/70 text-sm font-medium leading-relaxed mb-10">Analyze node performance and economic health across global operation theaters.</p>

                                        <div className="space-y-6">
                                            <button className="w-full py-4 bg-white text-primary-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:scale-95">
                                                <Mail size={16} /> Contact Admin
                                            </button>
                                            <button className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 border border-white/10 shadow-lg">
                                                <DollarSign size={16} /> Audit Treasury
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-8 border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem]">
                                    <h5 className="font-black uppercase tracking-widest text-[9px] text-slate-500 mb-6 flex items-center gap-2 italic">
                                        <AlertTriangle size={14} className="text-secondary-500" /> Operational Alerts
                                    </h5>
                                    <div className="space-y-3">
                                        <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-secondary-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse"></div>
                                            <div>
                                                <p className="text-[11px] font-black italic">Capacity Warning</p>
                                                <p className="text-[9px] font-medium text-slate-500 mt-1">Nearing PAX threshold. Deployment optimization suggested.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                            <div>
                                                <p className="text-[11px] font-black italic">System Synchronization</p>
                                                <p className="text-[9px] font-medium text-slate-500 mt-1">Health records audit scheduled for T-48 Hours.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)} className="font-black px-12 py-5 rounded-2xl border-2 uppercase tracking-widest text-xs hover:border-slate-300">Terminate Intel Scan</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CenterManagement;



