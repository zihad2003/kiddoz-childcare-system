import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { MOCK_NANNIES } from '../../data/mockData';
import { MapPin, Star, Clock, Calendar, Search, Filter, Phone, CheckCircle } from 'lucide-react';

const NannyBooking = ({ student }) => {
    const [filterArea, setFilterArea] = useState('Dhaka');
    const [filterPrice, setFilterPrice] = useState('');
    const [selectedNanny, setSelectedNanny] = useState(null);
    const [bookingStep, setBookingStep] = useState('list'); // list | book | success

    // Filter nannies
    const filteredNannies = MOCK_NANNIES.filter(n =>
        (filterArea === 'All' || n.area.includes(filterArea)) &&
        (!filterPrice || n.rate <= parseInt(filterPrice))
    );

    const handleBookClick = (nanny) => {
        setSelectedNanny(nanny);
        setBookingStep('book');
    };

    const confirmBooking = () => {
        // Logic for payment would go here (Payment Modal)
        // For now, simulate success
        setBookingStep('success');
    };

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
                                    <option className="text-slate-800" value="Dhaka">Greater Dhaka</option>
                                    <option className="text-slate-800" value="Gulshan">Gulshan</option>
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
                                    <Button onClick={() => handleBookClick(nanny)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-xs">Book Now</Button>
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
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Child (Auto-filled)</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" disabled>
                                    <option>{student?.name || "No enrolled child found"}</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-1">Using verified profile from your account.</p>
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

                            <Button size="lg" className="w-full bg-rose-600 hover:bg-rose-700">Proceed to Payment</Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Success View */}
            {bookingStep === 'success' && (
                <div className="text-center max-w-lg mx-auto py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-500 mb-8">
                        {selectedNanny?.name} has been notified. You can track their arrival status in the "Live View" tab.
                    </p>
                    <Button onClick={() => setBookingStep('list')}>Book Another</Button>
                </div>
            )}

        </div>
    );
};

export default NannyBooking;
