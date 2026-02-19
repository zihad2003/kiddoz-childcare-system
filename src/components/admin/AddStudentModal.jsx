import React, { useState, useEffect } from 'react';
import { User, Calendar, Shield, CreditCard, XCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded, studentToEdit }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        plan: 'Growth Scholar',
        parentId: '',
        homeAddress: '',
        emergencyContact: ''
    });

    useEffect(() => {
        if (studentToEdit) {
            setFormData({
                fullName: studentToEdit.fullName || studentToEdit.name || '',
                dateOfBirth: studentToEdit.dateOfBirth || '',
                gender: studentToEdit.gender || 'Male',
                plan: studentToEdit.plan || 'Growth Scholar',
                parentId: studentToEdit.parentId || '',
                homeAddress: studentToEdit.homeAddress || '',
                emergencyContact: studentToEdit.emergencyContact || ''
            });
        } else {
            setFormData({
                fullName: '',
                dateOfBirth: '',
                gender: 'Male',
                plan: 'Growth Scholar',
                parentId: '',
                homeAddress: '',
                emergencyContact: ''
            });
        }
    }, [studentToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let result;
        if (studentToEdit) {
            result = await studentService.updateStudent(studentToEdit.id, formData);
        } else {
            result = await studentService.addStudent(formData);
        }

        if (result.success) {
            addToast(`Student ${studentToEdit ? 'updated' : 'added'} successfully!`, 'success');
            if (onStudentAdded) onStudentAdded();
            onClose();
        } else {
            addToast(result.error || 'Operation failed', 'error');
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Student Enrollment" maxWidth="max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-4">
                    <p className="text-sm text-purple-700 font-medium">
                        Fill in the details below to add a new student to the relational database.
                        This will automatically set up their profile and initial billing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Student Full Name"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        icon={User}
                        required
                    />
                    <Input
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        icon={Calendar}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Gender"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                            { label: 'Other', value: 'Other' }
                        ]}
                    />
                    <Select
                        label="Growth Plan"
                        value={formData.plan}
                        onChange={e => setFormData({ ...formData, plan: e.target.value })}
                        options={[
                            { label: 'Little Explorer', value: 'Little Explorer' },
                            { label: 'Growth Scholar', value: 'Growth Scholar' },
                            { label: 'VIP Guardian', value: 'VIP Guardian' }
                        ]}
                    />
                </div>

                <div className="space-y-4">
                    <Input
                        label="Parent/Guardian ID (Optional)"
                        placeholder="e.g. U-12345"
                        value={formData.parentId}
                        onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                        icon={Shield}
                    />
                    <Input
                        label="Home Address"
                        placeholder="123 Care Lane, Dhaka"
                        value={formData.homeAddress}
                        onChange={e => setFormData({ ...formData, homeAddress: e.target.value })}
                    />
                    <Input
                        label="Emergency Contact"
                        placeholder="Name - Phone Number"
                        value={formData.emergencyContact}
                        onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={loading} className="flex-1 bg-purple-600 hover:bg-purple-700">Complete Enrollment</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStudentModal;
