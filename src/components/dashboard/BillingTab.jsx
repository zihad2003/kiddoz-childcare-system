import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { DollarSign, CreditCard, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';
import api from '../../services/api';

const BillingTab = ({ student }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                setLoading(true);
                const billingData = await api.getParentBilling();
                // Check if the response matches our new mock structure (obj with invoices) or legacy array
                const invoicesList = Array.isArray(billingData) ? billingData : (billingData.invoices || []);
                setInvoices(invoicesList);
            } catch (err) {
                console.error('Failed to fetch billing', err);
                setInvoices([]); // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        fetchBilling();
    }, []);

    const outstandingBalance = (invoices || [])
        .filter(inv => inv.status === 'Pending' || inv.status === 'Unpaid' || inv.status === 'Overdue')
        .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    const handlePayNow = () => {
        alert("Payment Gateway Integration would open here (Stripe/PayPal)");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Financial Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-200 font-medium mb-1">Outstanding Balance</p>
                        <h2 className="text-4xl font-bold mb-6">${outstandingBalance.toFixed(2)}</h2>

                        {outstandingBalance > 0 ? (
                            <Button onClick={handlePayNow} className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg">
                                <CreditCard size={18} className="mr-2" /> Pay Now
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-300 bg-emerald-900/30 p-2 rounded-lg">
                                <CheckCircle size={18} />
                                <span className="font-bold text-sm">All caught up!</span>
                            </div>
                        )}
                    </div>
                    <DollarSign size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12" />
                </Card>

                <Card className="flex flex-col justify-center">
                    <h3 className="text-slate-500 font-medium mb-2">Current Plan</h3>
                    <div className="font-bold text-2xl text-slate-800 mb-1">{student?.plan || 'No Active Plan'}</div>
                    <p className="text-sm text-slate-400">Monthly Billing • Next Invoice: Jan 01</p>
                </Card>

                <Card className="flex flex-col justify-center">
                    <h3 className="text-slate-500 font-medium mb-2">Payment Method</h3>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-slate-100 p-2 rounded-lg">
                            <CreditCard size={24} className="text-slate-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Visa ending in 4242</p>
                            <p className="text-xs text-slate-400">Expires 12/26</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="self-start text-purple-600 p-0 h-auto hover:text-purple-700">Update Method</Button>
                </Card>
            </div>

            {/* Invoice History */}
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Invoice History</h3>
                    <Button variant="outline" size="sm" icon={Download}>Download All</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="py-4 font-bold pl-4">Invoice ID</th>
                                <th className="py-4 font-bold">Date</th>
                                <th className="py-4 font-bold">Description</th>
                                <th className="py-4 font-bold">Amount</th>
                                <th className="py-4 font-bold">Status</th>
                                <th className="py-4 font-bold pr-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-400">
                                        {loading ? 'Loading invoices...' : 'No invoices found'}
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 pl-4 font-medium text-slate-700">{inv.invoiceNumber || inv.id}</td>
                                        <td className="py-4 text-slate-500 text-sm">{new Date(inv.createdAt || inv.date).toLocaleDateString()}</td>
                                        <td className="py-4 text-slate-600 text-sm max-w-xs truncate">{inv.description}</td>
                                        <td className="py-4 font-bold text-slate-800">${parseFloat(inv.amount).toFixed(2)}</td>
                                        <td className="py-4">
                                            <Badge
                                                className={`${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : (inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}
                                            >
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 pr-4 text-right">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-purple-600">
                                                <Download size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default BillingTab;
