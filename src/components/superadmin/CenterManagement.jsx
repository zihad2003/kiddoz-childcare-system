import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail, Plus, Edit2, Users, Briefcase, DollarSign, TrendingUp, MoreVertical, Trash2, Info, ArrowRight, UserCheck, ShieldCheck, Activity, Globe, Zap, AlertTriangle, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Select from '../ui/Select';

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

    const CHART_COLORS = ['#6366f1', '#f1f5f9'];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                <Building className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Mapping Global Nodes...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Global Infrastructure Node Management</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Facility <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Matrix</span></h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Nodes Connected: <span className="text-emerald-500 font-black">{centers.length}</span> • Capacity Load: <span className="text-primary-600 font-black">OPTIMAL</span></p>
                </div>
                <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => { setEditingCenter(null); setFormData({ name: '', location: '', contactEmail: '', contactPhone: '', capacity: '', status: 'active' }); setIsModalOpen(true); }} className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all duration-500 active:scale-95 shadow-xl">
                        <Plus size={18} /> Initialize Node
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {centers.map(center => {
                    const occupancyData = [
                        { name: 'Occupied', value: center.studentCount },
                        { name: 'Available', value: Math.max(0, center.capacity - center.studentCount) }
                    ];

                    return (
                        <Card key={center.id} className="overflow-hidden border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white relative group rounded-[3.5rem] hover:-translate-y-2 transition-all duration-700">
                            <div className="flex flex-col md:flex-row">
                                {/* Info Panel */}
                                <div className="p-10 flex-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                                        <Building size={160} />
                                    </div>
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200 group-hover:bg-primary-600 group-hover:rotate-6 transition-all duration-500">
                                            <Building size={24} />
                                        </div>
                                        <Badge color={center.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-100 text-slate-400 border-slate-200'} className="px-4 py-1.5 font-black rounded-full uppercase text-[9px] tracking-[0.15em] border italic">
                                            {center.status === 'active' ? '● Operational' : '○ Standby'}
                                        </Badge>
                                    </div>

                                    <h3 className="font-black text-3xl text-slate-900 mb-2 truncate italic tracking-tighter group-hover:text-primary-600 transition-colors">{center.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 mb-10 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                        <MapPin size={12} className="text-primary-500" />
                                        {center.location}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                                        <div className="bg-slate-50/80 rounded-[2.5rem] p-6 flex flex-col items-start gap-1 border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                            <div className="p-3 bg-white text-primary-600 rounded-2xl shadow-sm mb-2"><Users size={20} /></div>
                                            <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest italic mb-1">Identity Feed</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{center.studentCount}</p>
                                        </div>
                                        <div className="bg-slate-50/80 rounded-[2.5rem] p-6 flex flex-col items-start gap-1 border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                            <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-sm mb-2"><UserCheck size={20} /></div>
                                            <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest italic mb-1">Assigned Personnel</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{center.staffCount}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openDetailView(center)}
                                        className="w-full py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-[10px] hover:bg-black transition-all tracking-[0.25em] uppercase shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group/btn italic"
                                    >
                                        <Activity size={16} className="text-primary-400 group-hover/btn:animate-pulse" /> Intelligence Scan
                                    </button>
                                </div>

                                {/* Analytics Sidebar */}
                                <div className="md:w-72 bg-slate-50/40 p-10 flex flex-col items-center justify-center border-l border-slate-200/50 backdrop-blur-xl relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                                    <div className="w-full h-48 relative mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={occupancyData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={85}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {occupancyData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                            <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{center.occupancy}%</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Saturate</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4 mb-10">
                                        <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none px-2 italic">
                                            <span>Payload Limit</span>
                                            <span className="text-slate-900">{center.capacity} Node Capacity</span>
                                        </div>
                                        <div className="w-full h-3 bg-white border border-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${center.occupancy}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full pt-4 border-t border-slate-200/50">
                                        <button
                                            onClick={() => openEditModal(center)}
                                            className="flex-1 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
                                        >
                                            <Edit2 size={12} /> CONFIG
                                        </button>
                                        <button
                                            onClick={() => handleDelete(center.id)}
                                            className="p-4 bg-white border border-slate-200 rounded-[1.25rem] text-slate-300 hover:text-red-500 hover:border-red-200 transition-all shadow-sm hover:-translate-y-1 active:scale-95"
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

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCenter ? "Node Reconfiguration" : "Initialize New Primary Node"}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    <Input label="Node Designation" placeholder="e.g. MIRPUR-NODE-01" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required icon={Globe} />
                    <Input label="Spatial Coordinates" placeholder="Sector, Block, City" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required icon={MapPin} />

                    <div className="grid grid-cols-2 gap-8">
                        <Input label="Comm Protocol Email" type="email" placeholder="node@identity.net" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} icon={Mail} />
                        <Input label="Secure Voice Link" placeholder="+880..." value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} icon={Phone} />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Payload Max Limit</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="Auto"
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all font-black text-slate-700 italic h-14"
                                required
                            />
                        </div>
                        <Select
                            label="Operational State"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'active', label: 'Operational' },
                                { value: 'inactive', label: 'Sync Off' },
                                { value: 'maintenance', label: 'Bios Update' }
                            ]}
                        />
                    </div>

                    <div className="pt-8 flex gap-4">
                        <Button type="button" variant="secondary" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] italic rounded-[1.5rem]" onClick={() => setIsModalOpen(false)}>Abort Task</Button>
                        <Button type="submit" variant="primary" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] italic rounded-[1.5rem] shadow-2xl shadow-primary-900/20">
                            {editingCenter ? "Apply Config" : "Deploy Node"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Intelligence Detail View */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                className="max-w-7xl"
            >
                {viewingCenter && (
                    <div className="p-8 md:p-12 space-y-12 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-[2px] w-8 bg-primary-600 rounded-full"></div>
                                    <p className="text-[9px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Intelligence Scan Report</p>
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter shadow-sm">{viewingCenter.name} Core Audit</h3>
                            </div>
                            <Badge color="bg-emerald-500 text-white" className="font-black text-[10px] uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg shadow-emerald-100">STABLE OPERATIONAL</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Active Identity Feed', val: viewingCenter.studentCount, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50/50' },
                                { label: 'Assigned Personnel', val: viewingCenter.staffCount, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
                                { label: 'Structural Capacity', val: viewingCenter.capacity, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                                { label: 'Aggregated Treasury', val: `৳${viewingCenter.revenue?.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50/50' }
                            ].map((stat, i) => (
                                <Card key={i} className="p-10 border-none bg-slate-50/50 shadow-sm flex flex-col items-center text-center group/istat hover:shadow-2xl hover:bg-white transition-all duration-500 rounded-[3rem]">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-[1.5rem] mb-6 shadow-sm group-hover/istat:rotate-12 group-hover/istat:scale-110 transition-all duration-500`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">{stat.val}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mt-4 italic">{stat.label}</p>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-10">
                                <Card className="p-10 border-none shadow-[0_30px_80px_-20px_rgba(0,0,0,0.04)] bg-white rounded-[3.5rem] border border-slate-100/50">
                                    <div className="flex justify-between items-center mb-10">
                                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-3 italic">
                                            <TrendingUp size={16} className="text-primary-600" /> Flux Saturation Matrix
                                        </h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full">+12.4% Momentum</span>
                                    </div>
                                    <div className="w-full h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={viewingCenter.occupancyTrend}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8', fontFamily: 'monospace' }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8', fontFamily: 'monospace' }} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 40px 80px -15px rgba(0,0,0,0.1)', fontWeight: 'black' }} />
                                                <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={45} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <Card className="p-10 border-none shadow-2xl bg-[#0f172a] text-white rounded-[3.5rem] relative overflow-hidden group/pcard">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent opacity-0 group-hover/pcard:opacity-100 transition-opacity duration-1000"></div>
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover/pcard:rotate-12 transition-transform duration-1000"><ShieldCheck size={120} /></div>
                                        <h5 className="font-black uppercase tracking-widest text-[9px] text-primary-400 mb-8 italic">Personnel Infiltration</h5>
                                        <div className="space-y-4 relative z-10">
                                            {(viewingCenter.staff || []).slice(0, 3).map((s, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-[1.5rem] backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[1rem] border-2 border-primary-500 overflow-hidden shadow-lg">
                                                            <img src={s.img_url || `https://ui-avatars.com/api/?name=${s.name}&background=random&bold=true`} alt={s.name} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm italic leading-tight">{s.name}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-black text-[9px] border border-emerald-500/20">{s.rating}★</div>
                                                </div>
                                            ))}
                                            <button className="w-full text-center py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all italic border border-white/5 mt-4">Expand Registry</button>
                                        </div>
                                    </Card>

                                    <Card className="p-10 border-none shadow-xl bg-slate-50 rounded-[3.5rem] relative group/scard border border-slate-100">
                                        <h5 className="font-black uppercase tracking-widest text-[9px] text-slate-500 mb-8 flex items-center gap-2 italic"><Zap size={14} className="text-secondary-500" /> Identity Onboarding</h5>
                                        <div className="space-y-4">
                                            {(viewingCenter.students || []).slice(0, 3).map((s, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group/srow">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[1rem] bg-slate-100 flex items-center justify-center font-black text-primary-600 text-xs shadow-inner uppercase">ID</div>
                                                        <div>
                                                            <p className="font-black text-sm italic text-slate-900 leading-tight">{s.name}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.plan}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 italic group-hover/srow:text-primary-400 transition-colors">#{s.id}</span>
                                                </div>
                                            ))}
                                            <button className="w-full text-center py-5 bg-white hover:bg-slate-900 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all italic border border-slate-200 mt-4 shadow-sm">Audit Data</button>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <Card className="p-10 border-none shadow-[0_40px_100px_-20px_rgba(139,92,246,0.2)] bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-[3.5rem] relative overflow-hidden group/tcard">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                    <div className="relative z-10">
                                        <h4 className="font-black italic text-2xl mb-3 tracking-tighter shadow-sm leading-tight">Tactical Performance</h4>
                                        <p className="text-white/80 text-xs font-bold leading-relaxed mb-10 uppercase tracking-wide">High precision audit of center health records and flow dynamics.</p>

                                        <div className="space-y-4">
                                            <button className="w-full py-5 bg-white text-primary-700 rounded-[1.5rem] font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:scale-95 italic">
                                                <Mail size={16} /> Contact High-Admin
                                            </button>
                                            <button className="w-full py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[1.5rem] font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-3 border border-white/20 shadow-lg italic">
                                                <DollarSign size={16} /> Access Treasury Vault
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-10 border-none shadow-xl bg-white border border-slate-100 rounded-[3.5rem]">
                                    <h5 className="font-black uppercase tracking-widest text-[9px] text-slate-400 mb-8 flex items-center gap-2 italic">
                                        <AlertTriangle size={14} className="text-orange-500" /> Tactical Disruptions
                                    </h5>
                                    <div className="space-y-4">
                                        <div className="flex gap-5 items-start p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group/alert cursor-default">
                                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)] animate-pulse"></div>
                                            <div>
                                                <p className="text-[11px] font-black italic text-slate-900 leading-none mb-1">Saturation Anomaly</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed">Identity threshold reached. Load balancing recommended.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5 items-start p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group/alert cursor-default">
                                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                                            <div>
                                                <p className="text-[11px] font-black italic text-slate-900 leading-none mb-1">Neural Health Sync</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed">Aggregate health audit scheduled for Cycle-48.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end border-t border-slate-100">
                            <button onClick={() => setIsDetailModalOpen(false)} className="px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] italic transition-all active:scale-95">Terminate Audit Link</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CenterManagement;
