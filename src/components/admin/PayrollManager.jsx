import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { DollarSign, UserCheck, Calendar, Clock, CreditCard, Plus, CheckCircle } from 'lucide-react';

const MOCK_PAYROLL = [
    { id: 'p1', name: 'Sarah Karim', role: 'Nanny', amount: 500, status: 'Pending', type: 'Salary', date: '2023-11-01' },
    { id: 'p2', name: 'Rahim Uddin', role: 'Nanny', amount: 450, status: 'Paid', type: 'Salary', date: '2023-10-01' },
    { id: 'p3', name: 'Maintenance Team', role: 'Contractor', amount: 1200, status: 'Pending', type: 'Maintenance', date: '2023-11-05' },
    { id: 'p4', name: 'Fatima Begum', role: 'Teacher', amount: 3200, status: 'Paid', type: 'Salary', date: '2023-10-28' },
];

const PayrollManager = () => {
    const { addToast } = useToast();
    const [payments, setPayments] = useState(MOCK_PAYROLL);
    const [showPayModal, setShowPayModal] = useState(false);
    const [newPayment, setNewPayment] = useState({ name: '', role: 'Nanny', amount: '', type: 'Salary' });

    const handlePay = (id) => {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
        addToast('Payment Processed Successfully', 'success');
    };

    const handleCreatePayment = (e) => {
        e.preventDefault();
        const payment = {
            id: `p-${Date.now()}`,
            ...newPayment,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setPayments([payment, ...payments]);
        setShowPayModal(false);
        setNewPayment({ name: '', role: 'Nanny', amount: '', type: 'Salary' });
        addToast('Payment Request Added', 'success');
    };

    const totalPending = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">Total Pending Payouts</p>
                            <h3 className="text-4xl font-bold">${totalPending.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <Button onClick={() => setShowPayModal(true)} className="bg-white text-blue-600 hover:bg-blue-50 border-0 flex-1">
                            <Plus size={18} className="mr-2" /> New Payment
                        </Button>
                        <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 flex-1">
                            Download Report
                        </Button>
                    </div>
                </Card>

                <Card className="bg-white">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-amber-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {payments.slice(0, 3).map(p => (
                            <div key={p.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                <div>
                                    <p className="font-bold text-slate-700">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.role} • {p.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">${p.amount}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Payroll & Maintenance</h3>
                    <div className="flex gap-2">
                        <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none">
                            <option>All Types</option>
                            <option>Salary</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-4 pl-4">Recipient</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {payments.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="py-4 pl-4">
                                        <div className="font-bold text-slate-700">{item.name}</div>
                                        <div className="text-xs text-slate-400">{item.role}</div>
                                    </td>
                                    <td className="py-4">
                                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                                            {item.type}
                                        </Badge>
                                    </td>
                                    <td className="py-4 text-slate-600">{item.date}</td>
                                    <td className="py-4 font-bold text-slate-800">${item.amount}</td>
                                    <td className="py-4">
                                        {item.status === 'Paid' ? (
                                            <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                                                <CheckCircle size={14} /> Paid
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                                <Clock size={14} /> Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        {item.status === 'Pending' && (
                                            <Button size="sm" onClick={() => handlePay(item.id)} className="bg-green-600 hover:bg-green-700 text-white">
                                                Pay Now
                                            </Button>
                                        )}
                                        {item.status === 'Paid' && (
                                            <Button size="sm" variant="ghost" disabled className="text-slate-400">
                                                Archived
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* New Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md relative">
                        <h3 className="text-xl font-bold mb-6">Create New Payment</h3>
                        <form onSubmit={handleCreatePayment} className="space-y-4">
                            <Input
                                label="Recipient Name"
                                value={newPayment.name}
                                onChange={e => setNewPayment({ ...newPayment, name: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Role/Category</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
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
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
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
                            />
                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowPayModal(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1">Create Request</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PayrollManager;
