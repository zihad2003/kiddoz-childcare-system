import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users, Clock, BookOpen, Search, Coffee, Moon } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LiveViewYOLO from '../ai/LiveViewYOLO';

import { studentService } from '../../services/studentService';

const TeacherDashboard = ({ students, user }) => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('classroom'); // classroom | live

    // Use local state for students to reflect immediate updates, 
    // assuming 'students' prop is initial state or handled by parent.
    // Ideally we should lift state up or refetch, but for now let's clone.
    const [localStudents, setLocalStudents] = useState(students);

    // Sync if parent updates
    React.useEffect(() => {
        setLocalStudents(students);
    }, [students]);

    const filteredStudents = localStudents.filter(s =>
        (s.name || s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleQuickAction = async (student, action) => {
        // Determine status update based on action
        let updates = {};
        let message = '';

        if (action === 'checkin') {
            updates = { attendance: 'Present' };
            message = 'Checked In';
        } else if (action === 'nap') {
            updates = { mood: 'Sleeping' };
            message = 'Started Nap';
        } else if (action === 'meal') {
            updates = { meal: 'Lunch eaten' };
            message = 'Finished Lunch';
        }

        try {
            await studentService.updateStudent(student.id, updates);
            addToast(`${student.fullName || student.name}: ${message}`, 'success');
        } catch (e) {
            console.error(e);
            addToast('Action failed', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 font-sans">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-secondary-100">
                    <div>
                        <h1 className="text-2xl font-bold text-orange-900 flex items-center gap-3">
                            <BookOpen className="text-secondary-600" /> Lead Teacher Portal
                        </h1>
                        <p className="text-secondary-600">Classroom Management & Activities</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('classroom')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'classroom' ? 'bg-secondary-100 text-orange-700' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            Classroom
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'live' ? 'bg-secondary-100 text-orange-700' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            Live View
                        </button>
                    </div>
                </header>

                {activeTab === 'live' ? (
                    <div className="animate-in fade-in duration-500">
                        <LiveViewYOLO />
                    </div>
                ) : (
                    <>
                        {/* Search & Stats */}
                        <div className="flex gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Find student..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-secondary-100 shadow-sm outline-none focus:ring-2 focus:ring-secondary-500/20"
                                />
                            </div>
                            <Card className="px-6 py-3 bg-white border-secondary-100  flex items-center gap-3">
                                <Users className="text-secondary-500" />
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-slate-800">{filteredStudents.filter(s => s.attendance === 'Present').length}</span>
                                    <span className="text-xs text-slate-500 uppercase font-bold">Present</span>
                                </div>
                            </Card>
                        </div>

                        {/* Student Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStudents.map(student => (
                                <Card key={student.id} className="hover:border-secondary-300 transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-400 to-red-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-secondary-200">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{student.name}</h3>
                                            <Badge className={`${student.attendance === 'Present' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {student.attendance || 'Absent'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleQuickAction(student, 'checkin')}
                                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                                        >
                                            <Clock size={16} /> Check In
                                        </button>
                                        <button
                                            onClick={() => handleQuickAction(student, 'meal')}
                                            className="p-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-secondary-100 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                                        >
                                            <Coffee size={16} /> Meal
                                        </button>
                                        <button
                                            onClick={() => handleQuickAction(student, 'nap')}
                                            className="p-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                                        >
                                            <Moon size={16} /> Nap
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
