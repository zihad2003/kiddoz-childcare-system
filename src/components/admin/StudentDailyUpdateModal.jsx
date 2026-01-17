import React, { useState, useEffect } from 'react';
import { Thermometer, Utensils, AlertCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import HealthLogs from './HealthLogs';
import DoctorUpload from './DoctorUpload';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const StudentDailyUpdateModal = ({
    isOpen,
    onClose,
    student,
    user,
    currentRole = 'Staff',
    onUpdate // Callback to refresh parent list if needed
}) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [statsForm, setStatsForm] = useState({
        temp: '',
        mood: '',
        attendance: '',
        meal: '',
        mealType: '',
        mealAmount: '',
        foodDetails: '',
        medName: '',
        medDosage: '',
        medGiven: false,
        activityType: '',
        activityDetails: '',
        notes: '',
        observations: '',
        activeModalTab: 'vitals'
    });

    useEffect(() => {
        if (student) {
            setStatsForm({
                temp: student.temp || '98.6',
                mood: student.mood || 'Neutral',
                attendance: student.attendance || 'Present',
                meal: student.meal || 'Not checked',
                mealType: student.mealType || '',
                mealAmount: student.mealAmount || '',
                foodDetails: student.foodDetails || '',
                medName: student.medName || '',
                medDosage: student.medDosage || '',
                medGiven: student.medGiven || false,
                activityType: student.activityType || '',
                activityDetails: student.activityDetails || '',
                notes: student.notes || '',
                observations: student.observations || '',
                activeModalTab: 'vitals'
            });
        }
    }, [student, isOpen]);

    const handleUpdateStats = async () => {
        if (!student) return;
        setLoading(true);
        try {
            // Prepare the update object, filtering out undefined or UI-only fields if necessary
            const { activeModalTab, ...dataToSave } = statsForm;

            // Update student record
            await api.updateStudent(student.id, dataToSave);

            // Add notification for parent
            await api.addNotification({
                studentId: student.id,
                parentId: student.parentId || 'unknown',
                title: `${currentRole === 'nurse' ? 'Medical Update' : 'Daily Activity Update'}`,
                message: `${student.name}'s status updated by ${currentRole}.`,
                details: {
                    ...dataToSave,
                    updatedBy: `${currentRole} (${user?.email || 'Staff'})`
                },
                type: 'health'
            });

            addToast(`Updated stats for ${student.name}`, 'success');
            if (onUpdate) onUpdate(); // Notify parent component
            onClose();
        } catch (e) {
            console.error(e);
            addToast("Update failed. Please try again.", 'error');
        }
        setLoading(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Student Management: ${student?.name}`}
            maxWidth="max-w-4xl"
        >
            <div className="flex gap-4 mb-6 border-b border-slate-100">
                {['vitals', 'logs', 'docs'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setStatsForm(prev => ({ ...prev, activeModalTab: tab }))}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors capitalize ${statsForm.activeModalTab === tab ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab === 'docs' ? 'Medical Docs' : tab}
                    </button>
                ))}
            </div>

            {(!statsForm.activeModalTab || statsForm.activeModalTab === 'vitals') && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 h-[60vh] overflow-y-auto pr-2">

                    {/* Vitals Section */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Thermometer size={18} className="text-purple-600" /> Vitals & Wellness
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Temperature (°F)"
                                value={statsForm.temp}
                                onChange={e => setStatsForm({ ...statsForm, temp: e.target.value })}
                                placeholder="98.6"
                            />
                            <Select
                                label="Mood"
                                value={statsForm.mood}
                                onChange={e => setStatsForm({ ...statsForm, mood: e.target.value })}
                                options={[
                                    { label: 'Happy', value: 'Happy' },
                                    { label: 'Neutral', value: 'Neutral' },
                                    { label: 'Tired', value: 'Tired' },
                                    { label: 'Crying', value: 'Crying' },
                                    { label: 'Sick', value: 'Sick' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Meal Tracker */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Utensils size={18} className="text-orange-600" /> Meal Intake
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Meal Type"
                                value={statsForm.mealType || ''}
                                onChange={e => setStatsForm({ ...statsForm, mealType: e.target.value })}
                                options={[
                                    { label: 'Breakfast', value: 'Breakfast' },
                                    { label: 'Morning Snack', value: 'Snack 1' },
                                    { label: 'Lunch', value: 'Lunch' },
                                    { label: 'Afternoon Snack', value: 'Snack 2' },
                                ]}
                            />
                            <Select
                                label="Amount Eaten"
                                value={statsForm.mealAmount || ''}
                                onChange={e => setStatsForm({ ...statsForm, mealAmount: e.target.value })}
                                options={[
                                    { label: 'None (0%)', value: '0%' },
                                    { label: 'Some (25%)', value: '25%' },
                                    { label: 'Half (50%)', value: '50%' },
                                    { label: 'Most (75%)', value: '75%' },
                                    { label: 'All (100%)', value: '100%' },
                                ]}
                            />
                        </div>
                        <div className="mt-3">
                            <Input
                                label="Food Details (Optional)"
                                placeholder="e.g. Rice, Chicken, Veggies"
                                value={statsForm.foodDetails || ''}
                                onChange={e => setStatsForm({ ...statsForm, foodDetails: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Medicine Admin */}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-600" /> Medicine Administration
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Medicine Name"
                                placeholder="e.g. Tylenol"
                                value={statsForm.medName || ''}
                                onChange={e => setStatsForm({ ...statsForm, medName: e.target.value })}
                            />
                            <Input
                                label="Dosage & Time"
                                placeholder="e.g. 5ml at 12:00 PM"
                                value={statsForm.medDosage || ''}
                                onChange={e => setStatsForm({ ...statsForm, medDosage: e.target.value })}
                            />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="medGiven"
                                checked={statsForm.medGiven || false}
                                onChange={e => setStatsForm({ ...statsForm, medGiven: e.target.checked })}
                                className="w-4 h-4 text-red-600 rounded"
                            />
                            <label htmlFor="medGiven" className="text-sm font-bold text-red-700">Confirm Medicine Administered</label>
                        </div>
                    </div>

                    {/* Activity / Sleep */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Clock size={18} className="text-blue-600" /> Activity & Sleep
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Log Activity"
                                value={statsForm.activityType || ''}
                                onChange={e => setStatsForm({ ...statsForm, activityType: e.target.value })}
                                options={[
                                    { label: 'Nap Time', value: 'Nap' },
                                    { label: 'Potty/Diaper', value: 'Potty' },
                                    { label: 'Outdoor Play', value: 'Play' },
                                    { label: 'Learning', value: 'Learning' },
                                ]}
                            />
                            <Input
                                label="Duration / Details"
                                placeholder="e.g. 1 hour or Wet/Dry"
                                value={statsForm.activityDetails || ''}
                                onChange={e => setStatsForm({ ...statsForm, activityDetails: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Observations (Message to Parent)</label>
                        <textarea
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 outline-none h-24"
                            placeholder="Details for parent to see..."
                            value={statsForm.observations}
                            onChange={e => setStatsForm({ ...statsForm, observations: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3 sticky bottom-0 bg-white border-t border-slate-100 p-4 shadow-lg -mx-4 -mb-6 mt-4 z-10">
                        <Button onClick={onClose} variant="ghost" className="flex-1">Cancel</Button>
                        <Button onClick={handleUpdateStats} isLoading={loading} className="flex-1">Save Daily Update</Button>
                    </div>
                </div>
            )}

            {statsForm.activeModalTab === 'logs' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <HealthLogs student={student} />
                </div>
            )}

            {statsForm.activeModalTab === 'docs' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <DoctorUpload studentId={student?.id} uploader={user} appId={appId} db={db} />
                </div>
            )}
        </Modal>
    );
};

export default StudentDailyUpdateModal;
