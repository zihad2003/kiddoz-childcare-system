import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Star, CheckCircle, Clock, ChevronDown, ChevronUp,
    Send, Filter, TrendingUp, Award, ThumbsUp, AlertCircle, User,
    Shield, Activity, Zap, Cpu, MousePointer2
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';

const SupportFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { addToast } = useToast();

    // Mock data fallback with premium context
    const mockFeedback = [
        { id: 1, user: { fullName: 'Fatima Begum' }, rating: 5, message: 'Excellent platform! The YOLO monitoring system has been incredibly helpful for tracking our children safely.', category: 'Praise', status: 'resolved', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 2, user: { fullName: 'Karim Hossain' }, rating: 3, message: 'The mobile app sometimes lags when loading the live feed. It would be great if this could be optimized.', category: 'Bug', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 3, user: { fullName: 'Rohima Khatun' }, rating: 4, message: 'Would love to see a weekly digest email feature for parent updates. Overall very satisfied with the service.', category: 'Feature Request', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
        { id: 4, user: { fullName: 'Arif Rahman' }, rating: 2, message: 'Billing section needs improvement. Invoice generation is slow and sometimes fails to load.', category: 'Bug', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: 5, user: { fullName: 'Sumaiya Islam' }, rating: 5, message: 'The staff management module is top-notch. Everything is organized and easy to use!', category: 'Praise', status: 'resolved', createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
    ];

    useEffect(() => { fetchFeedback(); }, []);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const data = await api.getFeedback();
            setFeedback(data?.length ? data : mockFeedback);
        } catch {
            setFeedback(mockFeedback);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.respondFeedback(id, 'Resolved by high-admin protocol');
            addToast('Synchronized as resolved', 'success');
            fetchFeedback();
        } catch {
            addToast('Error updating status matrix', 'error');
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        try {
            await api.respondFeedback(selectedFeedback.id, replyText);
            addToast('Transmission sent successfully', 'success');
            setIsReplyModalOpen(false);
            setReplyText('');
            fetchFeedback();
        } catch {
            addToast('Failed to execute transmission', 'error');
        }
    };

    const openReply = (item) => {
        setSelectedFeedback(item);
        setReplyText('');
        setIsReplyModalOpen(true);
    };

    const filtered = feedback.filter(f => {
        if (filter === 'pending') return f.status !== 'resolved';
        if (filter === 'resolved') return f.status === 'resolved';
        return true;
    });

    const avgRating = (feedback.reduce((s, f) => s + (f.rating || 5), 0) / (feedback.length || 1)).toFixed(1);
    const pendingCount = feedback.filter(f => f.status !== 'resolved').length;
    const resolvedCount = feedback.filter(f => f.status === 'resolved').length;

    const categoryStyle = (cat) => {
        if (cat === 'Praise') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        if (cat === 'Bug') return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
        if (cat === 'Feature Request') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    };

    if (loading && feedback.length === 0) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border border-primary-200">
                <MessageSquare className="w-10 h-10 text-primary-600" />
            </div>
            <p className="text-slate-500 font-black tracking-[0.25em] uppercase text-xs italic">Parsing Satisfaction Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-primary-600 rounded-full"></div>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic leading-none">Global Sentiment Monitoring</p>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic">Support & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Feedback</span> Matrix</h2>
                    <p className="text-slate-500 font-bold mt-5 text-sm uppercase tracking-wide">Net Score: <span className="text-emerald-500 font-black">{avgRating}/5.0</span> • Active Signals: <span className="text-primary-600 font-black">{pendingCount} PENDING</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm">
                        {['all', 'pending', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#0f172a] text-white shadow-lg italic' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tactical KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Aggregate Rating', val: avgRating, trend: 'Optimal', up: true, icon: Star, color: 'bg-white text-yellow-500 icon:bg-yellow-50 group-hover:shadow-yellow-100' },
                    { label: 'Unresolved Nodes', val: pendingCount, trend: '9 Signals', up: false, icon: Clock, color: 'bg-[#0f172a] text-white icon:bg-primary-600 group-hover:shadow-primary-900/40' },
                    { label: 'Protocol Completion', val: `${Math.round((resolvedCount / feedback.length) * 100)}%`, trend: 'Healthy', up: true, icon: CheckCircle, color: 'bg-white text-emerald-600 icon:bg-emerald-50 group-hover:shadow-emerald-100' }
                ].map((stat, i) => (
                    <Card key={i} className={`p-10 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] rounded-[3.5rem] relative overflow-hidden group/kpi hover:-translate-y-2 transition-all duration-700 ${stat.color.split(' ')[0] === 'bg-[#0f172a]' ? 'bg-[#0f172a]' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <p className="font-black uppercase tracking-[0.25em] text-[10px] text-slate-400 italic">{stat.label}</p>
                            <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover/kpi:rotate-12 ${stat.color.includes('icon:bg-primary-600') ? 'bg-primary-600 text-white shadow-primary-900/40' : (stat.color.includes('icon:bg-yellow-50') ? 'bg-yellow-50 text-yellow-500' : 'bg-emerald-50 text-emerald-600')}`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                        <h3 className={`text-5xl font-black italic tracking-tighter mb-5 leading-none ${stat.color.includes('text-white') ? 'text-white' : 'text-slate-900'}`}>{stat.val}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic relative z-10">
                            <Activity size={14} className={stat.up ? 'text-emerald-500' : 'text-primary-400'} />
                            <span className={stat.up ? 'text-emerald-500' : 'text-primary-400'}>{stat.trend}</span>
                            <span className="text-slate-300 ml-1">Live Telemetry</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Feedback Intelligence Grid */}
            <div className="space-y-6">
                {filtered.map(item => (
                    <Card key={item.id} className="border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] bg-white rounded-[3rem] overflow-hidden group/feedback hover:-translate-y-1 transition-all duration-500">
                        <div className="flex flex-col md:flex-row items-stretch">
                            {/* User Sidebar */}
                            <div className="md:w-72 bg-slate-50/50 p-10 flex flex-col items-center justify-center border-r border-slate-100/50 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[1.75rem] bg-white border-2 border-slate-100 shadow-md group-hover/feedback:scale-110 group-hover/feedback:rotate-3 transition-all duration-500 overflow-hidden mb-6">
                                        <img src={`https://ui-avatars.com/api/?name=${item.user?.fullName || 'User'}&background=random&bold=true`} alt={item.user?.fullName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
                                </div>
                                <h4 className="font-black text-slate-900 italic tracking-tighter text-xl mb-1 text-center leading-tight">{item.user?.fullName || 'Anonymous Node'}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">ID: SUP-{item.id}284</p>

                                <div className="flex items-center gap-1 mt-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < (item.rating || 5) ? 'fill-primary-500 text-primary-500' : 'text-slate-200 fill-slate-200'} />
                                    ))}
                                </div>
                            </div>

                            {/* Signal Content */}
                            <div className="flex-1 p-10 relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <Badge color={categoryStyle(item.category)} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border italic rounded-full shadow-sm">
                                            {item.category || 'Classification'}
                                        </Badge>
                                        <Badge color={item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-primary-500/10 text-primary-600 border-primary-500/20'} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border italic rounded-full shadow-sm">
                                            {item.status === 'resolved' ? '● PROTOCOL COMPLETE' : '○ SYNC PENDING'}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-2">
                                        <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>

                                <p className="text-slate-600 text-lg font-bold italic leading-relaxed mb-10 opacity-90">"{item.message}"</p>

                                <div className="flex items-center gap-4">
                                    {item.status !== 'resolved' ? (
                                        <>
                                            <button onClick={() => openReply(item)} className="px-10 py-4 bg-[#0f172a] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 italic group/btn">
                                                <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" /> Execute Response
                                            </button>
                                            <button onClick={() => handleResolve(item.id)} className="px-10 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 italic">
                                                <CheckCircle size={14} /> Mark Handled
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-3 active:scale-95 italic">
                                            {expandedId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} View Transcript
                                        </button>
                                    )}
                                </div>

                                {expandedId === item.id && item.response && (
                                    <div className="mt-8 p-8 bg-primary-50/50 rounded-[2rem] border border-primary-100/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Shield size={14} className="text-primary-600" />
                                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest italic">Authorized Admin Response</p>
                                        </div>
                                        <p className="text-slate-700 font-bold italic leading-relaxed">{item.response}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Reply Terminal */}
            <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} title="Intelligence Response Link">
                {selectedFeedback && (
                    <div className="p-8 space-y-8">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform"><MessageSquare size={80} /></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic flex items-center gap-2"><MousePointer2 size={12} /> Original Signal Content</p>
                            <p className="text-slate-700 font-bold italic leading-relaxed relative z-10">"{selectedFeedback.message}"</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                Tactical Response Protocol <Zap size={10} className="text-primary-500" />
                            </label>
                            <textarea
                                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:border-primary-500 focus:shadow-2xl outline-none transition-all min-h-[160px] font-bold text-slate-700 italic text-sm"
                                placeholder="Enter encrypted transmission..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="secondary" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] italic rounded-[1.5rem]" onClick={() => setIsReplyModalOpen(false)}>Abort Link</Button>
                            <Button type="button" variant="primary" className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] italic rounded-[1.5rem] shadow-2xl shadow-primary-900/20" onClick={handleReply}>
                                <Send size={16} className="mr-3" /> Execute Send
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SupportFeedback;
