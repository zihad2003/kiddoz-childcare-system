import React, { useEffect } from 'react';
import {
    Shield, Globe, Zap, BarChart3, Users, Key,
    ArrowRight, CheckCircle2, Building2, Cpu,
    Activity, Box, Lock, Database, LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminFeatures = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            title: "Facility Matrix",
            desc: "Command and control multiple childcare nodes from a singular intelligence hub. Monitor occupancy, staff ratios, and facility health in real-time.",
            icon: Building2,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Identity Governance",
            desc: "The ultimate ledger for personnel management. Verify staff signatures, manage parent access protocols, and ensure platform-wide security compliance.",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Financial Matrix",
            desc: "Precision tracking of capital flux. Monitor multi-center revenue streams, analyze profit margins, and forecast fiscal growth with high-fidelity algorithms.",
            icon: BarChart3,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "Neural Vision (YOLO)",
            desc: "Integrated AI-powered safety monitoring. Deploy live vision streams with child detection and proximity alerts for mission-critical childcare safety.",
            icon: Cpu,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            title: "Forge Archives",
            desc: "Automated report extraction. Generate high-precision PDF intelligence logs for billing, attendance, and operational audits with a single click.",
            icon: Database,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Broadcast Bridge",
            desc: "Universal transmission protocols. Send critical alerts, policy overrides, and informational pulses to the entire network or specific individual nodes.",
            icon: Zap,
            color: "text-primary-500",
            bg: "bg-primary-500/10"
        }
    ];

    return (
        <div className="bg-white min-h-screen selection:bg-primary-500 selection:text-white">
            {/* Hero Section */}
            <div className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Shield className="w-5 h-5 text-primary-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">High Admin Protocol v4.0</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter italic leading-[0.85] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                        The Ultimate <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Administrative</span> Forge
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-500 font-bold uppercase tracking-tight leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        Empower your staff and secure your legacy. KiddoZ provides Center Admins with high-fidelity tools to govern, monitor, and scale their childcare infrastructure.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <Link to="/login" className="px-12 py-6 bg-[#0f172a] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] italic hover:bg-black hover:shadow-[0_20px_50px_-10px_rgba(15,23,42,0.4)] transition-all duration-500 hover:-translate-y-1 active:scale-95 shadow-2xl shadow-indigo-100">
                            Initialize Login
                        </Link>
                        <Link to="/tour" className="px-12 py-6 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] italic hover:border-primary-500 hover:text-primary-600 transition-all duration-500 hover:-translate-y-1 active:scale-95">
                            Request Audit
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Matrix */}
            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-primary-600"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 italic">Core Intelligence Modules</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none mb-6">Master <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Bios</span> Override</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-wide max-w-xl">KiddoZ isn't just a management software—it's a mission control system for the next generation of childcare providers.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hidden lg:flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                    <img src={`https://ui-avatars.com/api/?name=Admin+${i}&background=random&bold=true`} alt="Admin" />
                                </div>
                            ))}
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic leading-none">Global Adoption</p>
                            <p className="text-sm font-black text-slate-900 italic tracking-tighter">84 Centers Online</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-10 bg-white border border-slate-100 rounded-[3.5rem] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] hover:border-primary-200 hover:-translate-y-2 transition-all duration-700 relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-150 transition-all duration-1000 grayscale group-hover:grayscale-0">
                                <feature.icon size={180} />
                            </div>

                            <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-[1.75rem] flex items-center justify-center mb-10 shadow-sm group-hover:rotate-12 transition-all duration-500`}>
                                <feature.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-4 leading-tight">{feature.title}</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6 uppercase tracking-tight opacity-80 group-hover:opacity-100 transition-opacity italic">{feature.desc}</p>

                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 italic">
                                Read Meta <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tactical Advantage */}
            <div className="bg-[#0f172a] py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-primary-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400 italic">High Operational Efficiency</span>
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter italic leading-[0.95] mb-10">The <span className="text-primary-400 underline decoration-indigo-500 underline-offset-8">Tactical</span> Advantage</h2>

                        <div className="space-y-8">
                            {[
                                { title: "Neural Onboarding", desc: "Automated enrollment flow reduces administrative friction by 64%." },
                                { title: "Signal Encryption", desc: "End-to-end encryption for all parent-child telemetery and financial records." },
                                { title: "Adaptive Interface", desc: "Intelligence Hub adjusts to your specific node requirements automatically." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-primary-500 group-hover/item:bg-primary-500/10 transition-all duration-500">
                                        <CheckCircle2 size={24} className="text-primary-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white italic tracking-tighter leading-none mb-2">{item.title}</h4>
                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wide italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative w-full aspect-square md:aspect-video lg:aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-primary-600/20 rounded-[4rem] blur-[100px] animate-pulse"></div>
                        <div className="relative h-full w-full bg-[#1e293b] border border-slate-700/50 rounded-[4rem] p-1 shadow-2xl overflow-hidden group/screen">
                            <div className="h-full w-full bg-slate-900 rounded-[3.8rem] p-8 flex flex-col">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-900/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-900/50"></div>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Node: Platform-Admin-X1</div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="h-20 w-full bg-slate-800/50 border border-slate-700/50 rounded-3xl animate-pulse"></div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="h-32 bg-primary-600/20 border border-primary-500/30 rounded-3xl group-hover/screen:bg-primary-600/30 transition-all duration-700"></div>
                                        <div className="h-32 bg-white/5 border border-white/5 rounded-3xl"></div>
                                    </div>
                                    <div className="h-40 w-full bg-indigo-600/10 border border-indigo-500/20 rounded-3xl group-hover/screen:translate-y-1 transition-all"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Call to Action */}
            <div className="py-32 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none mb-12">Initialize Your <br /><span className="text-primary-600">Administrative Forge</span> Today</h2>
                    <Link to="/signup" className="inline-flex items-center gap-4 px-16 py-8 bg-[#0f172a] text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] italic hover:bg-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95 shadow-xl shadow-slate-200 group">
                        Begin Enrollment <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminFeatures;
