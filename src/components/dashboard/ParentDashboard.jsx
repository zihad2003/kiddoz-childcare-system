import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { BookOpen, ScanFace, Activity, ChevronDown, CheckCircle, Clock, Heart, Thermometer, User, Users, Utensils, Smile, FileText } from 'lucide-react';
import LiveViewYOLO from '../ai/LiveViewYOLO';
import ResourceTab from './ResourceTab';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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
      if (data.length > 0 && !selectedStudentId) setSelectedStudentId(data[0].docId);
    });
    return () => unsub();
  }, [user]);

  const StatCard = ({ icon: Icon, color, label, value, subtext }) => (
    <Card className="border-0 shadow-lg relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500 ${color.text}`}>
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <div className={`p-3 rounded-2xl w-fit mb-4 ${color.bg} ${color.text}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{value || '--'}</h3>
        <p className="font-semibold text-slate-600 text-sm">{label}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white pt-10 pb-32 px-4 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div>
            <Badge color="bg-purple-500/30 text-purple-100 border-0 mb-4 backdrop-blur-md">Welcome Back, {user?.displayName}</Badge>
            <h1 className="text-4xl font-bold mb-2">Parent Portal</h1>
            <div className="flex items-center gap-3 text-purple-200">
              <span>Viewing updates for:</span>
              {students.length > 0 && (
                <div className="relative group">
                  <select
                    className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl pl-4 pr-10 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-white/50"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    {students.map(s => (<option key={s.docId} value={s.docId} className="text-slate-800">{s.name}</option>))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {students.length === 0 && (
            <Button onClick={() => setView('enroll')} variant="secondary">
              Enroll Your First Child
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-3 mb-8 pb-4 hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'live', label: 'YOLO Live View', icon: ScanFace },
            { id: 'health', label: 'Health Data', icon: Activity },
            { id: 'resources', label: 'Resources', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-xl scale-105'
                  : 'bg-purple-900/40 text-purple-100 hover:bg-white/10 backdrop-blur-lg'}
              `}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          {!currentChild ? (
            <div className="text-center py-24 text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-slate-300" />
              </div>
              <p className="text-lg">No student selected or active.</p>
              <Button onClick={() => setView('enroll')} variant="outline" className="mt-4">Enroll Now</Button>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      icon={Clock}
                      color={{ bg: 'bg-indigo-100', text: 'text-indigo-600' }}
                      label="Today's Attendance"
                      value={currentChild.attendance}
                      subtext="Status updated live"
                    />
                    <StatCard
                      icon={Thermometer}
                      color={{ bg: 'bg-rose-100', text: 'text-rose-600' }}
                      label="Current Temp"
                      value={`${currentChild.temp}°F`}
                      subtext="Normal Range: 97-99°F"
                    />
                    <StatCard
                      icon={Smile}
                      color={{ bg: 'bg-amber-100', text: 'text-amber-600' }}
                      label="Daily Mood"
                      value={currentChild.mood}
                      subtext="Assessed by staff"
                    />
                    <StatCard
                      icon={Utensils}
                      color={{ bg: 'bg-emerald-100', text: 'text-emerald-600' }}
                      label="Last Meal"
                      value={currentChild.meal}
                      subtext="Nutritional tracking"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2"><ScanFace className="text-purple-600" /> Live Surveillance Preview</h3>
                        <Badge color="bg-red-100 text-red-600 animate-pulse">LIVE</Badge>
                      </div>
                      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-slate-200">
                        <LiveViewYOLO student={currentChild} />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white border-0 h-full">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl backdrop-blur-md shadow-inner">
                            {currentChild.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentChild.name}</h3>
                            <p className="text-purple-200 text-sm">Student ID: {currentChild.id}</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                            <span className="text-purple-200 text-sm block mb-1">Current Plan</span>
                            <span className="font-bold text-lg">{currentChild.plan}</span>
                          </div>

                          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                            <span className="text-purple-200 text-sm block mb-1">Primary Guardian</span>
                            <span className="font-bold text-lg">{currentChild.parentName}</span>
                          </div>

                          <Button className="w-full bg-white text-purple-900 hover:bg-purple-50 border-0 shadow-lg" variant="secondary">
                            View Full Profile
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'live' && (
                <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl ring-8 ring-slate-200 bg-black">
                  <LiveViewYOLO student={currentChild} />
                </div>
              )}

              {activeTab === 'health' && (
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Nutrition Card */}
                    <Card className="p-6">
                      <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                        <Utensils className="text-emerald-500" /> Weekly Nutrition
                      </h3>
                      <div className="flex items-end justify-between h-48 px-4 border-b border-slate-100 pb-2 gap-2">
                        {[65, 80, 100, 90, 85, 95, 100].map((h, i) => (
                          <div key={i} className="w-full relative group">
                            <div
                              className="bg-emerald-500/20 hover:bg-emerald-500 rounded-t-xl transition-all duration-300 w-full relative"
                              style={{ height: `${h}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}%
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 mt-2 block text-center font-bold">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 mt-4 text-center">Percentage of meals finished per day</p>
                    </Card>

                    {/* Recent Health Activity Log */}
                    <Card className="p-0 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                          <Activity className="text-purple-600" /> Recent Activity
                        </h3>
                        <Badge color="bg-purple-100 text-purple-700">This Week</Badge>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {[
                          { icon: Thermometer, color: "text-rose-500 bg-rose-50", title: "Temperature Check", time: "Today, 8:30 AM", val: "98.6°F" },
                          { icon: Smile, color: "text-amber-500 bg-amber-50", title: "Mood Update", time: "Today, 10:15 AM", val: "Happy" },
                          { icon: Utensils, color: "text-emerald-500 bg-emerald-50", title: "Lunch Time", time: "Yesterday, 12:00 PM", val: "Finished" },
                          { icon: Clock, color: "text-blue-500 bg-blue-50", title: "Nap Time", time: "Yesterday, 1:00 PM", val: "1hr 30m" },
                        ].map((item, i) => (
                          <div key={i} className="p-4 hover:bg-slate-50 transition flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                              <item.icon size={24} />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-bold text-slate-800">{item.title}</h4>
                              <p className="text-xs text-slate-400">{item.time}</p>
                            </div>
                            <div className="font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                              {item.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 relative overflow-hidden">
                      <div className="relative z-10 p-2">
                        <Heart size={48} className="mb-4 text-white/50" />
                        <h3 className="text-4xl font-bold mb-1">98.6°F</h3>
                        <p className="text-purple-100 font-medium mb-6">Average Body Temp</p>
                        <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-white/80"></div>
                        </div>
                        <p className="text-xs text-white/60 mt-2">Consistent within healthy range</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Reports Download</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start text-slate-600" size="sm">
                          <FileText size={16} className="mr-2 text-red-500" /> Monthly_Report_Jan.pdf
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-slate-600" size="sm">
                          <FileText size={16} className="mr-2 text-red-500" /> Vaccination_Records.pdf
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="max-w-4xl mx-auto">
                  <ResourceTab />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
