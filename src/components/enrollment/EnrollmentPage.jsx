import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { Zap, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { useEnrollmentForm } from '../../hooks/useEnrollmentForm';

import PaymentModal from '../dashboard/PaymentModal';
import BiometricRegistration from './BiometricRegistration';
import PlanSelectionStep from './steps/PlanSelectionStep';
import StudentInfoStep from './steps/StudentInfoStep';
import SuccessStep from './steps/SuccessStep';

const EnrollmentPage = ({ user, db, appId, PLANS }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Custom hook for state management (persistence, validation)
  const {
    formData,
    updateFormData,
    errors,
    validateStep,
    markStepVisited,
    clearForm,
    isLoaded
  } = useEnrollmentForm();

  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine active step
  const getStepNumber = (path) => {
    if (path.includes('success')) return 4;
    if (path.includes('AIsetup')) return 3;
    if (path.includes('kidsinfo')) return 2;
    return 1;
  };

  const currentStep = getStepNumber(location.pathname);

  useEffect(() => {
    if (isLoaded) {
      markStepVisited(location.pathname);
    }
  }, [location.pathname, isLoaded, markStepVisited]);

  // Navigation Handlers
  const handleNext = (nextPath, currentStepName) => {
    const isValid = validateStep(currentStepName);
    if (isValid) {
      navigate(nextPath);
      window.scrollTo(0, 0);
    } else {
      addToast('Please fill in all required fields.', 'error');
    }
  };

  const handleStepperClick = (step) => {
    // Non-blocking navigation
    let path = '/enroll';
    if (step === 2) path = '/enroll/kidsinfo';
    if (step === 3) path = '/enroll/AIsetup';
    navigate(path);
  };

  const finalizeEnrollment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Final Validation of ALL steps
    const isStep1Valid = validateStep('plan');
    const isStep2Valid = validateStep('student-info');

    if (!isStep1Valid || !isStep2Valid) {
      addToast('Please correct the errors in previous steps.', 'error');
      if (!isStep1Valid) navigate('/enroll');
      else if (!isStep2Valid) navigate('/enroll/kidsinfo');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentId = `K-${Math.floor(1000 + Math.random() * 9000)}`;
      const finalPlan = formData.plan || PLANS[1];

      await addDoc(collection(db, `artifacts/${appId}/public/data/students`), {
        ...formData.childData,
        id: studentId,
        parentId: user.uid,
        plan: finalPlan.name,
        enrollmentDate: serverTimestamp(),
        temp: '98.6',
        mood: 'Neutral',
        attendance: 'Registered',
        meal: 'Not checked in',
        hasBiometrics: !!(formData.biometrics.face || formData.biometrics.body),
        createdAt: serverTimestamp()
      });

      addToast('Enrollment & Subscription Successful!', 'success');
      clearForm();
      navigate('/enroll/success');
    } catch (e) {
      console.error("Enrollment error:", e);
      addToast('Enrollment (Demo) Successful!', 'success');
      navigate('/enroll/success');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20">
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={formData.plan?.price ? (typeof formData.plan.price === 'number' ? formData.plan.price : parseInt(formData.plan.price.replace('$', ''))) : 500}
        onComplete={finalizeEnrollment}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Stepper - Hide on Success Screen */}
        {currentStep < 4 && (
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>

              {[1, 2, 3].map(step => (
                <button
                  key={step}
                  onClick={() => handleStepperClick(step)}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 outline-none focus:ring-4 focus:ring-purple-200 
                    ${currentStep >= step ? 'bg-purple-600 text-white shadow-lg scale-110' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}
                  `}
                >
                  {step === 3 && currentStep < 3 ? <Zap size={20} /> : step}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <span className={`cursor-pointer ${currentStep === 1 ? 'text-purple-700' : ''}`} onClick={() => handleStepperClick(1)}>Select Plan</span>
              <span className={`pl-8 cursor-pointer ${currentStep === 2 ? 'text-purple-700' : ''}`} onClick={() => handleStepperClick(2)}>Student Info</span>
              <span className={`cursor-pointer ${currentStep === 3 ? 'text-purple-700' : ''}`} onClick={() => handleStepperClick(3)}>AI Setup</span>
            </div>

            {/* Show error hint if validation failed somewhere but we moved on */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> Some steps have incomplete information.
                </div>
              </div>
            )}
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <PlanSelectionStep
              PLANS={PLANS}
              selectedPlan={formData.plan}
              onSelect={(plan) => updateFormData('root', { plan })}
              onNext={() => handleNext('/enroll/kidsinfo', 'plan')}
            />
          } />

          <Route path="kidsinfo" element={
            <StudentInfoStep
              data={formData.childData}
              updateData={(data) => updateFormData('childData', data)}
              onNext={() => handleNext('/enroll/AIsetup', 'student-info')}
              onBack={() => navigate('/enroll')}
              errors={errors}
              planName={formData.plan?.name}
            />
          } />

          <Route path="AIsetup" element={
            <BiometricRegistration
              defaultImages={formData.biometrics}
              onComplete={(images) => {
                updateFormData('biometrics', images);
                setShowPayment(true);
              }}
              onBack={() => navigate('/enroll/kidsinfo')}
            />
          } />

          <Route path="success" element={
            <SuccessStep
              planName={formData.plan?.name}
              onGoDashboard={() => navigate('/dashboard')}
            />
          } />
        </Routes>
      </div>
    </div>
  );
};

export default EnrollmentPage;