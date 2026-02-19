import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { programsData } from '../../data/programsData';
import Badge from '../ui/Badge';
import { CheckCircle, ArrowLeft, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';

const ProgramDetails = () => {
    const { programId } = useParams();
    const program = programsData.find(p => p.id === programId);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation after mount
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, [programId]);

    // Reset animation when programId changes
    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, [programId]);

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 pt-20">
                <h2 className="text-3xl font-bold text-slate-800">Program Not Found</h2>
                <Link to="/programs" className="text-primary-600 hover:text-primary-800 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Programs
                </Link>
            </div>
        );
    }

    // Get other programs for "More Programs" section
    const otherPrograms = programsData.filter(p => p.id !== programId);

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">

            {/* Hero Header with animation */}
            <div className={`bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden py-24 px-4 mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
                }`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto z-10 text-center">
                    <Link
                        to="/programs"
                        className={`inline-flex items-center text-primary-200 hover:text-white mb-8 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                            }`}
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to All Programs
                    </Link>

                    <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                        }`}>
                        <Badge color="bg-white/20 text-white border border-white/30 mb-6 inline-flex items-center gap-2 px-4 py-1.5 backdrop-blur-sm">
                            <Sparkles size={14} /> {program.age}
                        </Badge>
                    </div>

                    <h1 className={`text-4xl md:text-6xl font-black mb-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                        {program.title}
                    </h1>

                    <p className={`text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                        {program.shortDesc}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Image & Quick Stats */}
                    <div className={`space-y-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                        }`}>
                        <div className="relative group">
                            <div className="absolute -inset-3 bg-gradient-to-r from-primary-600 to-primary-600 rounded-[2rem] opacity-20 group-hover:opacity-30 transition duration-500 blur-sm"></div>
                            <img
                                src={program.img}
                                alt={program.title}
                                className="rounded-3xl shadow-2xl w-full object-cover h-[400px] relative z-10 group-hover:scale-[1.01] transition duration-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}>
                                <Calendar className="text-primary-600 mb-3" size={32} />
                                <h3 className="text-lg font-bold text-slate-800">Schedule</h3>
                                <p className="text-slate-600">{program.schedule}</p>
                            </div>
                            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}>
                                <Users className="text-primary-600 mb-3" size={32} />
                                <h3 className="text-lg font-bold text-slate-800">Capacity</h3>
                                <p className="text-slate-600">{program.capacity}</p>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className={`bg-gradient-to-br from-primary-600 to-primary-600 rounded-2xl p-6 text-white shadow-xl transition-all duration-500 delay-[800ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}>
                            <p className="text-primary-200 text-sm font-medium mb-1">Starting From</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">৳{program.price.toLocaleString()}</span>
                                <span className="text-primary-200 text-sm">/{program.billingPeriod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                        }`}>
                        <div className="prose prose-lg text-slate-600 mb-10 leading-relaxed">
                            <p>{program.fullDesc}</p>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Sparkles className="text-primary-600" size={24} />
                            What's Included?
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            {program.features.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                        }`}
                                    style={{ transitionDelay: `${700 + i * 80}ms` }}
                                >
                                    <CheckCircle size={24} className="text-green-500 flex-shrink-0 group-hover:scale-110 transition" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className={`flex gap-4 transition-all duration-700 delay-[1100ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}>
                            <Link to="/enroll" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex-1 text-center">
                                Enroll Now
                            </Link>
                            <Link to="/tour" className="bg-white border-2 border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-700 font-bold px-8 py-4 rounded-xl text-lg transition shadow-sm hover:shadow-md hover:-translate-y-0.5 flex-1 text-center">
                                Book a Tour
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Other Programs Section */}
                {otherPrograms.length > 0 && (
                    <div className={`mt-24 transition-all duration-700 delay-[1200ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}>
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-slate-900 mb-3">Explore More Programs</h3>
                            <p className="text-slate-500">Find the perfect fit for your child's growth journey.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {otherPrograms.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/programs/${p.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <Badge color="bg-white/90 text-primary-800 absolute bottom-4 left-4 backdrop-blur-sm">{p.age}</Badge>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary-700 transition mb-2">{p.title}</h4>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{p.shortDesc}</p>
                                        <span className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover:gap-3 transition-all">
                                            Learn More <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramDetails;
