import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { BookOpen, ScanFace, Activity, ChevronDown, CheckCircle, Clock, Heart, Thermometer, User, Users } from 'lucide-react';
import LiveViewYOLO from '../ai/LiveViewYOLO';
import Card from '../ui/Card';

const ParentDashboard = ({ user, setView, db, appId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  const currentChild = students.find(s => s.docId === selectedStudentId) || students[0];

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `artifacts/${appId}/public/data/students`), where('parentId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
      setStudents(data);
      if(data.length > 0 && !selectedStudentId) setSelectedStudentId(data[0].docId);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white pt-10 pb-32 px-4 rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parent Portal</h1>
            <p className="text-purple-200">Viewing updates for:</p>
            {students.length > 0 ? (
               <div className="mt-2 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm">{currentChild?.name.charAt(0)}</div>
                  <select className="bg-transparent border-none text-white font-bold outline-none cursor-pointer pr-8" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                    {students.map(s => (<option key={s.docId} value={s.docId} className="text-slate-800">{s.name} ({s.id})</option>))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 pointer-events-none"/>
               </div>
            ) : (
               <div className="mt-4 p-4 bg-white/10 rounded-xl max-w-sm">
                  <p className="mb-3 text-sm">No children enrolled yet.</p>
                  <button onClick={() => setView('enroll')} className="bg-amber-400 text-purple-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md">Enroll Your First Child</button>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'live', label: 'YOLO Live View', icon: ScanFace },
            { id: 'health', label: 'Health Data', icon: Activity },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-white text-purple-700 shadow-xl scale-105' : 'bg-purple-900/40 text-purple-100 hover:bg-white/20 backdrop-blur-lg'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-500">
          {!currentChild ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-3xl">
               <Users size={48} className="mx-auto mb-4 opacity-50"/> <p>No student selected or database empty.</p>
            </div>
          ) : (
             <>
             {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><CheckCircle size={24}/></div>
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Status</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{currentChild.attendance || '--'}</h3>
                      <p className="text-slate-500 text-sm">Today's Attendance</p>
                    </div>
                    {/* Add other stat cards (Meal, Mood, Temp) following original design */}
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                       <h3 className="font-bold text-slate-600 mb-4 ml-1">Live Surveillance Preview</h3>
                       <LiveViewYOLO student={currentChild} />
                    </div>
                    <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0">
                      <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><User size={24} className="text-purple-200" /> Child Profile</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-purple-200">Full Name</span><span className="font-bold">{currentChild.name}</span></div>
                         <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-purple-200">Student ID</span><span className="font-mono bg-white/20 px-2 rounded text-sm">{currentChild.id}</span></div>
                      </div>
                    </Card>
                  </div>
                </div>
             )}
             {activeTab === 'live' && <div className="max-w-4xl mx-auto"><LiveViewYOLO student={currentChild} /></div>}
             {activeTab === 'health' && <Card className="text-center py-20"><Activity size={64} className="mx-auto text-purple-300 mb-6" /><h2 className="text-3xl font-bold text-purple-900">Health Data for {currentChild.name}</h2></Card>}
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;