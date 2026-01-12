import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft, Star, Shield, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import BiometricRegistration from './BiometricRegistration';

const EnrollmentPage = ({ user, db, appId, PLANS }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [childData, setChildData] = useState({
    name: '',
    age: '',
    gender: '',
    allergies: '',
    parentName: user?.displayName || '',
    phone: '',
    emergencyContact: ''
  });
  const [biometrics, setBiometrics] = useState({ face: null, body: null });

  // Handle final submission after biometric phase
  const handleEnrollmentComplete = async () => {
    if (!user) { navigate('/login'); return; }

    setIsLoading(true);
    try {
      const studentId = `K-${Math.floor(1000 + Math.random() * 9000)}`;

      // In a real app, upload images to storage here and get URLs
      // const faceUrl = await uploadImage(biometrics.face);

      await addDoc(collection(db, `artifacts/${appId}/public/data/students`), {
        ...childData,
        id: studentId,
        parentId: user.uid,
        plan: selectedPlan.name,
        enrollmentDate: serverTimestamp(),
        temp: '98.6',
        mood: 'Neutral',
        attendance: 'Registered',
        meal: 'Not checked in',
        hasBiometrics: true, // Marker for AI system
        createdAt: serverTimestamp()
      });

      setIsLoading(false);
      setFormStep(4); // Success Step
    } catch (e) {
      console.error(e);
      alert("Enrollment failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setFormStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStudentInfoSubmit = (e) => {
    e.preventDefault();
    setFormStep(3); // Go to Biometrics
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBiometricComplete = (images) => {
    setBiometrics(images);
    handleEnrollmentComplete();
  };

  if (formStep === 4) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg text-center py-16 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-100 shadow-xl">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-900">Welcome to the Family!</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          Enrollment & Biometric Setup Complete. Your child is now protected by KiddoZ AI safety systems.
        </p>
        <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full">
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Progress Stepper */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>

            {[1, 2, 3].map(step => (
              <div key={step} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${formStep >= step ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {step === 3 && formStep < 3 ? <Zap size={20} /> : step}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span>Select Plan</span>
            <span className="pl-8">Student Info</span>
            <span>AI Setup</span>
          </div>
        </div>

        {formStep === 1 && (
          <div className="animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Care Plan</h1>
              <p className="text-slate-500 text-lg">Flexible options designed for your family's needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div key={plan.id} className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${plan.popular ? 'border-purple-500 shadow-purple-200 ring-4 ring-purple-500/10' : 'border-transparent shadow-xl'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 font-medium ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    icon={ArrowRight}
                  >
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {formStep === 2 && (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
            <Card className="p-8 md:p-10">
              <button onClick={() => setFormStep(1)} className="text-slate-400 hover:text-purple-600 flex items-center gap-2 mb-6 font-medium transition"><ArrowLeft size={18} /> Back to Plans</button>

              <div className="mb-8">
                <Badge color="bg-purple-50 text-purple-700 border-purple-100 mb-4">Selected: {selectedPlan.name}</Badge>
                <h2 className="text-3xl font-bold text-slate-900">Student Registration</h2>
                <p className="text-slate-500 mt-2">Please fill in your child's details accurately.</p>
              </div>

              <form onSubmit={handleStudentInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Child's Full Name"
                    placeholder="e.g. Noah Smith"
                    value={childData.name}
                    onChange={e => setChildData({ ...childData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Age"
                    type="number"
                    placeholder="Years"
                    value={childData.age}
                    onChange={e => setChildData({ ...childData, age: e.target.value })}
                    required
                    className="w-full"
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
                    value={childData.gender}
                    onChange={e => setChildData({ ...childData, gender: e.target.value })}
                    required
                  />
                  <Input
                    label="Allergies / Conditions"
                    placeholder="None or list specific..."
                    value={childData.allergies}
                    onChange={e => setChildData({ ...childData, allergies: e.target.value })}
                  />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Parent/Guardian Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Parent Name"
                      value={childData.parentName}
                      onChange={e => setChildData({ ...childData, parentName: e.target.value })}
                      required
                      icon={Star}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={childData.phone}
                      onChange={e => setChildData({ ...childData, phone: e.target.value })}
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
        )}

        {formStep === 3 && (
          <BiometricRegistration
            onComplete={handleBiometricComplete}
            onBack={() => setFormStep(2)}
          />
        )}

      </div>
    </div>
  );
};

export default EnrollmentPage;