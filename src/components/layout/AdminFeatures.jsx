import React, { useEffect } from 'react';
import {
    Shield, Globe, Zap, BarChart3, Users, Key,
    ArrowRight, CheckCircle2, Building2, Cpu,
    Activity, Lock, Database, Layers,
    Calendar, Bell, Heart, Sparkles,
    MousePointer2, Fingerprint, Network
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const AdminFeatures = () => {
    const { addToast } = useToast();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleDemoRequest = () => {
        addToast('Demo request received. Our team will contact you shortly.', 'success');
    };

    const features = [
        {
            title: "Multi-Center Management",
            id: "01",
            desc: "Effortlessly manage multiple childcare locations from a single, intuitive dashboard. Monitor enrollment, staff ratios, and daily operations in real-time.",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
            tag: "Operations"
        },
        {
            title: "Staff & Parent Portal",
            id: "02",
            desc: "Streamline personnel management and parent communication. Verify credentials, manage access permissions, and maintain secure digital records for everyone.",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            tag: "Management"
        },
        {
            title: "Smart Billing & Finance",
            id: "03",
            desc: "Full transparency over your center's finances. Automated invoicing, payment tracking, and detailed financial forecasting to help your business grow.",
            icon: BarChart3,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            tag: "Financials"
        },
        {
            title: "AI Safety Monitoring",
            id: "04",
            desc: "Enhanced safety with intelligent monitoring. Real-time child detection and safety alerts help maintain the highest standards of care and security.",
            icon: Cpu,
            color: "text-rose-600",
            bg: "bg-rose-50",
            tag: "Safety"
        },
        {
            title: "Automated Reporting",
            id: "05",
            desc: "Generate professional reports in seconds. Export attendance, billing, and compliance logs with high-precision PDF formatting for audits and records.",
            icon: Database,
            color: "text-amber-600",
            bg: "bg-amber-50",
            tag: "Reports"
        },
        {
            title: "Instant Communication",
            id: "06",
            desc: "Connect with your entire network instantly. Send critical updates, newsletters, and urgent alerts to parents and staff with one click.",
            icon: Zap,
            color: "text-primary-600",
            bg: "bg-primary-50",
            tag: "Communication"
        }
    ];

    const subFeatures = [
        { icon: Calendar, title: "Smart Scheduling", desc: "Automated staff shift planning and rotation." },
        { icon: Bell, title: "Real-time Alerts", desc: "Instant mobile and web notifications for events." },
        { icon: Heart, title: "Health Tracking", desc: "Digital wellness logs and vaccination reminders." },
        { icon: Key, title: "Secure Storage", desc: "Encrypted document vault for sensitive files." }
    ];

    return (
        <div className="bg-white min-h-screen selection:bg-primary-600 selection:text-white overflow-hidden">
            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 pb-32 md:pt-48 md:pb-40 overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-primary-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-[35rem] md:w-[45rem] h-[35rem] md:h-[45rem] bg-indigo-100 rounded-full blur-[150px] opacity-40 animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">New: Enterprise Management Suite</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                        Professional <span className="text-primary-600">Childcare</span> <br className="hidden md:block" />
                        Solutions for Modern Centers
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        KiddoZ provides an all-in-one management platform designed to help you streamline operations,
                        ensure safety, and grow your childcare business with confidence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <Link to="/signup" className="group px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold text-base hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                            Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button onClick={handleDemoRequest} className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-base hover:border-primary-600 hover:text-primary-600 transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-sm">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* --- TRUSTED BY --- */}
            <div className="bg-slate-50/50 border-y border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Trusted by leading childcare institutions</p>
                    <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        {['NORDIC CHILD', 'PINNACLE ACADEMY', 'GALAXY KIDS', 'PRIMARY SCHOOL', 'LEARNING NODE'].map((name, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${['bg-blue-600', 'bg-indigo-600', 'bg-primary-600', 'bg-emerald-600', 'bg-rose-600'][i]}`}>{name[0]}</div>
                                <span className="text-lg font-bold tracking-tight text-slate-900">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD PREVIEW --- */}
            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="relative group/preview">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-[3rem] blur-[100px] group-hover:scale-105 transition-transform duration-1000 opacity-60"></div>

                    <div className="relative bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-3 shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                            <div className="ml-4 px-4 py-1 bg-white/5 rounded-full text-[10px] font-medium text-white/40 tracking-wider">dashboard.kiddoz.com</div>
                        </div>

                        <div className="relative rounded-[2rem] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80&w=1600"
                                alt="KiddoZ Management Dashboard"
                                className="w-full h-auto object-cover aspect-[21/9] opacity-90 group-hover:scale-105 transition-transform duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent"></div>

                            <div className="absolute top-8 left-8 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hidden lg:block">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="text-emerald-400" size={14} />
                                    <span className="text-[10px] font-bold uppercase text-white tracking-widest">Live Activity</span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="h-1 w-24 bg-white/10 rounded-full"><div className="h-full w-3/4 bg-emerald-500 rounded-full"></div></div>
                                    <div className="h-1 w-20 bg-white/10 rounded-full"><div className="h-full w-1/2 bg-blue-500 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CORE FEATURES --- */}
            <div id="features" className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-left">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-10 bg-primary-600"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Powerful Tools</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">Designed for Excellence</h2>
                        <p className="text-slate-600 font-medium text-lg max-w-xl">Everything you need to run a modern, efficient, and successful childcare business in one place.</p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl flex items-center gap-6">
                        <div className="text-left border-r border-white/10 pr-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-1">Active Centers</p>
                            <p className="text-2xl font-bold text-white tracking-tight">250+</p>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">System Uptime</p>
                            <p className="text-2xl font-bold text-white tracking-tight">99.9%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 hover:border-primary-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden text-left">
                            <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon size={28} />
                            </div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/60">{feature.tag}</span>
                                <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-primary-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                Learn More <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SUB FEATURES --- */}
            <div className="bg-slate-50 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">The Complete Ecosystem</h2>
                        <p className="text-slate-600 font-medium max-w-xl mx-auto">Thoughtful features designed to make every part of your day easier.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {subFeatures.map((sub, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors mb-6">
                                    <sub.icon size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{sub.title}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{sub.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- BENEFITS --- */}
            <div className="bg-[#0f172a] py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 relative z-10 text-left">
                    <div className="lg:w-1/2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-6 block">Why Choose KiddoZ?</span>
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-10">Modern Tools for <br /><span className="text-primary-400">Superior Care</span></h2>

                        <div className="space-y-10">
                            {[
                                { title: "Seamless Onboarding", desc: "Automated enrollment workflows reduce paperwork and administrative time by up to 60%." },
                                { title: "Advanced Security", desc: "Enterprise-grade encryption for all parent communication and financial records." },
                                { title: "Adaptive Experience", desc: "A smart interface that learns your workflows and puts the most important tasks front and center." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary-500 group-hover:bg-primary-500/20 transition-all duration-300">
                                        <CheckCircle2 size={24} className="text-primary-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-slate-400 font-medium text-base leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-[3rem] p-12 border border-white/10 shadow-2xl">
                            <h5 className="text-3xl font-bold text-white mb-10">Production Ready. <br /> Security First.</h5>
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: "Performance", val: "< 100ms" },
                                    { label: "Stability", val: "99.99%" },
                                    { label: "Encryption", val: "256-bit" },
                                    { label: "Support", val: "24/7" }
                                ].map((s, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{s.val}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500"><Shield size={20} /></div>
                                <span className="text-xs font-bold text-slate-400">Compliant with Global Safety Standards</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <div className="py-32 bg-white relative text-center">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Transform Your <br />
                        <span className="text-primary-600">Childcare Business Today</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 font-medium">Join hundreds of centers that trust KiddoZ to deliver a better experience for parents and staff.</p>

                    <div className="flex flex-col items-center gap-8">
                        <Link to="/signup" className="group px-12 py-6 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3">
                            Claim Your Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-sm font-bold text-slate-400">No credit card required • Cancel anytime</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFeatures;
