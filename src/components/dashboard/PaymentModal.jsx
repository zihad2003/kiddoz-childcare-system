import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CreditCard, Lock, CheckCircle, Smartphone, Building, Loader2, ShieldCheck } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onComplete }) => {
    const [step, setStep] = useState('method'); // method | card | processing | success
    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        zip: ''
    });

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('method');
            setFormData({ name: '', cardNumber: '', expiry: '', cvc: '', zip: '' });
        }
    }, [isOpen]);

    const handleProcessPayment = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
        }, 2500); // Simulate 2.5s network request
    };

    const handleFinalize = () => {
        onComplete();
        onClose();
    };

    const formatCardNumber = (val) => {
        const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }
        return parts.length > 1 ? parts.join(' ') : v;
    };

    const CardPreview = () => (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl aspect-video relative overflow-hidden mb-6 transition-transform hover:scale-[1.02] duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <CreditCard size={120} />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-8 bg-amber-400 rounded-md opacity-80"></div>
                    <span className="font-mono text-xs opacity-60">DEBIT</span>
                </div>

                <div className="text-2xl font-mono tracking-wider mt-4">
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end mt-4">
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 mb-1">Card Holder</p>
                        <p className="font-bold tracking-wide uppercase text-sm truncate max-w-[150px]">{formData.name || 'YOUR NAME'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400 mb-1">Expires</p>
                        <p className="font-bold tracking-wide font-mono text-sm">{formData.expiry || 'MM/YY'}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Secure Checkout" maxWidth="max-w-2xl">
            <div className="grid md:grid-cols-2 gap-8 min-h-[400px]">
                {/* Left Side: Summary */}
                <div className="bg-slate-50 p-6 rounded-2xl h-full flex flex-col justify-between">
                    <div>
                        <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-4">Order Summary</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-700">Tuition Fee</span>
                            <span className="font-bold text-slate-900">${amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-sm text-slate-500">
                            <span>Platform Fee</span>
                            <span>$0.00</span>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                            <span className="font-black text-xl text-slate-800">Total</span>
                            <span className="font-black text-2xl text-purple-700">${amount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 justify-center">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span>SSL Encrypted Payment</span>
                    </div>
                </div>

                {/* Right Side: Flow */}
                <div className="flex flex-col justify-center">
                    {step === 'method' && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                            <p className="font-bold text-slate-900 mb-2">Select Payment Method</p>

                            <button
                                onClick={() => setStep('card')}
                                className="w-full p-4 border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 rounded-xl flex items-center gap-4 transition-all group"
                            >
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CreditCard size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Credit / Debit Card</span>
                            </button>

                            <button className="w-full p-4 border-2 border-slate-100 hover:border-black hover:bg-slate-50 rounded-xl flex items-center gap-4 transition-all group opacity-50 cursor-not-allowed" title="Coming Soon">
                                <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center">
                                    <Smartphone size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Apple Pay</span>
                            </button>

                            <button className="w-full p-4 border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center gap-4 transition-all group opacity-50 cursor-not-allowed" title="Coming Soon">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <Building size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Bank Transfer</span>
                            </button>
                        </div>
                    )}

                    {step === 'card' && (
                        <div className="animate-in slide-in-from-right-8 duration-300">
                            <div className="mb-[-10px]">
                                {/* Compact Card Visual */}
                                <CardPreview />
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleProcessPayment(); }} className="space-y-3">
                                <Input
                                    placeholder="Card Number"
                                    value={formData.cardNumber}
                                    onChange={e => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                                    maxLength={19}
                                    className="font-mono"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        placeholder="MM/YY"
                                        value={formData.expiry}
                                        onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                        maxLength={5}
                                        className="font-mono text-center"
                                        required
                                    />
                                    <Input
                                        placeholder="CVC"
                                        value={formData.cvc}
                                        onChange={e => setFormData({ ...formData, cvc: e.target.value })}
                                        maxLength={3}
                                        type="password"
                                        className="font-mono text-center"
                                        required
                                    />
                                </div>
                                <Input
                                    placeholder="Cardholder Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <Button type="submit" size="lg" className="w-full mt-2" icon={Lock}>
                                    Pay ${amount.toFixed(2)}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep('method')}
                                    className="w-full text-center text-xs text-slate-400 hover:text-purple-600 mt-2"
                                >
                                    Change Method
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="text-center py-10 animate-in fade-in duration-500">
                            <Loader2 size={64} className="text-purple-600 animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-800">Processing Payment...</h3>
                            <p className="text-slate-500 text-sm mt-2">Please do not close this window.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
                            <p className="text-slate-500 text-sm mb-8">Transaction ID: tx_{Math.random().toString(36).substr(2, 9)}</p>
                            <Button onClick={handleFinalize} className="w-full bg-green-600 hover:bg-green-700">
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;
