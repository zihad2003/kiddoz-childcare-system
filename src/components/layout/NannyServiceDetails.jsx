import React from 'react';
import { Link } from 'react-router-dom';
import { programsData } from '../../data/programsData';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Section from '../ui/Section';
import { CheckCircle, ArrowLeft, Star, Heart, Shield, Clock, Calendar, Check } from 'lucide-react';
import nannyImg from '../../assets/images/landing/nanny_service_section.png';

const NannyServiceDetails = () => {
    // We can use the data from programsData or hardcode improved content here
    const program = programsData.find(p => p.id === 'nanny') || {};

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-purple-900 text-white relative overflow-hidden pt-32 pb-20 px-4">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <Link to="/" className="inline-flex items-center text-purple-200 hover:text-white mb-8 transition font-medium">
                        <ArrowLeft size={20} className="mr-2" /> Back to Home
                    </Link>
                    <Badge color="bg-amber-400 text-purple-900 mb-6 border-none font-bold">New Service</Badge>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        Premium Nanny Service
                    </h1>
                    <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                        Expert childcare in the comfort of your own home. Vetted, certified, and loved by families.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Image & Key Benefits */}
                    <div>
                        <div className="relative mb-12 group">
                            <div className="absolute inset-0 bg-purple-600 rounded-3xl transform rotate-3 group-hover:rotate-0 transition duration-500 opacity-20"></div>
                            <img
                                src={nannyImg}
                                alt="Nanny with child"
                                className="rounded-3xl shadow-2xl w-full object-cover relative z-10 transform transition duration-500 hover:scale-[1.01]"
                            />

                            {/* Float Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20 animate-bounce-slow">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Safety First</p>
                                    <p className="font-bold text-slate-900">100% Vetted</p>
                                </div>
                            </div>
                        </div>

                        {/* Ratings */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
                                </div>
                                <span className="text-xl font-bold text-slate-800">4.9/5 Rating</span>
                            </div>
                            <p className="text-slate-600 italic">"The nanny we booked was absolutely wonderful. She arrived on time, was so engaging with our toddler, and even tidied up the play area!"</p>
                            <p className="text-slate-900 font-bold mt-4">- Sarah J., Working Mom</p>
                        </div>
                    </div>

                    {/* Right: Details & Pricing */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Our Nannies?</h2>
                        <div className="space-y-6 mb-12">
                            <div className="flex gap-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl h-fit">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Background Checked</h3>
                                    <p className="text-slate-600">Every nanny undergoes a rigorous multi-state background check, reference verification, and in-person interview.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl h-fit">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Experienced & Loving</h3>
                                    <p className="text-slate-600">We hire only those with proven childcare experience and a genuine passion for early childhood development.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Flexible Booking</h3>
                                    <p className="text-slate-600">Need a last-minute sitter? Or regular help? Book via our app 24/7 for tailored schedules.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100 rounded-3xl p-8 mb-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Simple Pricing</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-black text-purple-600">$35</span>
                                <span className="text-slate-500 font-medium">/ hour</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {['Minimum 4 hours', 'Sibling care included (up to 2)', 'Transportation provided', 'Light housekeeping included'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle size={20} className="text-green-500 text-sm" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/book-nanny"
                                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1"
                            >
                                Book a Nanny Now
                            </Link>
                            <p className="text-center text-slate-500 text-sm mt-4">No subscription required for one-time booking.</p>
                        </div>
                    </div>
                </div>

                {/* Process Section */}
                <Section className="border-t border-slate-200 mt-12 bg-white rounded-3xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-500">Getting trusted care is easier than ever.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: '1. Create Account', desc: 'Sign up for free and tell us about your family needs.', icon: Calendar },
                            { title: '2. Select Service', desc: 'Choose "Nanny Service" and browse available professionals.', icon: Check },
                            { title: '3. Relax', desc: 'We handle the rest. Your nanny arrives ready to help!', icon: Heart }
                        ].map((step, i) => (
                            <div key={i} className="text-center p-6 relative">
                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-2 border-purple-100">
                                    <step.icon size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                                <p className="text-slate-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default NannyServiceDetails;
