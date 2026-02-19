import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Activity, FileText, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api'; // Assuming you have an API utility

const StudentProfile = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await api.get(`/students/${id}`);
                setStudent(data);
            } catch (e) {
                console.error("Student Loading Error:", e);
                addToast("Failed to load student data from the relational database.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id, addToast]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );

    if (!student) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            <User size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-bold">Student not found</p>
            <Link to="/dashboard" className="mt-4 text-purple-600 font-bold hover:underline">Return to Dashboard</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <div className="bg-purple-900 h-60 w-full absolute top-0 left-0 z-0"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 pt-10">
                <Link to="/dashboard" className="text-purple-200 hover:text-white flex items-center gap-2 mb-8 font-bold transition">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                {/* Header Profile Card */}
                <Card className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 mb-8 border-0 shadow-xl relative overflow-visible mt-12 bg-white">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-200 border-4 border-white shadow-2xl flex items-center justify-center -mt-20 md:-mt-0 md:-mb-12 relative z-20">
                        {/* Student Img Placeholder */}
                        <User size={80} className="text-slate-400" />
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
                        <p className="text-slate-500 font-medium">Student ID: {student.id} • {student.plan} Plan</p>
                    </div>

                    <div className="flex gap-3">
                        <Badge color="bg-green-100 text-green-700">Active</Badge>
                        <Badge color="bg-blue-100 text-blue-700">Verified</Badge>
                    </div>
                </Card>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-16 md:mt-8">
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personal Info</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase font-bold">Age / Gender</span>
                                    <span className="font-medium text-slate-700">{student.age} Years • {student.gender}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase font-bold">Date of Birth</span>
                                    <span className="font-medium text-slate-700 flex items-center gap-2"><Calendar size={14} /> {student.dob || 'Jan 01, 2020'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase font-bold">Allergies</span>
                                    <span className="font-medium text-red-500 bg-red-50 px-2 py-1 rounded inline-block">{student.allergies || 'None'}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Guardians</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">P</div>
                                    <div>
                                        <p className="font-bold text-slate-800">{student.parentName}</p>
                                        <p className="text-xs text-slate-500">Primary Contact</p>
                                    </div>
                                </div>
                                <div className="grid gap-2 mt-2">
                                    <a href={`tel:${student.phone} `} className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition"><Phone size={14} /> {student.phone}</a>
                                    <a href={`mailto:${student.email} `} className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition"><Mail size={14} /> {student.email || 'Email not set'}</a>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><Activity className="text-purple-600" /> Recent Health History</h3>
                            <div className="space-y-4">
                                {/* Mock History Items */}
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="font-bold text-slate-700">Routine Check-in</h4>
                                            <p className="text-sm text-slate-500">Vitals recorded normal. Temperature 98.6°F.</p>
                                            <span className="text-xs text-slate-400">Oct {12 - i}, 2023 • 09:30 AM</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2 text-purple-600 text-sm font-bold bg-purple-50 rounded-lg hover:bg-purple-100 transition">View All Records</button>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><FileText className="text-blue-600" /> Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-slate-200 p-4 rounded-xl flex items-center gap-3 hover:shadow-md transition cursor-pointer bg-slate-50">
                                    <FileText size={24} className="text-red-500" />
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-slate-700 truncate">Vaccination_Rec.pdf</p>
                                        <p className="text-xs text-slate-400">1.2 MB</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-xl flex items-center gap-3 hover:shadow-md transition cursor-pointer bg-slate-50">
                                    <FileText size={24} className="text-blue-500" />
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-slate-700 truncate">Enrollment_Form.pdf</p>
                                        <p className="text-xs text-slate-400">850 KB</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentProfile;
