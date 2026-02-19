import React from 'react';
import NannyBooking from '../dashboard/NannyBooking';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NannyBookingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            {/* Simple Header */}
            <div className="bg-primary-900 text-white py-12 px-4 mb-12 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Link to="/nanny-service" className="inline-flex items-center text-primary-200 hover:text-white mb-4 transition font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Back to Details
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">Book Your Nanny</h1>
                    <p className="text-primary-200">Secure, simple, and trusted childcare booking.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <NannyBooking student={null} />
            </div>
        </div>
    );
};

export default NannyBookingPage;
