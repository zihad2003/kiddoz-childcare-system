import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import { CheckCircle, Clock, Shield, Star, Heart } from 'lucide-react';
import nannyServiceImg from '../../assets/images/landing/nanny_service_section.png';

const NannyService = () => {
    return (
        <div className="w-full bg-primary-50 relative overflow-hidden">
            <Section id="nanny-service" className="py-24">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Content Side */}
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary-600 font-semibold text-sm shadow-sm mb-6 border border-primary-100">
                                <Star size={16} className="fill-primary-600" />
                                <span>Premium Home Care</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Professional Nannies,<br />
                                <span className="text-primary-600">Right at Your Doorstep</span>
                            </h2>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                We understand that life doesn't always stick to a 9-to-5 schedule.
                                Our certified, background-checked nannies bring the KiddoZ standard of care
                                directly to your home, giving you peace of mind whenever you need it.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl text-primary-600 shadow-sm border border-primary-50">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Vetted & Safe</h4>
                                        <p className="text-sm text-slate-500">Rigorous background checks and detailed interviews.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl text-primary-600 shadow-sm border border-primary-50">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Flexible Hours</h4>
                                        <p className="text-sm text-slate-500">Available for evenings, weekends, and emergencies.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl text-primary-600 shadow-sm border border-primary-50">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Loving Care</h4>
                                        <p className="text-sm text-slate-500">Nannies who genuinely love and understand children.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl text-primary-600 shadow-sm border border-primary-50">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Certified Pros</h4>
                                        <p className="text-sm text-slate-500">First-aid trained and experienced professionals.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/book-nanny"
                                    className="px-8 py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-primary-200 hover:-translate-y-1 transition-all duration-300 text-center"
                                >
                                    Book a Nanny
                                </Link>
                                <Link
                                    to="/nanny-service"
                                    className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl shadow border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-center"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
                                <img
                                    src={nannyServiceImg}
                                    alt="KiddoZ Nanny Service"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                    <p className="text-white font-medium text-lg">Trusted by 500+ Families</p>
                                    <div className="flex -space-x-2 mt-2">
                                        {/* Placeholder avatars since I can't generate them easily in code without extra assets, let's use colors or initials */}
                                        <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold">JD</div>
                                        <div className="w-8 h-8 rounded-full bg-secondary-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold">AS</div>
                                        <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold">MR</div>
                                        <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold">DK</div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">+</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card */}
                            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-primary-50 animate-bounce-slow hidden md:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="font-bold text-slate-800">Available Now</span>
                                </div>
                                <p className="text-xs text-slate-500">3 Certified Nannies in your area</p>
                            </div>
                        </div>

                    </div>
                </div>
            </Section>
        </div>
    );
};

export default NannyService;
