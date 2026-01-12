import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Video, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const TourBookingPage = ({ setView }) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState('in-person'); // 'in-person' or 'virtual'
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', program: '' });

    const dates = [
        { day: 'Mon', date: '12', full: '2023-10-12' },
        { day: 'Tue', date: '13', full: '2023-10-13' },
        { day: 'Wed', date: '14', full: '2023-10-14' },
        { day: 'Thu', date: '15', full: '2023-10-15' },
        { day: 'Fri', date: '16', full: '2023-10-16' },
    ];

    const times = ['09:00 AM', '10:30 AM', '02:00 PM', '04:00 PM'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(3); // Success
    };

    if (step === 3) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-lg text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-100 shadow-xl">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Tour Confirmed!</h2>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    We can't wait to show you around. A calendar invitation has been sent to {formData.email}.
                </p>
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar size={18} className="text-purple-600" />
                        <span className="font-bold text-slate-700">Date:</span>
                        <span className="text-slate-600">October {dates.find(d => d.full === date)?.date}, 2023</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={18} className="text-purple-600" />
                        <span className="font-bold text-slate-700">Time:</span>
                        <span className="text-slate-600">{time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {type === 'in-person' ? <MapPin size={18} className="text-purple-600" /> : <Video size={18} className="text-purple-600" />}
                        <span className="font-bold text-slate-700">Type:</span>
                        <span className="text-slate-600 capitalize">{type} Tour</span>
                    </div>
                </div>
                <Button onClick={() => setView('home')} variant="outline" className="w-full">
                    Back to Home
                </Button>
            </Card>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-4">
                <button onClick={() => setView('home')} className="mb-8 text-slate-500 hover:text-purple-600 font-bold flex items-center gap-2 transition">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Panel: Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book a Tour</h1>
                            <p className="text-slate-500 leading-relaxed">
                                Experience the KiddoZ difference firsthand. Meet our educators, see our safety AI in action, and explore our learning environments.
                            </p>
                        </div>

                        <Card className="bg-purple-900 text-white border-0 p-6">
                            <h3 className="font-bold text-xl mb-4">Why Visit?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">1</div>
                                    <p className="text-sm text-purple-100">See our YOLOv8 safety monitoring in real-time.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">2</div>
                                    <p className="text-sm text-purple-100">Taste our organic meal samples.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">3</div>
                                    <p className="text-sm text-purple-100">Get a personalized curriculum walkthrough.</p>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    {/* Right Panel: Form */}
                    <Card className="md:col-span-2 p-8">
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">1. Select Preferences</h2>

                                    <label className="block text-sm font-bold text-slate-700 mb-3">Tour Type</label>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <button
                                            onClick={() => setType('in-person')}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'in-person' ? 'border-purple-600 bg-purple-50 text-purple-800' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
                                        >
                                            <MapPin size={24} />
                                            <span className="font-bold">In-Person Visit</span>
                                        </button>
                                        <button
                                            onClick={() => setType('virtual')}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'virtual' ? 'border-purple-600 bg-purple-50 text-purple-800' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
                                        >
                                            <Video size={24} />
                                            <span className="font-bold">Virtual Call</span>
                                        </button>
                                    </div>

                                    <label className="block text-sm font-bold text-slate-700 mb-3">Pick a Date</label>
                                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                                        {dates.map((d) => (
                                            <button
                                                key={d.full}
                                                onClick={() => setDate(d.full)}
                                                className={`flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${date === d.full ? 'bg-purple-600 border-purple-600 text-white shadow-lg scale-105' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'}`}
                                            >
                                                <span className="text-xs font-medium opacity-80">{d.day}</span>
                                                <span className="text-xl font-bold">{d.date}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <label className="block text-sm font-bold text-slate-700 mb-3">Available Time Slots</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                        {times.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTime(t)}
                                                className={`py-2 rounded-lg text-sm font-bold transition-all ${time === t ? 'bg-amber-400 text-purple-900 shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!date || !time}
                                    className="w-full"
                                    size="lg"
                                >
                                    Continue Details
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div>
                                    <button onClick={() => setStep(1)} className="text-slate-400 text-sm font-bold mb-6 hover:text-purple-600 flex items-center gap-1"><ArrowLeft size={16} /> Change Time</button>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">2. Your Information</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Parent Name"
                                        icon={User}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Email Address"
                                            icon={Mail}
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Phone Number"
                                            icon={Phone}
                                            type="tel"
                                            placeholder="(555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Select
                                        label="Interested Program"
                                        options={[
                                            { label: 'Day Care (6mo - 3yrs)', value: 'daycare' },
                                            { label: 'Pre-School (3yrs - 5yrs)', value: 'preschool' },
                                            { label: 'Summer Camp', value: 'camp' }
                                        ]}
                                        value={formData.program}
                                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                    />

                                    <Button type="submit" size="lg" className="w-full mt-4">
                                        Confirm Booking
                                    </Button>
                                </form>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TourBookingPage;
