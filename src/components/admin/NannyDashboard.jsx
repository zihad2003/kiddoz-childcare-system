import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Baby, CheckCircle, Navigation, Phone, User, Play, StopCircle } from 'lucide-react';
import api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useToast } from '../../context/ToastContext';

// Mock bookings for demo if database is empty
const MOCK_BOOKINGS = [
    {
        id: 'b-1',
        parentName: 'Mrs. Rahman',
        childName: 'Aarif',
        address: 'House 12, Road 5, Dhanmondi',
        startTime: '09:00 AM',
        status: 'Pending', // Pending, OnTheWay, InProgress, Completed
        duration: '4 Hours',
        instructions: 'Needs lunch at 12:00 PM. Allergic to peanuts.',
        phone: '01711123456'
    }
];

const NannyDashboard = ({ db, appId, user }) => {
    const { addToast } = useToast();
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [activeBooking, setActiveBooking] = useState(null);
    const [timer, setTimer] = useState(0);

    // Simulate Timer
    useEffect(() => {
        let interval;
        if (activeBooking && activeBooking.status === 'InProgress') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeBooking]);

    // Format seconds to HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        // Update local state for immediate feedback
        const updatedBookings = bookings.map(b => {
            if (b.id === bookingId) return { ...b, status: newStatus };
            return b;
        });
        setBookings(updatedBookings);

        const booking = updatedBookings.find(b => b.id === bookingId);
        if (newStatus === 'InProgress') setActiveBooking(booking);
        if (newStatus === 'Completed') setActiveBooking(null);

        // Notify Parent Logic (Using REST API)
        try {
            const notifTitle =
                newStatus === 'OnTheWay' ? 'Nanny is on the way!' :
                    newStatus === 'InProgress' ? 'Service Started' :
                        newStatus === 'Completed' ? 'Service Completed' : 'Status Update';

            const notifMessage =
                newStatus === 'OnTheWay' ? `${user?.email || 'Nanny'} has started their journey to your location.` :
                    newStatus === 'InProgress' ? `Care for ${booking.childName} has begun.` :
                        newStatus === 'Completed' ? `Session ended. Total time: ${formatTime(timer)}` : '';

            await api.addNotification({
                title: notifTitle,
                message: notifMessage,
                type: 'parent',
                targetRole: 'parent',
                recipientId: booking.parentId, // Assuming booking has parentId
                studentId: booking.studentId,
                details: { status: newStatus }
            });
            addToast(`Parent notified: ${newStatus}`, 'success');
        } catch (e) {
            console.error("Failed to send notification via API", e);
            // Don't block UI if offline
            addToast(`Status updated to ${newStatus}`, 'success');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border-b border-pink-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Baby className="text-pink-500" /> Nanny Portal
                    </h2>
                    <p className="text-slate-500">Manage your bookings and navigate to families.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="font-bold text-slate-800">Sarah Karim</p>
                        <p className="text-xs text-green-600 font-bold">● Available</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                        S
                    </div>
                </div>
            </header>

            {/* Active Job Card */}
            {activeBooking && (
                <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-xl transform scale-[1.01]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-white/80 uppercase text-xs font-bold tracking-wider mb-1">Current Session</p>
                            <h3 className="text-3xl font-bold">{activeBooking.childName}</h3>
                            <p className="flex items-center gap-2 text-white/90 mt-1">
                                <MapPin size={16} /> {activeBooking.address}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-mono font-bold">{formatTime(timer)}</p>
                            <p className="text-xs text-white/60">Duration</p>
                        </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md mb-6">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle size={16} /> Task Checklist</h4>
                        <ul className="text-sm space-y-2">
                            <li className="flex gap-2"><input type="checkbox" className="accent-pink-300" /> Lunch at 12:00 PM</li>
                            <li className="flex gap-2"><input type="checkbox" className="accent-pink-300" /> Reading time (30 mins)</li>
                            <li className="flex gap-2"><input type="checkbox" className="accent-pink-300" /> Put down for nap</li>
                        </ul>
                    </div>

                    <Button
                        onClick={() => handleStatusUpdate(activeBooking.id, 'Completed')}
                        className="w-full bg-white text-pink-600 hover:bg-pink-50 font-bold border-none"
                    >
                        <StopCircle className="mr-2" size={20} /> End Service & Notify Parent
                    </Button>
                </Card>
            )}

            {/* Upcoming Jobs */}
            <div>
                <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-slate-400" /> Upcoming Jobs
                </h3>
                <div className="grid gap-4">
                    {bookings.filter(b => b.status !== 'Completed' && b.id !== activeBooking?.id).map(booking => (
                        <Card key={booking.id} className="group hover:border-pink-300 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-lg text-slate-800">{booking.childName}</h4>
                                        <Badge color="bg-blue-50 text-blue-700">{booking.startTime}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                                        <User size={14} /> Parent: {booking.parentName}
                                    </p>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-3 mb-4">
                                        <MapPin className="text-slate-400 shrink-0 mt-1" size={16} />
                                        <div>
                                            <p className="font-semibold text-sm text-slate-700">{booking.address}</p>
                                            <a href={`https://maps.google.com/?q=${booking.address}`} target="_blank" rel="noreferrer" className="text-xs text-pink-600 hover:underline font-bold mt-1 inline-block">
                                                Open in Maps
                                            </a>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 bg-amber-50 text-amber-800 p-2 rounded border border-amber-100">
                                        <span className="font-bold">Note:</span> {booking.instructions}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-3 min-w-[150px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    {booking.status === 'Pending' && (
                                        <Button onClick={() => handleStatusUpdate(booking.id, 'OnTheWay')} disabled={activeBooking} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            <Navigation size={16} className="mr-2" /> Start Journey
                                        </Button>
                                    )}
                                    {booking.status === 'OnTheWay' && (
                                        <Button onClick={() => handleStatusUpdate(booking.id, 'InProgress')} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            <Play size={16} className="mr-2" /> Start Service
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full">
                                        <Phone size={16} className="mr-2" /> Call Parent
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {bookings.filter(b => b.status !== 'Completed' && b.id !== activeBooking?.id).length === 0 && (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                            No upcoming jobs found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NannyDashboard;
