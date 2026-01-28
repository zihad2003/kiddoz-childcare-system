import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { programsData } from '../../data/programsData';
import Badge from '../ui/Badge';
import { CheckCircle, ArrowLeft, Calendar, Users } from 'lucide-react';

const ProgramDetails = () => {
    const { programId } = useParams();
    const program = programsData.find(p => p.id === programId);

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h2 className="text-3xl font-bold text-slate-800">Program Not Found</h2>
                <Link to="/programs" className="text-purple-600 hover:text-purple-800 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Programs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">
            {/* Hero Header */}
            <div className="bg-purple-900 text-white relative overflow-hidden py-20 px-4 mb-12">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="relative max-w-7xl mx-auto z-10 text-center">
                    <Link to="/programs" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition">
                        <ArrowLeft size={20} className="mr-2" /> Back to All Programs
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">{program.title}</h1>
                    <p className="text-xl text-purple-100 max-w-3xl mx-auto">{program.shortDesc}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Image & Quick Stats */}
                    <div className="space-y-8">
                        <img
                            src={program.img}
                            alt={program.title}
                            className="rounded-3xl shadow-2xl w-full object-cover h-[400px]"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <Calendar className="text-purple-600 mb-3" size={32} />
                                <h3 className="text-lg font-bold text-slate-800">Schedule</h3>
                                <p className="text-slate-600">{program.schedule}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <Users className="text-purple-600 mb-3" size={32} />
                                <h3 className="text-lg font-bold text-slate-800">Capacity</h3>
                                <p className="text-slate-600">{program.capacity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div>
                        <Badge color="bg-purple-100 text-purple-800 border border-purple-200 mb-6 inline-block">{program.age}</Badge>

                        <div className="prose prose-lg text-slate-600 mb-10">
                            <p>{program.fullDesc}</p>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-6">What's Included?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            {program.features.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link to="/enroll" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg flex-1 text-center">
                                Enroll Now
                            </Link>
                            <Link to="/tour" className="bg-white border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-700 font-bold px-8 py-4 rounded-xl text-lg transition shadow-sm flex-1 text-center">
                                Book a Tour
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
