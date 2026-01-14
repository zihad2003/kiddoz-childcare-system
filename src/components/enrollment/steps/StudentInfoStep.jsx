import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Badge from '../../ui/Badge';

const StudentInfoStep = ({ data, updateData, onNext, onBack, planName, errors = {} }) => {
    const handleChange = (field, value) => {
        updateData({ [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
            <Card className="p-8 md:p-10">
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-purple-600 flex items-center gap-2 mb-6 font-medium transition"><ArrowLeft size={18} /> Back to Plans</button>

                <div className="mb-8">
                    <Badge color="bg-purple-50 text-purple-700 border-purple-100 mb-4">Selected: {planName || "No Plan Selected"}</Badge>
                    <h2 className="text-3xl font-bold text-slate-900">Student Registration</h2>
                    <p className="text-slate-500 mt-2">Please fill in your child's details accurately.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Child's Full Name"
                            placeholder="e.g. Noah Smith"
                            value={data.name}
                            onChange={e => handleChange('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                        <Input
                            label="Age"
                            type="number"
                            placeholder="Years"
                            value={data.age}
                            onChange={e => handleChange('age', e.target.value)}
                            error={errors.age}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Gender"
                            options={[
                                { label: 'Boy', value: 'Boy' },
                                { label: 'Girl', value: 'Girl' },
                                { label: 'Prefer not to say', value: 'Other' }
                            ]}
                            value={data.gender}
                            onChange={e => handleChange('gender', e.target.value)}
                            error={errors.gender}
                            required
                        />
                        <Input
                            label="Allergies / Conditions"
                            placeholder="None or list specific..."
                            value={data.allergies}
                            onChange={e => handleChange('allergies', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Dietary Restrictions"
                            placeholder="e.g. Vegetarian, Halal"
                            value={data.dietaryRestrictions}
                            onChange={e => handleChange('dietaryRestrictions', e.target.value)}
                        />
                        <Input
                            label="Medical Conditions"
                            placeholder="e.g. Asthma (if none, leave blank)"
                            value={data.medicalConditions}
                            onChange={e => handleChange('medicalConditions', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Primary Doctor Name"
                            placeholder="Dr. Smith"
                            value={data.doctorName}
                            onChange={e => handleChange('doctorName', e.target.value)}
                        />
                        <Input
                            label="Doctor Phone"
                            placeholder="(555) 123-4567"
                            value={data.doctorPhone}
                            onChange={e => handleChange('doctorPhone', e.target.value)}
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Parent/Guardian Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Parent Name"
                                value={data.parentName}
                                onChange={e => handleChange('parentName', e.target.value)}
                                error={errors.parentName}
                                required
                                icon={Star}
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="(555) 000-0000"
                                value={data.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                                error={errors.phone}
                                required
                            />
                        </div>

                        <h3 className="font-bold text-slate-800 mb-4 mt-6">Emergency Contact (Other than Parent)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Emergency Contact Name"
                                placeholder="Grandparent, Aunt, etc."
                                value={data.emergencyName}
                                onChange={e => handleChange('emergencyName', e.target.value)}
                                error={errors.emergencyName}
                                required
                            />
                            <Input
                                label="Emergency Phone"
                                type="tel"
                                placeholder="(555) 999-8888"
                                value={data.emergencyPhone}
                                onChange={e => handleChange('emergencyPhone', e.target.value)}
                                error={errors.emergencyPhone}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" size="lg" className="w-full shadow-xl shadow-purple-200">
                            Continue to AI Setup
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default StudentInfoStep;
