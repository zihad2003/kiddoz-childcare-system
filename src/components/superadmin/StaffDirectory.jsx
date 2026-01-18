import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, UserCheck } from 'lucide-react';
import api from '../../services/api';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const StaffDirectory = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await api.getStaffAll();
                setStaff(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.position?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Global Staff Directory</h2>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <Input
                    placeholder="Search staff by name or position..."
                    icon={Search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-3 text-center p-10">Loading...</div> :
                    filteredStaff.map(member => (
                        <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
                            <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                                <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                                <p className="text-primary-600 text-sm font-medium mb-1">{member.position}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                                    <Mail size={12} /> {member.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Phone size={12} /> {member.phone}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default StaffDirectory;
