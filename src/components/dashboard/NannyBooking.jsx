import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import { MapPin, Star, Clock, CheckCircle, Video, Activity, Heart, Shield, Phone, MessageSquare } from 'lucide-react';

const NannyBooking = ({ student }) => {
    const [filterArea, setFilterArea] = useState('All'); const [filterPrice, setFilterPrice] = useState('');
    const [selectedNanny, setSelectedNanny] = useState(null);
    const [bookingStep, setBookingStep] = useState('list'); // list | book | success | active
    const [childName, setChildName] = useState(student?.name || '');
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNannies = async () => {
            try {
                setLoading(true);
                const staffData = await api.getStaff();
                // Filter only nannies
                const nannyData = staffData.filter(s => s.role === 'Nanny');
                setNannies(nannyData);
            } catch (err) {
                console.error('Failed to fetch nannies', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNannies();
    }, []);

    useEffect(() => {
        if (student?.name) setChildName(student.name);
    }, [student]);

    // Filter nannies
    const filteredNannies = nannies.filter(n =>
        (filterArea === 'All' || (n.area && n.area.toLowerCase().includes(filterArea.toLowerCase()))) && (!filterPrice || n.rate <= parseInt(filterPrice))
    );

    const handleBookClick = (nanny) => {
        setSelectedNanny(nanny);
        setBookingStep('book');
    };

    const confirmBooking = async () => {
        try {
            // Create booking via API
            await api.createNannyBooking({
                studentId: student?.id,
                nannyId: selectedNanny.id,
                date: new Date(), // In real app, get from form
                startTime: '14:00',
                endTime: '18:00',
                duration: '4 hours',
                notes: `Booking for ${childName}`
            });
            setBookingStep('success');
        } catch (err) {
            console.error('Failed to create booking', err);
            alert('Failed to create booking. Please try again.');
        }
    };

    // Mock Live View Component
    const ActiveServiceView = ({ nanny }) => (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="text-green-500 animate-pulse" /> Live Service Active
                </h2>
                <Badge color="bg-green-100 text-green-700 font-bold border-green-200">On Duty</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Feed / Status Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black rounded-3xl overflow-hidden relative shadow-2xl aspect-video group">
                        {/* Placeholder for live feed */}
                        <img
                            src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80"
                            alt="Live Care"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
                            <span className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">00:45:12</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-medium flex items-center gap-2">
                                <Activity size={16} className="text-green-400" />
                                {nanny.name} is playing with {childName || 'Child'}
                            </p>
                        </div>
                    </div>

                    <Card>
                        <h3 className="font-bold text-lg mb-4">Live Updates</h3>
                        <div className="space-y-4">
                            {[
                                { time: '10:00 AM', text: 'Arrived and checked in.', icon: CheckCircle, color: 'text-green-500' },
                                { time: '10:15 AM', text: 'Started drawing activity.', icon: Heart, color: 'text-pink-500' },
                                { time: '10:45 AM', text: 'Snack time prepared.', icon: Clock, color: 'text-amber-500' }
                            ].map((update, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-12 text-xs text-slate-400 font-medium pt-1">{update.time}</div>
                                    <div className="flex-1 flex gap-3 p-3 bg-slate-50 rounded-xl">
                                        <update.icon size={16} className={`${update.color} mt-0.5`} />
                                        <p className="text-sm text-slate-700">{update.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Control Panel */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white border-0">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={nanny.img} alt={nanny.name} className="w-16 h-16 rounded-full border-2 border-white/30" />
                            <div>
                                <h3 className="font-bold text-lg">{nanny.name}</h3>
                                <p className="text-purple-200 text-xs">Certified Pro</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                                <Phone size={16} className="mr-2" /> Call
                            </Button>
                            <Button size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                                <MessageSquare size={16} className="mr-2" /> Chat
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="font-bold text-slate-800 mb-3 text-sm">Vital Stats</h4>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-center">
                                <p className="text-xs uppercase font-bold text-rose-400">Heart Rate</p>
                                <p className="text-xl font-black">98 <span className="text-xs">bpm</span></p>
                            </div>
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-center">
                                <p className="text-xs uppercase font-bold text-blue-400">Sleep</p>
                                <p className="text-xl font-black">--</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs" onClick={() => setBookingStep('list')}>End Service</Button>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Search & Filter Header */}
            {bookingStep === 'list' && (
                <>
                    <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                        <div className="md:flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Find a Trusted Nanny</h2>
                                <p className="text-pink-100">Professional care at your doorstep. Verified & Background Checked.</p>
                            </div>
                            <div className="mt-6 md:mt-0 flex gap-4 bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <select
                                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                                    value={filterArea}
                                    onChange={(e) => setFilterArea(e.target.value)}
                                >
                                    <option className="text-slate-800" value="All">All Locations</option>                                    <option className="text-slate-800" value="Gulshan">Gulshan</option>
                                    <option className="text-slate-800" value="Dhanmondi">Dhanmondi</option>
                                    <option className="text-slate-800" value="Uttara">Uttara</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        {filteredNannies.map(nanny => (
                            <Card key={nanny.id} className="hover:shadow-xl transition-shadow group relative overflow-hidden">
                                <div className="flex gap-4 mb-4">
                                    <img src={nanny.img} alt={nanny.name} className="w-16 h-16 rounded-full bg-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{nanny.name}</h3>
                                        <div className="flex items-center text-amber-500 text-sm font-bold">
                                            <Star size={14} fill="currentColor" className="mr-1" />
                                            {nanny.rating} ({nanny.reviews} reviews)
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                            <MapPin size={12} /> {nanny.area}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Hourly Rate</span>
                                        <span className="font-bold text-slate-800">${nanny.rate}/hr</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Experience</span>
                                        <span className="font-bold text-slate-800">{nanny.experience}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Availability</span>
                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                            <Clock size={12} /> {nanny.availability}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 text-xs">View Profile</Button>
                                    <Button onClick={() => handleBookClick(nanny)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-xs text-white shadow-lg shadow-rose-200">Book Now</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Booking Form View */}
            {bookingStep === 'book' && selectedNanny && (
                <div className="max-w-2xl mx-auto">
                    <Button variant="ghost" onClick={() => setBookingStep('list')} className="mb-4">← Back to Search</Button>
                    <Card>
                        <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                            <img src={selectedNanny.img} alt={selectedNanny.name} className="w-20 h-20 rounded-full bg-slate-100" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Booking: {selectedNanny.name}</h2>
                                <p className="text-slate-500">{selectedNanny.specialty} Specialist</p>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); confirmBooking(); }}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Child's Name</label>
                                {student ? (
                                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" disabled>
                                        <option>{student.name}</option>
                                    </select>
                                ) : (
                                    <Input
                                        placeholder="Enter child's name"
                                        value={childName}
                                        onChange={(e) => setChildName(e.target.value)}
                                        required
                                    />
                                )}
                                <p className="text-xs text-slate-400 mt-1">{student ? "Using verified profile." : "Guest booking mode."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input type="date" label="Date" required />
                                <Input type="time" label="Start Time" required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button type="button" className="p-3 border-2 border-rose-500 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm">Hourly</button>
                                    <button type="button" className="p-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm text-slate-600">Full Day</button>
                                    <button type="button" className="p-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm text-slate-600">Weekly</button>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Service Fee (4 Hours)</span>
                                    <span className="font-bold">${selectedNanny.rate * 4}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Booking Fee</span>
                                    <span className="font-bold">$5.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-2">
                                    <span>Total</span>
                                    <span className="text-rose-600">${(selectedNanny.rate * 4) + 5}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
                                <CheckCircle size={16} className="text-blue-500 mt-0.5" />
                                <p>By proceeding, you agree to the Nanny Booking Policy. Cancellations within 2 hours are subject to a fee.</p>
                            </div>

                            <Button size="lg" className="w-full bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200">Confirm & Pay</Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Success View */}
            {bookingStep === 'success' && (
                <div className="text-center max-w-lg mx-auto py-12 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-500 mb-8">
                        {selectedNanny?.name} has been notified.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button onClick={() => setBookingStep('active')} className="bg-purple-600 hover:bg-purple-700 shadow-xl">
                            Track Live Status
                        </Button>
                        <Button variant="ghost" onClick={() => setBookingStep('list')}>Book Another</Button>
                    </div>
                </div>
            )}

            {/* Active Service View */}
            {bookingStep === 'active' && selectedNanny && (
                <ActiveServiceView nanny={selectedNanny} />
            )}

        </div>
    );
};

export default NannyBooking;
