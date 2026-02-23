import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Section from '../ui/Section';
import Button from '../ui/Button';
import Card from '../ui/Card';

const TourCTA = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isStaff = user && ['superadmin', 'admin', 'teacher', 'nurse', 'nanny'].includes(user.role);

    if (isStaff) return null;

    return (
        <Section className="bg-slate-50 py-24 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-bold text-sm mb-6">
                            <Calendar size={16} /> Open for Visits
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Experience the KiddoZ Difference <span className="text-primary-600">In Person</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Reading about our safety features is one thing—seeing our YOLOv8 active monitoring and meeting our passionate educators is another. Schedule a 30-minute private tour today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => navigate('/tour')} size="lg" className="shadow-xl shadow-primary-200" icon={ArrowRight}>
                                Schedule a Tour
                            </Button>
                            <Button onClick={() => navigate('/programs')} variant="outline" size="lg">
                                View Curriculum
                            </Button>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Safety Demo</h4>
                                    <p className="text-sm text-slate-500">Live AI showcase</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Campus Tour</h4>
                                    <p className="text-sm text-slate-500">Classrooms & play areas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-white shadow-xl rotate-3 translate-y-8">
                                <img
                                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
                                    alt="Classroom"
                                    className="rounded-2xl w-full h-40 object-cover mb-4"
                                />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Play Area</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Safe</span>
                                </div>
                            </Card>
                            <Card className="p-4 bg-white shadow-xl -rotate-3">
                                <img
                                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80"
                                    alt="Teacher"
                                    className="rounded-2xl w-full h-40 object-cover mb-4"
                                />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Educators</span>
                                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Certified</span>
                                </div>
                            </Card>
                        </div>

                        {/* Decorative blob behind images */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-200 to-indigo-200 rounded-full blur-3xl -z-0 opacity-50"></div>
                    </div>

                </div>
            </div>
        </Section>
    );
};

export default TourCTA;
