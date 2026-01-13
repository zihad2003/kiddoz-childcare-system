import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft, Star, Shield, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import BiometricRegistration from './BiometricRegistration';
import { useToast } from '../../context/ToastContext';

const EnrollmentPage = ({ user, db, appId, PLANS }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (location.state?.plan) return location.state.plan;
    if (location.pathname.includes('/kidsinfo') || location.pathname.includes('/AIsetup')) {
      return PLANS[1]; // Default to "Growth Scholar"
    }
    return null;
  });

  const [childData, setChildData] = useState(location.state?.childData || {
    name: '',
    age: '',
    gender: '',
    allergies: '',
    parentName: user?.displayName || '',
    phone: '',
    emergencyContact: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [biometrics, setBiometrics] = useState({ face: null, body: null });

  // Determine current step for progress bar
  let currentStep = 1;
  if (location.pathname.includes('/kidsinfo')) currentStep = 2;
  if (location.pathname.includes('/AIsetup')) currentStep = 3;
  if (location.pathname.includes('/success')) currentStep = 4;

  // Ensure state is synced
  useEffect(() => {
    if (location.state?.plan) {
      setSelectedPlan(location.state.plan);
    }
    // Note: Default plan for direct access is now handled in initial state


    if (location.state?.childData) {
      setChildData(location.state.childData);
    }
  }, [location.state, location.pathname]);

  const handlePlanSelect = (plan) => {
    console.log("Plan selected:", plan);
    setSelectedPlan(plan);
    navigate('/enroll/kidsinfo', { state: { plan } });
    window.scrollTo(0, 0);
  };

  const handleStudentInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Student info submitted");
    navigate('/enroll/AIsetup', { state: { plan: selectedPlan, childData } });
    window.scrollTo(0, 0);
  };

  const handleBiometricComplete = (images) => {
    console.log("Biometrics completed");
    setBiometrics(images);
    handleEnrollmentComplete(images);
  };

  const handleEnrollmentComplete = async (images) => {
    if (!user) { navigate('/login'); return; }

    setIsLoading(true);
    try {
      const studentId = `K-${Math.floor(1000 + Math.random() * 9000)}`;

      // Ensure we have a plan even if direct access happened
      const finalPlan = selectedPlan || PLANS[1];

      await addDoc(collection(db, `artifacts/${appId}/public/data/students`), {
        ...childData,
        id: studentId,
        parentId: user.uid,
        plan: finalPlan.name,
        enrollmentDate: serverTimestamp(),
        temp: '98.6',
        mood: 'Neutral',
        attendance: 'Registered',
        meal: 'Not checked in',
        hasBiometrics: true,
        createdAt: serverTimestamp()
      });

      addToast('Enrollment completed successfully! Welcome to the family.', 'success');
      setIsLoading(false);
      navigate('/enroll/success');
    } catch (e) {
      console.error("Enrollment error:", e);
      alert("Enrollment failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Views for each step
  const PlanSelection = () => (
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
  );

  const StudentInfo = () => {
    // Removed redirect check to allow direct access
    // if (!selectedPlan) return <Navigate to="/enroll" />;

    return (
      <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
        <Card className="p-8 md:p-10">
          <button onClick={() => navigate('/enroll')} className="text-slate-400 hover:text-purple-600 flex items-center gap-2 mb-6 font-medium transition"><ArrowLeft size={18} /> Back to Plans</button>

          <div className="mb-8">
            <Badge color="bg-purple-50 text-purple-700 border-purple-100 mb-4">Selected: {selectedPlan?.name || "Growth Scholar"}</Badge>
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
    );
  };

  const AISetup = () => {
    // Removed redirect check to allow direct access
    // if (!selectedPlan) return <Navigate to="/enroll" />;
    return (
      <BiometricRegistration
        onComplete={handleBiometricComplete}
        onBack={() => navigate('/enroll/kidsinfo', { state: { plan: selectedPlan, childData } })}
      />
    );
  };

  const SuccessView = () => (
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

        {/* Progress Stepper - Hide on Success Screen */}
        {currentStep < 4 && (
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>

              {[1, 2, 3].map(step => (
                <div key={step} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${currentStep >= step ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-slate-200 text-slate-500'}`}>
                  {step === 3 && currentStep < 3 ? <Zap size={20} /> : step}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span>Select Plan</span>
              <span className="pl-8">Student Info</span>
              <span>AI Setup</span>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<PlanSelection />} />
          <Route path="kidsinfo" element={<StudentInfo />} />
          <Route path="AIsetup" element={<AISetup />} />
          <Route path="success" element={<SuccessView />} />
        </Routes>
      </div>
    </div>
  );
};

export default EnrollmentPage;