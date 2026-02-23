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
        addToast('System Demo Request Transmitted to High Command', 'info');
    };

    const features = [
        {
            title: "Facility Matrix",
            id: "01",
            desc: "Command and control multiple childcare nodes from a singular intelligence hub. Monitor occupancy, staff ratios, and facility health in real-time.",
            icon: Building2,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            tag: "Infrastructure"
        },
        {
            title: "Identity Governance",
            id: "02",
            desc: "The ultimate ledger for personnel management. Verify staff signatures, manage parent access protocols, and ensure platform-wide security compliance.",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            tag: "Security"
        },
        {
            title: "Financial Matrix",
            id: "03",
            desc: "Precision tracking of capital flux. Monitor multi-center revenue streams, analyze profit margins, and forecast fiscal growth with high-fidelity algorithms.",
            icon: BarChart3,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            tag: "Treasury"
        },
        {
            title: "Neural Vision (YOLO)",
            id: "04",
            desc: "Integrated AI-powered safety monitoring. Deploy live vision streams with child detection and proximity alerts for mission-critical childcare safety.",
            icon: Cpu,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            tag: "AI Vision"
        },
        {
            title: "Forge Archives",
            id: "05",
            desc: "Automated report extraction. Generate high-precision PDF intelligence logs for billing, attendance, and operational audits with a single click.",
            icon: Database,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            tag: "Persistence"
        },
        {
            title: "Broadcast Bridge",
            id: "06",
            desc: "Universal transmission protocols. Send critical alerts, policy overrides, and informational pulses to the entire network or specific individual nodes.",
            icon: Zap,
            color: "text-primary-500",
            bg: "bg-primary-500/10",
            tag: "Transmissions"
        }
    ];

    const subFeatures = [
        { icon: Calendar, title: "Dynamic Scheduling", desc: "Automated staff rotational algorithms." },
        { icon: Bell, title: "Pulse Notifications", desc: "Real-time critical event broadcasting." },
        { icon: Heart, title: "Health Telemetry", desc: "Aggregated wellness and vaccination tracking." },
        { icon: Key, title: "Credential Vault", desc: "Secure encrypted staff document storage." }
    ];

    return (
        <div className="bg-white min-h-screen selection:bg-[#0f172a] selection:text-white overflow-hidden">
            {/* --- HERO SECTION --- */}
            <div className="relative pt-40 pb-40 overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-[40rem] h-[40rem] bg-primary-100 rounded-full blur-[150px] opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-[45rem] h-[45rem] bg-indigo-100 rounded-full blur-[150px] opacity-40 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-slate-100/50 rounded-full scale-110"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50/80 backdrop-blur-md border border-slate-200 rounded-full mb-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Admin Command Protocol v4.0.2</span>
                    </div>

                    <h1 className="text-7xl md:text-[9rem] font-black text-slate-900 tracking-tighter italic leading-[0.8] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                        The Master <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-700">Administrative</span> Forge
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-500 font-bold uppercase tracking-tight leading-[1.1] mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        KiddoZ provides a mission-critical command center <br className="hidden md:block" />
                        designed to monitor, govern, and scale the world's finest childcare infrastructure.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <Link to="/login" className="group px-14 py-8 bg-[#0f172a] text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-black hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] transition-all duration-700 hover:-translate-y-2 active:scale-95 shadow-2xl shadow-indigo-200 flex items-center gap-4">
                            Initialize Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                        </Link>
                        <button onClick={handleDemoRequest} className="px-14 py-8 bg-white border-2 border-slate-100 text-slate-900 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:border-primary-500 hover:text-primary-600 transition-all duration-700 hover:-translate-y-2 active:scale-95 shadow-lg shadow-slate-100/50">
                            Initialize System Demo
                        </button>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="mt-32 flex flex-col items-center gap-3 animate-bounce opacity-40">
                        <div className="w-px h-16 bg-gradient-to-b from-primary-600 to-transparent"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Scroll for Depth</span>
                    </div>
                </div>
            </div>

            {/* --- PARTNERS ROW --- */}
            <div className="bg-slate-50/50 border-y border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-6 overflow-hidden">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12 italic">Nodes Currently Secured via KiddoZ Protocol</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                        {/* Mock Logos with Icons */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">N</div>
                            <span className="text-xl font-black italic tracking-tighter text-slate-900">NORDIC_CHILD</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">P</div>
                            <span className="text-xl font-black italic tracking-tighter text-slate-900">PINNACLE_AC</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black italic">G</div>
                            <span className="text-xl font-black italic tracking-tighter text-slate-900">GALAXY_KIDS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black italic">M</div>
                            <span className="text-xl font-black italic tracking-tighter text-slate-900">MIRPUR_PRIM</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
                            <span className="text-xl font-black italic tracking-tighter text-slate-900">LITTLE_NODE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD PREVIEW SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 py-40">
                <div className="relative group/preview">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-indigo-500/30 rounded-[4rem] blur-[120px] group-hover:scale-110 transition-transform duration-1000 opacity-60"></div>

                    <div className="relative bg-[#0f172a] border border-white/10 rounded-[4rem] p-4 shadow-[0_80px_160px_-40px_rgba(15,23,42,0.4)] overflow-hidden">
                        {/* Chrome bar */}
                        <div className="flex items-center gap-2 px-8 py-4 border-b border-white/5 mb-4">
                            <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                            <div className="ml-4 px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-white/30 tracking-widest italic">HTTPS://COMMAND.KIDDOZ.IO/STRAT_OS</div>
                        </div>

                        {/* Main Image Replacement for CSS Mock */}
                        <div className="relative rounded-[3rem] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80&w=1600"
                                alt="KiddoZ Admin Dashboard Preview"
                                className="w-full h-auto object-cover aspect-[21/9] opacity-90 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                            />

                            {/* Overlay UI elements to blend with design */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent"></div>

                            {/* Static overlay components */}
                            <div className="absolute top-10 left-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hidden lg:block animate-in fade-in slide-in-from-left-4 duration-1000">
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="text-emerald-400" size={16} />
                                    <span className="text-[9px] font-black uppercase text-white tracking-widest italic leading-none">Real-Time Telemetry</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-emerald-500"></div>
                                    </div>
                                    <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-blue-500"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cursor/Tooltip Overlay */}
                            <div className="absolute bottom-10 right-10 bg-[#0f172a] text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/20 hidden lg:block animate-in zoom-in-50 duration-1000 backdrop-blur-3xl bg-opacity-80">
                                <div className="flex items-center gap-4 mb-4">
                                    <Sparkles className="text-primary-400" size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest italic leading-none text-primary-300">AI Forge Insight</span>
                                </div>
                                <p className="text-sm font-bold italic leading-relaxed text-slate-100 mb-2">"Operational load optimized."</p>
                                <p className="text-[11px] font-bold italic leading-relaxed text-slate-400">Predicted capacity boost: <span className="text-emerald-400">+18%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURE MATRIX --- */}
            <div className="max-w-7xl mx-auto px-6 py-40">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-14 bg-primary-600"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-600 italic">Core Intelligence Architecture</span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-[0.85] mb-8">System <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Bios</span> Protocol</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-tight max-w-xl text-lg opacity-80 italic">KiddoZ isn't software—it's an operating system for the next paradigm of automated facility management.</p>
                    </div>

                    <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group/mstat">
                        <div className="absolute inset-0 bg-primary-500/10 scale-0 group-hover/mstat:scale-100 transition-transform duration-1000 rounded-full blur-3xl"></div>
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400 mb-2 italic">Network Saturation</p>
                                <p className="text-3xl font-black text-white italic tracking-tighter">84 Nodes</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2 italic">Uptime Status</p>
                                <p className="text-3xl font-black text-white italic tracking-tighter">99.98%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-12 bg-white border border-slate-100/80 rounded-[4rem] hover:shadow-[0_80px_160px_-20px_rgba(15,23,42,0.12)] hover:border-primary-200 hover:-translate-y-3 transition-all duration-1000 relative overflow-hidden">
                            {/* Visual Backdrops */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            {/* Tech Texture Overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.12] group-hover:scale-150 transition-all duration-1000 grayscale group-hover:grayscale-0 pointer-events-none">
                                <feature.icon size={220} />
                            </div>

                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div className={`w-20 h-20 ${feature.bg} ${feature.color} rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 ease-out`}>
                                    <feature.icon size={32} />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 italic tracking-[0.3em]">MOD/{feature.id}</span>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-600/60 italic">{feature.tag}</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter group-hover:text-primary-600 transition-colors duration-500">{feature.title}</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity duration-700 italic">{feature.desc}</p>
                            </div>

                            <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 italic relative z-10">
                                Access Protocol <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform h-3 w-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ADAPTIVE INTELLIGENCE LAYERS --- */}
            <div className="bg-slate-50 py-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="flex items-center gap-3 mb-8">
                            <Layers className="text-primary-600 w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 italic">Advanced Sub-Modules</span>
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 italic tracking-tighter mb-8 shadow-sm">Adaptive <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 border-b-8 border-primary-500/10">Architecture</span></h2>
                        <p className="max-w-xl text-slate-500 font-bold uppercase tracking-tight italic opacity-70">A multi-layered ecosystem designed to evolve with your operational requirements.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {subFeatures.map((sub, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-700 group/sub">
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all duration-500 mb-8 inline-block shadow-inner">
                                    <sub.icon size={24} />
                                </div>
                                <h4 className="text-xl font-black italic tracking-tighter text-slate-900 mb-3">{sub.title}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">{sub.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- TACTICAL ADVANTAGE SECTION --- */}
            <div className="bg-[#0f172a] py-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -right-40 w-[60rem] h-[60rem] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-32 relative z-10">
                    <div className="lg:w-1/2">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px w-14 bg-primary-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 italic">Operational Efficiency Index</span>
                        </div>
                        <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter italic leading-[0.8] mb-12">The <br /><span className="text-primary-400 underline decoration-indigo-500 underline-offset-[12px] decoration-8">Tactical</span> Advantage</h2>

                        <div className="space-y-12">
                            {[
                                { title: "Neural Onboarding", id: "V1", desc: "Automated enrollment flow reduces administrative friction by 64% through AI predictive data mapping." },
                                { title: "Signal Encryption", id: "V2", desc: "End-to-end multi-layer encryption for all parent-child telemetery and master financial records." },
                                { title: "Adaptive Layouts", id: "V3", desc: "The platform dynamically reconfigures its UI based on the specific operational load of your node." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-8 group/tactical border-l-2 border-white/5 pl-10 hover:border-primary-500 transition-all duration-700">
                                    <div className="w-16 h-16 rounded-[1.75rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/tactical:border-primary-500 group-hover/tactical:bg-primary-500/20 group-hover/tactical:rotate-12 transition-all duration-700 shadow-2xl">
                                        <CheckCircle2 size={32} className="text-primary-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[10px] font-black text-primary-500/60 tracking-widest">PROTOCOL_{item.id}</span>
                                            <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">{item.title}</h4>
                                        </div>
                                        <p className="text-slate-400 font-bold text-base uppercase tracking-tight leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity duration-700">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Stack Card */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative p-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-[5rem] shadow-2xl group/stack">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-[5.2rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative bg-[#1e293b] rounded-[4.9rem] p-16 overflow-hidden">
                                <div className="absolute top-0 right-0 p-16 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000"><Fingerprint size={160} /></div>

                                <div className="mb-16">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 mb-6 italic">Integration Technology</p>
                                    <h5 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-4">Secured by <br /> Intelligence.</h5>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    {[
                                        { label: "Latency", val: "< 42ms" },
                                        { label: "Encryption", val: "AES-512" },
                                        { label: "AI Engine", val: "Neural V8" },
                                        { label: "Redundancy", val: "Triple-Tier" }
                                    ].map((s, i) => (
                                        <div key={i} className="border-l border-white/10 pl-6">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{s.label}</p>
                                            <p className="text-2xl font-black text-white italic tracking-tighter">{s.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500"><Lock size={18} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">GDPR & HIPPA Ready</span>
                                    </div>
                                    <MousePointer2 className="text-slate-600 w-6 h-6 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FINAL CALL TO ACTION --- */}
            <div className="py-48 bg-white relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-slate-100"></div>
                <div className="max-w-4xl mx-auto px-6 text-center space-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Sparkles className="text-primary-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 italic">Final Step</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic leading-[0.85]">
                            Initialize <br />
                            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Command Forge</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-center gap-10">
                        <Link to="/signup" className="group relative inline-flex items-center gap-6 px-20 py-10 bg-[#0f172a] text-white rounded-[3rem] font-black text-xs uppercase tracking-[0.5em] italic hover:bg-black hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.4)] transition-all duration-700 hover:-translate-y-3 active:scale-95 shadow-2xl shadow-indigo-200">
                            Begin Enrollment Phase <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-700" />
                            <div className="absolute top-0 left-0 w-full h-full rounded-[3rem] bg-primary-500/10 scale-0 group-hover:scale-110 transition-transform duration-1000 blur-2xl"></div>
                        </Link>

                        <div className="flex items-center gap-6 text-slate-300">
                            <span className="text-[10px] font-black uppercase tracking-widest italic">No master contract required</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 text-primary-600">
                                <Activity size={10} /> Instant Provisioning
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CUSTOM FOOTER FOR ADMIN FEATURES --- */}
            <footer className="bg-slate-50 border-t border-slate-100 py-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-20 opacity-[0.01] pointer-events-none scale-[3] rotate-12"><Shield size={200} /></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:col-span-1 lg:grid-cols-4 gap-20">
                    <div className="md:col-span-2 space-y-10">
                        <Link to="/" className="flex items-center cursor-pointer gap-4">
                            <div className="w-12 h-12 bg-primary-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-900/20 transform rotate-3 italic">K</div>
                            <span className="text-3xl font-black tracking-tighter text-slate-900 italic">Kiddo<span className="text-primary-600">Z</span> Protocol</span>
                        </Link>
                        <p className="text-slate-500 font-bold uppercase tracking-tight text-sm max-w-sm leading-relaxed italic opacity-80">The global standard for next-generation childcare infrastructure management and automated safety monitoring.</p>
                    </div>
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 italic">Governance</h5>
                        <ul className="space-y-4">
                            {['Terms of Service', 'Privacy Matrix', 'Security Audit', 'Compliance'].map((l, i) => (
                                <li key={i}><Link to="#" className="text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase italic tracking-tight">{l}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-8">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 italic">Navigation</h5>
                        <ul className="space-y-4">
                            {['Initialize Login', 'Request Audit', 'Feature Matrix', 'Support Vector'].map((l, i) => (
                                <li key={i}><Link to="#" className="text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase italic tracking-tight">{l}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">© 2026 KIDDOZ. HIGH COMMAND ENFORCED.</p>
                    <div className="flex items-center gap-6">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"><Globe size={14} /></div>
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"><Shield size={14} /></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminFeatures;
