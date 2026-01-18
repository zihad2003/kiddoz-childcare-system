import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Star, MapPin, Clock, Heart, Shield, Phone, Mail,
    MessageSquare, X, ChevronRight, Award, Languages, Calendar, Users,
    CheckCircle, AlertCircle, Briefcase, GraduationCap, Baby
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import api from '../../services/api';

const NannyBooking = ({ student }) => {
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNanny, setSelectedNanny] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [favorites, setFavorites] = useState([]);

    // Filter states
    const [filters, setFilters] = useState({
        availability: 'all',
        experience: 'all',
        specialization: 'all',
        certification: 'all',
        language: 'all',
        priceRange: 'all'
    });

    useEffect(() => {
        fetchNannies();
    }, []);

    const fetchNannies = async () => {
        try {
            setLoading(true);
            const staffData = await api.getStaff();
            // Filter only nannies and add enhanced fields
            const nannyData = staffData
                .filter(s => s.role === 'Nanny')
                .map(nanny => ({
                    ...nanny,
                    bio: nanny.bio || `Experienced ${nanny.specialty} specialist with ${nanny.experience} of dedicated childcare service.`,
                    languages: nanny.languages || ['English', 'Bengali'],
                    certifications: nanny.certifications || ['CPR Certified', 'First Aid', 'Background Checked'],
                    verified: nanny.verified !== false,
                    availabilityStatus: nanny.availabilityStatus || (nanny.availability === 'Available Now' ? 'available' : 'limited'),
                    reviews: nanny.reviews || Math.floor(Math.random() * 50) + 10
                }));
            setNannies(nannyData);
        } catch (err) {
            console.error('Failed to fetch nannies', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (nannyId) => {
        setFavorites(prev =>
            prev.includes(nannyId)
                ? prev.filter(id => id !== nannyId)
                : [...prev, nannyId]
        );
    };

    const openProfileModal = (nanny) => {
        setSelectedNanny(nanny);
        setShowProfileModal(true);
    };

    const openContactModal = (nanny) => {
        setSelectedNanny(nanny);
        setShowContactModal(true);
    };

    // Filter nannies based on search and filters
    const filteredNannies = nannies.filter(nanny => {
        const matchesSearch = nanny.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAvailability = filters.availability === 'all' || nanny.availabilityStatus === filters.availability;
        const matchesExperience = filters.experience === 'all' ||
            (filters.experience === '0-2' && parseInt(nanny.experience) <= 2) ||
            (filters.experience === '2-5' && parseInt(nanny.experience) > 2 && parseInt(nanny.experience) <= 5) ||
            (filters.experience === '5+' && parseInt(nanny.experience) > 5);
        const matchesSpecialization = filters.specialization === 'all' || nanny.specialty?.toLowerCase().includes(filters.specialization.toLowerCase());
        const matchesCertification = filters.certification === 'all' || nanny.certifications?.some(cert => cert.toLowerCase().includes(filters.certification.toLowerCase()));
        const matchesLanguage = filters.language === 'all' || nanny.languages?.some(lang => lang.toLowerCase().includes(filters.language.toLowerCase()));
        const matchesPrice = filters.priceRange === 'all' ||
            (filters.priceRange === 'low' && nanny.rate <= 15) ||
            (filters.priceRange === 'medium' && nanny.rate > 15 && nanny.rate <= 25) ||
            (filters.priceRange === 'high' && nanny.rate > 25);

        return matchesSearch && matchesAvailability && matchesExperience && matchesSpecialization && matchesCertification && matchesLanguage && matchesPrice;
    });

    const getAvailabilityColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-500';
            case 'limited': return 'bg-yellow-500';
            case 'unavailable': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getAvailabilityText = (status) => {
        switch (status) {
            case 'available': return 'Available Now';
            case 'limited': return 'Limited Availability';
            case 'unavailable': return 'Currently Unavailable';
            default: return 'Unknown';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <Card className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white border-0 shadow-2xl">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-3">Available Nanny Services</h2>
                    <p className="text-pink-100 text-lg">
                        Find the perfect caregiver for your child. Browse our verified nannies and contact us to arrange services.
                    </p>
                </div>
            </Card>

            {/* Search and Filter Section */}
            <Card className="p-6">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search nannies by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <select
                            value={filters.availability}
                            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Availability</option>
                            <option value="available">Available Now</option>
                            <option value="limited">Limited</option>
                            <option value="unavailable">Unavailable</option>
                        </select>

                        <select
                            value={filters.experience}
                            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Experience</option>
                            <option value="0-2">0-2 years</option>
                            <option value="2-5">2-5 years</option>
                            <option value="5+">5+ years</option>
                        </select>

                        <select
                            value={filters.specialization}
                            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Specializations</option>
                            <option value="infant">Infant Care</option>
                            <option value="toddler">Toddler Care</option>
                            <option value="special">Special Needs</option>
                        </select>

                        <select
                            value={filters.certification}
                            onChange={(e) => setFilters({ ...filters, certification: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Certifications</option>
                            <option value="cpr">CPR Certified</option>
                            <option value="first aid">First Aid</option>
                            <option value="montessori">Montessori</option>
                        </select>

                        <select
                            value={filters.language}
                            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Languages</option>
                            <option value="english">English</option>
                            <option value="bengali">Bengali</option>
                            <option value="hindi">Hindi</option>
                        </select>

                        <select
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        >
                            <option value="all">All Prices</option>
                            <option value="low">$0-$15/hr</option>
                            <option value="medium">$15-$25/hr</option>
                            <option value="high">$25+/hr</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{filteredNannies.length} nannies found</span>
                        {Object.values(filters).some(f => f !== 'all') && (
                            <button
                                onClick={() => setFilters({
                                    availability: 'all',
                                    experience: 'all',
                                    specialization: 'all',
                                    certification: 'all',
                                    language: 'all',
                                    priceRange: 'all'
                                })}
                                className="text-pink-600 hover:text-pink-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="animate-pulse">
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded"></div>
                                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredNannies.length === 0 && (
                <Card className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={40} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No nannies available</h3>
                    <p className="text-slate-500 mb-4">
                        {searchTerm || Object.values(filters).some(f => f !== 'all')
                            ? 'No nannies match your search criteria. Try adjusting your filters.'
                            : 'No nannies available at the moment. Please check back later or contact admin.'}
                    </p>
                    {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
                        <Button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({
                                    availability: 'all',
                                    experience: 'all',
                                    specialization: 'all',
                                    certification: 'all',
                                    language: 'all',
                                    priceRange: 'all'
                                });
                            }}
                            variant="outline"
                        >
                            Clear search and filters
                        </Button>
                    )}
                </Card>
            )}

            {/* Nanny Cards Grid */}
            {!loading && filteredNannies.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNannies.map((nanny, index) => (
                        <Card
                            key={nanny.id}
                            className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Favorite Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(nanny.id);
                                }}
                                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <Heart
                                    size={20}
                                    className={favorites.includes(nanny.id) ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}
                                />
                            </button>

                            {/* Profile Photo and Info */}
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-shrink-0">
                                    {nanny.img ? (
                                        <img
                                            src={nanny.img}
                                            alt={nanny.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                                            {nanny.name.charAt(0)}
                                        </div>
                                    )}

                                    {/* Verified Badge */}
                                    {nanny.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                                            <Shield size={14} className="text-white" />
                                        </div>
                                    )}

                                    {/* Availability Indicator */}
                                    <div className={`absolute -top-1 -left-1 w-5 h-5 ${getAvailabilityColor(nanny.availabilityStatus)} rounded-full border-2 border-white shadow-lg`}></div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-slate-800 truncate">{nanny.name}</h3>
                                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold mb-1">
                                        <Star size={14} fill="currentColor" />
                                        <span>{nanny.rating}</span>
                                        <span className="text-slate-400 text-xs">({nanny.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin size={12} />
                                        <span>{nanny.area}</span>
                                    </div>
                                    <Badge color={`${getAvailabilityColor(nanny.availabilityStatus)} text-white text-xs mt-1`}>
                                        {getAvailabilityText(nanny.availabilityStatus)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {nanny.bio}
                            </p>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <Briefcase size={14} />
                                        Experience
                                    </span>
                                    <span className="font-bold text-slate-800">{nanny.experience}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <Award size={14} />
                                        Specialty
                                    </span>
                                    <span className="font-bold text-slate-800">{nanny.specialty}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <Clock size={14} />
                                        Rate
                                    </span>
                                    <span className="font-bold text-pink-600">${nanny.rate}/hour</span>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {nanny.languages?.slice(0, 3).map((lang, i) => (
                                    <Badge key={i} color="bg-blue-50 text-blue-700 text-xs">
                                        {lang}
                                    </Badge>
                                ))}
                            </div>

                            {/* Certifications */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {nanny.certifications?.slice(0, 2).map((cert, i) => (
                                    <Badge key={i} color="bg-green-50 text-green-700 text-xs">
                                        <CheckCircle size={12} className="mr-1" />
                                        {cert}
                                    </Badge>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => openProfileModal(nanny)}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                >
                                    View Full Profile
                                </Button>
                                <Button
                                    onClick={() => openContactModal(nanny)}
                                    size="sm"
                                    className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-200 text-xs"
                                >
                                    Contact Admin
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Full Profile Modal */}
            {showProfileModal && selectedNanny && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-t-3xl z-10">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex items-center gap-6">
                                {selectedNanny.img ? (
                                    <img
                                        src={selectedNanny.img}
                                        alt={selectedNanny.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-xl">
                                        {selectedNanny.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-3xl font-bold">{selectedNanny.name}</h2>
                                        {selectedNanny.verified && (
                                            <div className="bg-blue-500 rounded-full p-1.5">
                                                <Shield size={18} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-pink-100 text-lg mb-2">{selectedNanny.specialty} Specialist</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Star size={16} fill="currentColor" className="text-yellow-300" />
                                            <span className="font-bold">{selectedNanny.rating}</span>
                                            <span className="text-pink-100">({selectedNanny.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{selectedNanny.area}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8">
                            {/* About Section */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Baby className="text-pink-500" />
                                    About
                                </h3>
                                <p className="text-slate-600 leading-relaxed">{selectedNanny.bio}</p>
                            </div>

                            {/* Experience & Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                        <Briefcase className="text-pink-500" />
                                        Experience
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Years of Experience</span>
                                            <span className="font-bold text-slate-800">{selectedNanny.experience}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Hourly Rate</span>
                                            <span className="font-bold text-pink-600">${selectedNanny.rate}/hour</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Availability</span>
                                            <Badge color={`${getAvailabilityColor(selectedNanny.availabilityStatus)} text-white`}>
                                                {getAvailabilityText(selectedNanny.availabilityStatus)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                        <Languages className="text-blue-500" />
                                        Languages
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNanny.languages?.map((lang, i) => (
                                            <Badge key={i} color="bg-blue-100 text-blue-700">
                                                {lang}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Certifications */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <GraduationCap className="text-pink-500" />
                                    Certifications & Qualifications
                                </h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {selectedNanny.certifications?.map((cert, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                            <span className="font-medium text-slate-800">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Button */}
                            <div className="pt-6 border-t border-slate-200">
                                <Button
                                    onClick={() => {
                                        setShowProfileModal(false);
                                        openContactModal(selectedNanny);
                                    }}
                                    size="lg"
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200"
                                >
                                    <Phone size={20} className="mr-2" />
                                    Contact Admin About {selectedNanny.name}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Admin Modal */}
            {showContactModal && selectedNanny && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-t-3xl relative">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Interested in {selectedNanny.name}?</h2>
                            <p className="text-pink-100">Contact our admin team to arrange nanny services</p>
                        </div>

                        {/* Contact Options */}
                        <div className="p-8 space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-blue-500 rounded-full">
                                        <AlertCircle size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-1">How It Works</h3>
                                        <p className="text-sm text-slate-600">
                                            Contact our admin team using any of the methods below. They will discuss {selectedNanny.name}'s availability,
                                            rates, and help you schedule services for your child.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Methods */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-slate-800">Contact Methods</h3>

                                {/* Phone */}
                                <a
                                    href="tel:+8801234567890"
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-lg transition-all group"
                                >
                                    <div className="p-3 bg-green-500 rounded-full group-hover:scale-110 transition-transform">
                                        <Phone size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">Call Admin Office</p>
                                        <p className="text-sm text-slate-600">+880 1234-567890</p>
                                        <p className="text-xs text-slate-500 mt-1">Available: Mon-Sat, 9 AM - 6 PM</p>
                                    </div>
                                    <ChevronRight className="text-green-600" />
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:admin@kiddoz.com?subject=Inquiry about ${selectedNanny.name}&body=Hi, I'm interested in hiring ${selectedNanny.name} for my child ${student?.name || '[Child Name]'}. Please contact me to discuss availability and arrangements.`}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-lg transition-all group"
                                >
                                    <div className="p-3 bg-blue-500 rounded-full group-hover:scale-110 transition-transform">
                                        <Mail size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">Email Admin</p>
                                        <p className="text-sm text-slate-600">admin@kiddoz.com</p>
                                        <p className="text-xs text-slate-500 mt-1">Response within 24 hours</p>
                                    </div>
                                    <ChevronRight className="text-blue-600" />
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/8801234567890?text=Hi, I'm interested in hiring ${selectedNanny.name} for my child. Please contact me to discuss availability.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl hover:shadow-lg transition-all group"
                                >
                                    <div className="p-3 bg-green-600 rounded-full group-hover:scale-110 transition-transform">
                                        <MessageSquare size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">WhatsApp</p>
                                        <p className="text-sm text-slate-600">Chat with admin instantly</p>
                                        <p className="text-xs text-slate-500 mt-1">Quick responses during office hours</p>
                                    </div>
                                    <ChevronRight className="text-green-600" />
                                </a>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={18} className="text-slate-600" />
                                    <h4 className="font-bold text-slate-800">Office Hours</h4>
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NannyBooking;
