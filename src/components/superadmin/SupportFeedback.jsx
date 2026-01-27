import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

const SupportFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const data = await api.getFeedback();
            setFeedback(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.respondFeedback(id, 'Resolved by admin');
            addToast('Marked as resolved', 'success');
            fetchFeedback();
        } catch (error) {
            addToast('Error updating status', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Support & Feedback</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">Loading feedback...</div>
                    ) : feedback.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">No feedback messages found.</div>
                    ) : (
                        feedback.map(item => (
                            <div key={item.id} className="p-6 transition hover:bg-slate-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-slate-800">{item.user?.fullName || 'Anonymous'}</div>
                                        <span className="text-xs text-slate-400">• {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < (item.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 mb-4">{item.message}</p>

                                {item.status === 'resolved' ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                        <CheckCircle size={14} /> Resolved
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full">
                                            <Clock size={14} /> Pending Review
                                        </div>
                                        <Button size="sm" onClick={() => handleResolve(item.id)}>Mark Resolved</Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportFeedback;
