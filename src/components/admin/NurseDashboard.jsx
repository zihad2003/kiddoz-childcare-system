import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { Users, Thermometer, Activity, Heart, Search, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { updateDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';

const NurseDashboard = ({ students, db, appId, user }) => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vitals, setVitals] = useState({ temp: '', notes: '', medication: '' });

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenVitals = (student) => {
        setSelectedStudent(student);
        setVitals({
            temp: student.temp || '98.6',
            notes: '',
            medication: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmitVitals = async () => {
        if (!selectedStudent) return;
        try {
            await updateDoc(doc(db, `artifacts/${appId}/public/data/students`, selectedStudent.docId), {
                temp: vitals.temp,
                lastVitalsCheck: serverTimestamp()
            });

            // Log the medical event
            await addDoc(collection(db, `artifacts/${appId}/public/data/notifications`), {
                studentId: selectedStudent.id,
                parentId: selectedStudent.parentId,
                title: 'Medical Log Updated',
                message: `Nurse ${user?.email || ''} logged vitals. Temp: ${vitals.temp}°F.`,
                details: { ...vitals, updatedBy: 'School Nurse' },
                timestamp: serverTimestamp(),
                read: false,
                type: 'health'
            });

            addToast(`Updated vitals for ${selectedStudent.name}`, 'success');
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            addToast('Failed to update vitals', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-teal-50 font-sans">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
                    <div>
                        <h1 className="text-2xl font-bold text-teal-900 flex items-center gap-3">
                            <Activity className="text-teal-600" /> School Nurse Station
                        </h1>
                        <p className="text-teal-600">Daily Health Monitoring & Medical Logs</p>
                    </div>
                    <div className="flex gap-4">
                        <Card className="px-4 py-2 bg-teal-50 border-teal-200 flex items-center gap-3">
                            <Heart className="text-red-500" size={20} />
                            <div>
                                <p className="text-xs text-teal-600 font-bold uppercase">Healthy</p>
                                <p className="text-xl font-bold text-teal-900">98%</p>
                            </div>
                        </Card>
                        <Card className="px-4 py-2 bg-red-50 border-red-200 flex items-center gap-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <div>
                                <p className="text-xs text-red-600 font-bold uppercase">Alerts</p>
                                <p className="text-xl font-bold text-red-900">2</p>
                            </div>
                        </Card>
                    </div>
                </header>

                {/* Search & Actions */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search student medical records..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-teal-100 shadow-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                    </div>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                        <FileText size={20} className="mr-2" /> Daily Report
                    </Button>
                </div>

                {/* Student Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map(student => (
                        <Card key={student.docId} className="border-l-4 border-l-teal-500 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{student.name}</h3>
                                        <p className="text-xs text-slate-500">ID: {student.id}</p>
                                    </div>
                                </div>
                                {student.temp && parseFloat(student.temp) > 99.5 ? (
                                    <Badge className="bg-red-100 text-red-600 animate-pulse"><AlertCircle size={12} className="mr-1" /> Fever</Badge>
                                ) : (
                                    <Badge className="bg-teal-100 text-teal-700"><CheckCircle size={12} className="mr-1" /> Stable</Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-lg text-sm">
                                <div className="text-slate-500">Temperature</div>
                                <div className="font-mono font-bold text-slate-700 text-right">{student.temp || '--'}°F</div>
                                <div className="text-slate-500">Allergies</div>
                                <div className="font-bold text-slate-700 text-right truncate">{student.allergies || 'None'}</div>
                            </div>

                            <Button onClick={() => handleOpenVitals(student)} variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                                <Thermometer size={18} className="mr-2" /> Log Vitals
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Vitals Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Medical Log: ${selectedStudent?.name}`}
                >
                    <div className="space-y-6">
                        <Input
                            label="Current Temperature (°F)"
                            type="number"
                            step="0.1"
                            value={vitals.temp}
                            onChange={e => setVitals({ ...vitals, temp: e.target.value })}
                            icon={Thermometer}
                        />
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nurse Notes & Observations</label>
                            <textarea
                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none h-32 resize-none"
                                placeholder="Describe symptoms, behavior, or treatment given..."
                                value={vitals.notes}
                                onChange={e => setVitals({ ...vitals, notes: e.target.value })}
                            />
                        </div>
                        <Button onClick={handleSubmitVitals} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                            Save Medical Log
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default NurseDashboard;
