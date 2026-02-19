import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Star, CheckCircle, Clock, ChevronDown, ChevronUp,
    Send, Filter, TrendingUp, Award, ThumbsUp, AlertCircle, User
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

const SupportFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { addToast } = useToast();

    // Mock data fallback
    const mockFeedback = [
        { id: 1, user: { fullName: 'Fatima Begum' }, rating: 5, message: 'Excellent platform! The YOLO monitoring system has been incredibly helpful for tracking our children safely.', category: 'Praise', status: 'resolved', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 2, user: { fullName: 'Karim Hossain' }, rating: 3, message: 'The mobile app sometimes lags when loading the live feed. It would be great if this could be optimized.', category: 'Bug', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 3, user: { fullName: 'Rohima Khatun' }, rating: 4, message: 'Would love to see a weekly digest email feature for parent updates. Overall very satisfied with the service.', category: 'Feature Request', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
        { id: 4, user: { fullName: 'Arif Rahman' }, rating: 2, message: 'Billing section needs improvement. Invoice generation is slow and sometimes fails to load.', category: 'Bug', status: 'pending', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: 5, user: { fullName: 'Sumaiya Islam' }, rating: 5, message: 'The staff management module is top-notch. Everything is organized and easy to use!', category: 'Praise', status: 'resolved', createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
    ];

    useEffect(() => { fetchFeedback(); }, []);

    const fetchFeedback = async () => {
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
            await api.respondFeedback(id, 'Resolved by admin');
            addToast('Marked as resolved', 'success');
            fetchFeedback();
        } catch {
            addToast('Error updating status', 'error');
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        try {
            await api.respondFeedback(selectedFeedback.id, replyText);
            addToast('Reply sent successfully', 'success');
            setIsReplyModalOpen(false);
            setReplyText('');
            fetchFeedback();
        } catch {
            addToast('Failed to send reply', 'error');
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

    const categoryColor = (cat) => {
        if (cat === 'Praise') return 'bg-emerald-100 text-emerald-700';
        if (cat === 'Bug') return 'bg-red-100 text-red-700';
        if (cat === 'Feature Request') return 'bg-blue-100 text-blue-700';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support & Feedback</h2>
                    <p className="text-slate-500 mt-1">Monitor user satisfaction and respond to platform feedback</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    {['all', 'pending', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Avg. Rating', value: avgRating, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', sub: `From ${feedback.length} responses` },
                    { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', sub: 'Awaiting response' },
                    { label: 'Resolved', value: resolvedCount, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', sub: 'Issues closed' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-xl flex items-center gap-5 bg-white">
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-sm`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Feedback List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-medium">Loading feedback...</p>
                </div>
            ) : filtered.length === 0 ? (
                <Card className="p-20 border-none shadow-xl text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ThumbsUp size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">All Clear!</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">No feedback matches this filter right now.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filtered.map(item => (
                        <Card key={item.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white p-0">
                            <div className="flex flex-col">
                                {/* Priority stripe */}
                                <div className={`h-1 ${item.status === 'resolved' ? 'bg-emerald-400' : item.rating <= 2 ? 'bg-red-500' : 'bg-purple-500'}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${item.user?.fullName || 'User'}&background=random&bold=true`}
                                                alt={item.user?.fullName}
                                                className="w-12 h-12 rounded-2xl shadow-sm"
                                            />
                                            <div>
                                                <p className="font-black text-slate-900">{item.user?.fullName || 'Anonymous User'}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < (item.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.category && (
                                                <Badge color={categoryColor(item.category)} className="text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                                    {item.category}
                                                </Badge>
                                            )}
                                            <Badge
                                                color={item.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                                className="text-[9px] font-black uppercase tracking-widest px-3 py-1"
                                            >
                                                {item.status === 'resolved' ? '✓ Resolved' : '⏳ Pending'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mt-4 text-sm font-medium leading-relaxed">{item.message}</p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-50">
                                        {item.status !== 'resolved' && (
                                            <>
                                                <button
                                                    onClick={() => openReply(item)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-black hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest"
                                                >
                                                    <Send size={13} /> Reply
                                                </button>
                                                <button
                                                    onClick={() => handleResolve(item.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-widest"
                                                >
                                                    <CheckCircle size={13} /> Mark Resolved
                                                </button>
                                            </>
                                        )}
                                        {item.response && (
                                            <button
                                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-all uppercase tracking-widest ml-auto"
                                            >
                                                {expandedId === item.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                                Admin Response
                                            </button>
                                        )}
                                    </div>

                                    {expandedId === item.id && item.response && (
                                        <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Admin Response</p>
                                            <p className="text-sm text-slate-700 font-medium">{item.response}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            <Modal isOpen={isReplyModalOpen} onClose={() => setIsReplyModalOpen(false)} title="Reply to Feedback">
                {selectedFeedback && (
                    <div className="space-y-6 p-2">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Original Message</p>
                            <p className="text-sm text-slate-700 font-medium">{selectedFeedback.message}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Your Response</label>
                            <textarea
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all min-h-[120px] font-medium text-slate-700"
                                placeholder="Write a helpful response..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Button type="button" variant="secondary" className="flex-1 h-12 font-bold" onClick={() => setIsReplyModalOpen(false)}>Cancel</Button>
                            <Button type="button" variant="primary" className="flex-1 h-12 font-bold shadow-lg shadow-purple-100" onClick={handleReply}>
                                <Send size={16} className="mr-2" /> Send Reply
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SupportFeedback;
