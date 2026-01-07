import React, { useState } from 'react';
import { CheckCircle, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Section from '../ui/Section';
import Card from '../ui/Card';

const EnrollmentPage = ({ user, setView, db, appId, PLANS }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [childData, setChildData] = useState({ name: '', age: '', allergies: '', parentName: '', phone: '' });

  const handleEnroll = async () => {
    if (!user) { alert("Please login first."); setView('login'); return; }
    try {
      const studentId = `K-${Math.floor(1000 + Math.random() * 9000)}`;
      await addDoc(collection(db, `artifacts/${appId}/public/data/students`), {
        ...childData, id: studentId, parentId: user.uid, plan: selectedPlan.name,
        enrollmentDate: serverTimestamp(), temp: '98.6', mood: 'Neutral', attendance: 'Registered', meal: 'Not checked in', createdAt: serverTimestamp()
      });
      setFormStep(3);
    } catch (e) { alert("Enrollment failed"); }
  };

  if (formStep === 3) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg text-center py-16">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-600" /></div>
        <h2 className="text-3xl font-bold mb-4">Welcome to the Family!</h2>
        <button onClick={() => setView('dashboard')} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold">Go to Dashboard</button>
      </Card>
    </div>
  );

  // Return logic from original App.jsx filtered for plans/form UI...
  return (
    <div className="bg-slate-50 min-h-screen">
       {/* UI code from original EnrollmentPage component */}
    </div>
  );
};

export default EnrollmentPage;