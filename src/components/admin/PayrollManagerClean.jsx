import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { DollarSign, UserCheck, Clock, Plus, CheckCircle, Wallet, ArrowRight, X } from 'lucide-react';
import api from '../../services/api';

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
        // Simulate API delay
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
                        <Wallet className="text-purple-600" size={20} /> Secure Payment
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <p className="text-slate-500 text-sm">Payment Amount</p>
                                <h2 className="text-4xl font-bold text-slate-800">${payment.amount.toLocaleString()}</h2>
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                                    <UserCheck size={12} /> {payment.recipientName || payment.name} ({payment.role})
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-100">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment Type</span>
                                    <span className="font-semibold text-slate-700">{payment.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Reference ID</span>
                                    <span className="font-mono text-slate-400">TRX-{payment.id.toString().substring(0, 8)}</span>
                                </div>
                            </div>

                            <Button onClick={() => setStep(2)} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                                Proceed to Pay <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8 shadow-sm rounded border border-slate-100 p-1" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-8 shadow-sm rounded border border-slate-100 p-1" alt="Visa" />
                            </div>

                            <Input
                                label="Card Number"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => {
                                    // simple formatting
                                    const v = e.target.value.replace(/\D/g, '').substring(0, 16);
                                    setCardNumber(v.replace(/(\d{4})/g, '$1 ').trim());
                                }}
                                icon={Wallet}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Expiry"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                                <Input
                                    label="CVC"
                                    placeholder="123"
                                    type="password"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.substring(0, 3))}
                                />
                            </div>

                            <Button
                                onClick={handleProcess}
                                disabled={!cardNumber || !expiry || !cvc}
                                className="w-full mt-4 bg-black text-white hover:bg-slate-800"
                            >
                                Pay ${payment.amount}
                            </Button>
                            <button onClick={() => setStep(1)} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-2">Back to Review</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-in fade-in duration-300">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                                <CheckCircle className="absolute inset-0 m-auto text-purple-600" size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-2">Processing Payment...</h3>
                            <p className="text-slate-500">Contacting bank gateway secure channel.</p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                                <CheckCircle size={40} strokeWidth={3} />
                            </div>
                            <h3 className="font-bold text-2xl text-slate-800 mb-2">Payment Successful!</h3>
                            <p className="text-slate-500 mb-8">Transaction ID: #KID-{Math.floor(Math.random() * 1000000)}</p>

                            <Button onClick={onClose} className="w-full bg-slate-900 text-white">
                                Close Receipt
                            </Button>
                        </div>
                    )}
                </div>
                {step < 3 && (
                    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                            <CheckCircle size={10} /> 256-bit SSL Data Encryption
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
};

const PayrollManager = () => {
    const { addToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activePayment, setActivePayment] = useState(null); // For modal
    const [newPayment, setNewPayment] = useState({ name: '', role: 'Nanny', amount: '', type: 'Salary' });

    const [revenue, setRevenue] = useState({ total: 0, count: 0, byPlan: {} });

    useEffect(() => {
        api.getPayroll().then(data => {
            setPayments(data || []);
        }).catch(err => {
            console.error("Failed to load payroll", err);
        });

        api.getRevenue().then(setRevenue).catch(console.error);
    }, []);

    const handleConfirmPayment = async (id) => {
        try {
            await api.markPaid(id);
            setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
            addToast('Payment Processed Successfully', 'success');
        } catch (err) {
            addToast('Failed to process payment', 'error');
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            const payment = await api.addPayroll(newPayment);
            setPayments([payment, ...payments]);
            setShowCreateModal(false);
            setNewPayment({ name: '', role: 'Nanny', amount: '', type: 'Salary' });
            addToast('Payment Request Added', 'success');
        } catch (err) {
            addToast('Failed to create payment', 'error');
        }
    };

    const totalPending = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Payment Modal */}
            <PaymentModal
                isOpen={!!activePayment}
                payment={activePayment}
                onClose={() => setActivePayment(null)}
                onConfirm={handleConfirmPayment}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <DollarSign size={120} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-purple-200 font-medium mb-1 border-b border-purple-800/50 pb-1">Enrollment Revenue</p>
                            <h3 className="text-4xl font-bold tracking-tight">${revenue.total.toLocaleString()}</h3>
                            <p className="text-xs text-purple-300 mt-2">Monthly income from {revenue.count} active students</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                            <Plus size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-2 relative z-10 text-[10px] font-bold uppercase tracking-wider">
                        <div className="bg-white/5 p-2 rounded-lg text-center">
                            <p className="text-purple-300">Little</p>
                            <p>${(revenue.byPlan['Little Explorer'] || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg text-center">
                            <p className="text-purple-300">Growth</p>
                            <p>${(revenue.byPlan['Growth Scholar'] || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg text-center">
                            <p className="text-purple-300">VIP</p>
                            <p>${(revenue.byPlan['VIP Guardian'] || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet size={120} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-slate-300 font-medium mb-1 border-b border-slate-700 pb-1 flex items-center gap-2"><Clock size={14} /> Total Outstanding</p>
                            <h3 className="text-4xl font-bold tracking-tight">${totalPending.toLocaleString()}</h3>
                            <p className="text-xs text-slate-400 mt-2">Scheduled for next disbursement cycle</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3 relative z-10">
                        <Button onClick={() => setShowCreateModal(true)} className="bg-purple-500 hover:bg-purple-600 text-white border-0 flex-1 shadow-lg shadow-purple-900/20">
                            <Plus size={18} className="mr-2" /> New Request
                        </Button>
                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 flex-1 text-xs">
                            Generate Report
                        </Button>
                    </div>
                </Card>

                <Card className="bg-white border hover:border-purple-200 transition-colors">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-purple-600" /> Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {payments.slice(0, 3).map(p => (
                            <div key={p.id} className="flex justify-between items-center text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {(p.name || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700">{p.name || 'Unknown'}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">{p.role} • {p.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">${p.amount}</p>
                                    <span className={`text-[10px] font-bold ${p.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="border-0 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Payroll & Maintenance</h3>
                        <p className="text-sm text-slate-500">Manage salaries, bonuses, and vendor payments.</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none focus:ring-2 focus:ring-purple-100">
                            <option>All Types</option>
                            <option>Salary</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="py-4 pl-6 rounded-l-lg">Recipient</th>
                                <th className="py-4">Type</th>
                                <th className="py-4">Due Date</th>
                                <th className="py-4">Amount</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 pr-6 text-right rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {payments.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="py-4 pl-6">
                                        <div className="font-bold text-slate-700">{item.name}</div>
                                        <div className="text-xs text-slate-400">{item.role}</div>
                                    </td>
                                    <td className="py-4">
                                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-600">
                                            {item.type}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-slate-600 font-mono text-xs">{item.date}</td>
                                    <td className="py-4 font-bold text-slate-800">${item.amount}</td>
                                    <td className="py-4">
                                        {item.status === 'Paid' ? (
                                            <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 w-fit px-2 py-1 rounded-full border border-green-100">
                                                <CheckCircle size={12} /> Paid
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 w-fit px-2 py-1 rounded-full border border-amber-100">
                                                <Clock size={12} /> Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 pr-6 text-right">
                                        {item.status === 'Pending' && (
                                            <Button
                                                size="sm"
                                                onClick={() => setActivePayment(item)}
                                                className="bg-slate-900 hover:bg-black text-white shadow-sm hover:shadow-md transition-all"
                                            >
                                                Pay Now
                                            </Button>
                                        )}
                                        {item.status === 'Paid' && (
                                            <span className="text-xs text-slate-300 font-medium px-4">
                                                Processed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Payment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create New Request</h3>
                            <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleCreatePayment} className="space-y-4">
                            <Input
                                label="Recipient Name"
                                value={newPayment.name}
                                onChange={e => setNewPayment({ ...newPayment, name: e.target.value })}
                                required
                                placeholder="e.g. CleanCo Inc."
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Role/Category</label>
                                    <select
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition"
                                        value={newPayment.role}
                                        onChange={e => setNewPayment({ ...newPayment, role: e.target.value })}
                                    >
                                        <option>Nanny</option>
                                        <option>Staff</option>
                                        <option>Teacher</option>
                                        <option>Contractor</option>
                                        <option>Vendor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Type</label>
                                    <select
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition"
                                        value={newPayment.type}
                                        onChange={e => setNewPayment({ ...newPayment, type: e.target.value })}
                                    >
                                        <option>Salary</option>
                                        <option>Maintenance</option>
                                        <option>Bonus</option>
                                        <option>Reimbursement</option>
                                    </select>
                                </div>
                            </div>
                            <Input
                                label="Amount ($)"
                                type="number"
                                value={newPayment.amount}
                                onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                                required
                                placeholder="0.00"
                            />
                            <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 border-0 hover:opacity-90">Create Request</Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PayrollManager;
