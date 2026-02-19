import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { paymentService } from '../../services/paymentService';
import { studentService } from '../../services/studentService';
import { DollarSign, UserCheck, Clock, CreditCard, Plus, CheckCircle, Wallet, ArrowRight, X, ShieldCheck, Activity, BarChart3 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, payment, onConfirm }) => {
    const [step, setStep] = useState(1); // 1: Review, 2: Card, 3: Processing, 4: Success
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setCardNumber('');
            setExpiry('');
            setCvc('');
        }
    }, [isOpen]);

    const handleProcess = async () => {
        setStep(3);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await onConfirm(payment.id);
        setStep(4);
    };

    if (!isOpen || !payment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md relative overflow-hidden p-0">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <CreditCard className="text-primary-600" size={20} /> Secure Payment
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <p className="text-slate-500 text-sm">Amount Disbursed</p>
                                <h2 className="text-4xl font-bold text-slate-800">৳{(parseFloat(payment.amount) || 0).toLocaleString()}</h2>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold">
                                    <UserCheck size={12} /> {payment.recipientName} ({payment.role})
                                </div>
                            </div>
                            <Button onClick={() => setStep(2)} className="w-full mt-4 bg-primary-600 hover:bg-primary-700">
                                Confirm & Proceed <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <Input label="Business Account Number" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Routing" placeholder="00000000" />
                                <Input label="Code" placeholder="***" type="password" />
                            </div>
                            <Button onClick={handleProcess} className="w-full mt-4 bg-black text-white">Release ৳{payment.amount}</Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="font-bold">Processing Transaction...</h3>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="font-bold text-2xl mb-2">Funds Released!</h3>
                            <Button onClick={onClose} className="w-full">Done</Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

const PayrollManager = () => {
    const { addToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenueStats, setRevenueStats] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activePayment, setActivePayment] = useState(null);
    const [newPayment, setNewPayment] = useState({ recipientName: '', role: 'Nanny', amount: '', type: 'Salary', status: 'Pending' });

    useEffect(() => {
        setLoading(true);
        const unsubscribe = paymentService.subscribeToPayments((data) => {
            setPayments(data);
            setLoading(false);
        });

        // Fetch monthly revenue stats
        const fetchStats = async () => {
            const stats = await paymentService.getMonthlyRevenue();
            setRevenueStats(stats);
        };
        fetchStats();

        return () => unsubscribe();
    }, []);

    const handleConfirmPayment = async (id) => {
        try {
            await paymentService.updatePayment(id, { status: 'Paid', paidAt: new Date() });
            addToast('Payment Disbursed', 'success');
        } catch (err) {
            addToast('Failed to process payment', 'error');
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        const result = await paymentService.recordPayment(newPayment);
        if (result.success) {
            addToast('Payment Request Saved', 'success');
            setShowCreateModal(false);
            setNewPayment({ recipientName: '', role: 'Nanny', amount: '', type: 'Salary', status: 'Pending' });
        } else {
            addToast(result.error, 'error');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PaymentModal
                isOpen={!!activePayment}
                payment={activePayment}
                onClose={() => setActivePayment(null)}
                onConfirm={handleConfirmPayment}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-800 to-primary-900 text-white border-0 overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-primary-200 text-xs font-bold uppercase tracking-widest mb-1">Monthly Revenue</p>
                        <h3 className="text-3xl font-black">৳{revenueStats?.paidAmount.toLocaleString() || '0'}</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full">৳{revenueStats?.pendingAmount.toLocaleString() || '0'} Pending</span>
                        </div>
                    </div>
                    <BarChart3 size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                </Card>

                <Card className="bg-slate-900 text-white border-0">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Staff Payroll</p>
                    <h3 className="text-3xl font-black">৳{payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toLocaleString()}</h3>
                    <div className="mt-4">
                        <Button onClick={() => setShowCreateModal(true)} size="sm" className="bg-white text-slate-900 hover:bg-slate-100 text-[10px] font-black uppercase py-1">
                            <Plus size={14} className="mr-1" /> New Disburse
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col justify-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Collection Progress</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-slate-800">{revenueStats ? Math.round((revenueStats.paid / (revenueStats.totalCount || 1)) * 100) : 0}%</h3>
                        <span className="text-xs text-green-500 font-bold mb-1">Target reached</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
                        <div
                            className="bg-green-500 h-full transition-all duration-1000"
                            style={{ width: `${revenueStats ? (revenueStats.paid / (revenueStats.totalCount || 1)) * 100 : 0}%` }}
                        />
                    </div>
                </Card>
            </div>

            <Card className="border-0 shadow-xl p-0 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Transaction History</h3>
                        <p className="text-sm text-slate-500">Real-time view of all cash inflows and outflows</p>
                    </div>
                    <Button variant="outline" size="sm">Download Ledger</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-4">Recipient/Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4 space-y-2">
                                            <Skeleton width="120px" height="16px" />
                                            <Skeleton width="80px" height="12px" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Skeleton width="80px" height="24px" variant="rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Skeleton width="60px" height="20px" className="ml-auto" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Skeleton width="80px" height="32px" className="ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <DollarSign size={24} className="text-slate-300" />
                                        </div>
                                        <p className="font-bold">No transactions found</p>
                                        <p className="text-xs mt-1">Create a new payment request to get started.</p>
                                    </td>
                                </tr>
                            ) : (
                                payments.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700">{item.recipientName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{item.type} • {item.role}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-700'}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-slate-800">৳{(parseFloat(item.amount) || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'Pending' ? (
                                                <Button size="sm" onClick={() => setActivePayment(item)} className="bg-slate-900 text-white scale-90">Disburse</Button>
                                            ) : (
                                                <span className="text-[10px] uppercase font-black text-slate-300">Finalized</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Payment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md relative animate-in slide-in-from-bottom-4">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"><X size={20} /></button>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Plus className="text-primary-600" /> New Payment Request</h2>
                        <form onSubmit={handleCreateRequest} className="space-y-4">
                            <Input label="Recipient" value={newPayment.recipientName} onChange={e => setNewPayment({ ...newPayment, recipientName: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Role" value={newPayment.role} onChange={e => setNewPayment({ ...newPayment, role: e.target.value })} required />
                                <Input label="Type" value={newPayment.type} onChange={e => setNewPayment({ ...newPayment, type: e.target.value })} required />
                            </div>
                            <Input label="Amount (৳)" type="number" value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} required />
                            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 mt-2">Initialize Payment</Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PayrollManager;
