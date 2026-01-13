import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { Users, Bell, LogOut, Search, X, Edit2, ShieldCheck, Thermometer, Smile, Utensils, Clock, DollarSign, Settings, TrendingUp, CreditCard } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Select from '../ui/Select';
import HealthLogs from './HealthLogs';
import DoctorUpload from './DoctorUpload';

const AdminDashboard = ({ user, setView, db, appId }) => {
  const { addToast } = useToast();
  const [adminTab, setAdminTab] = useState('roster');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Stats form for the modal
  const [statsForm, setStatsForm] = useState({ temp: '', mood: '', attendance: '', meal: '', notes: '', observations: '' });

  useEffect(() => {
    const qStudents = query(collection(db, `artifacts/${appId}/public/data/students`), orderBy('name'));
    const unsubStudents = onSnapshot(qStudents, (snapshot) => {
      const data = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
      setStudents(data);
    });
    return () => unsubStudents();
  }, [db, appId]);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setStatsForm({
      temp: student.temp || '98.6',
      mood: student.mood || 'Neutral',
      attendance: student.attendance || 'Present',
      meal: student.meal || 'Not checked',
      notes: student.notes || '',
      observations: student.observations || ''
    });
    setIsEditing(true);
  };

  const handleUpdateStats = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, `artifacts/${appId}/public/data/students`, selectedStudent.docId), {
        ...statsForm, lastUpdated: serverTimestamp()
      });

      // Add notification for parent
      await addDoc(collection(db, `artifacts/${appId}/public/data/notifications`), {
        studentId: selectedStudent.id,
        parentId: selectedStudent.parentId,
        title: 'Health Update',
        message: `${selectedStudent.name}'s vitals were updated. Temp: ${statsForm.temp}°F, Mood: ${statsForm.mood}.`,
        details: {
          temp: statsForm.temp,
          mood: statsForm.mood,
          meal: statsForm.meal,
          notes: statsForm.notes,
          observations: statsForm.observations,
          updatedBy: user?.email
        },
        timestamp: serverTimestamp(),
        read: false,
        type: 'health'
      });

      addToast(`Updated stats for ${selectedStudent.name}`, 'success');
      setIsEditing(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
      addToast("Update failed. Please try again.", 'error');
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-purple-900 text-white p-6 flex flex-col shadow-2xl z-10">
        <div className="mb-10 flex items-center gap-3 font-bold text-2xl">
          <div className="bg-white text-purple-900 p-2 rounded-lg shadow-lg">F</div>
          <span>Fitday Staff</span>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => setAdminTab('roster')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'roster' ? 'bg-purple-700 shadow-lg translate-x-1' : 'hover:bg-purple-800 text-purple-200 hover:text-white'}`}
          >
            <Users size={20} /> Manage Roster
          </button>
          <button
            onClick={() => setAdminTab('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'alerts' ? 'bg-purple-700 shadow-lg translate-x-1' : 'hover:bg-purple-800 text-purple-200 hover:text-white'}`}
          >
            <Bell size={20} /> Alerts Center
          </button>

          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Admin Tools</p>
            <button
              onClick={() => setAdminTab('financials')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'financials' ? 'bg-purple-700 shadow-lg translate-x-1' : 'hover:bg-purple-800 text-purple-200 hover:text-white'}`}
            >
              <DollarSign size={20} /> Financials
            </button>
            <button
              onClick={() => setAdminTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'settings' ? 'bg-purple-700 shadow-lg translate-x-1' : 'hover:bg-purple-800 text-purple-200 hover:text-white'}`}
            >
              <Settings size={20} /> App Settings
            </button>
          </div>
        </nav>

        <div className="bg-purple-800/50 rounded-xl p-4 mb-4">
          <p className="text-xs text-purple-300 font-medium uppercase mb-2">Logged in as</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate text-sm font-semibold">{user?.email || 'Admin View'}</div>
          </div>
        </div>

        <button onClick={() => setView('home')} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:text-red-300 hover:bg-white/5 transition">
          <LogOut size={20} /> Exit Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-8 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-slate-800 capitalize flex items-center gap-3">
            {adminTab === 'roster' && <><Users className="text-purple-600" /> Student Roster</>}
            {adminTab === 'alerts' && <><Bell className="text-purple-600" /> Notifications</>}
            {adminTab === 'financials' && <><DollarSign className="text-purple-600" /> Financial Overview</>}
            {adminTab === 'settings' && <><Settings className="text-purple-600" /> System Settings</>}
          </h2>
        </header>

        <div className="p-8">
          {adminTab === 'roster' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by Name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge color="bg-purple-100 text-purple-700">{students.length} Total Students</Badge>
                  <Badge color="bg-green-100 text-green-700">{students.filter(s => s.attendance === 'Present').length} Present</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map(student => (
                  <Card key={student.docId} className="group hover:border-purple-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(student)} className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"><Edit2 size={16} /></button>
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mb-3">
                        {student.name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 truncate">{student.name}</h3>
                      <p className="text-xs font-mono text-slate-400">ID: {student.id}</p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div className="flex justify-between"><span className="text-slate-400">Temp</span> <span className="font-semibold">{student.temp || '--'}°F</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Status</span> <span className={`font-semibold ${student.attendance === 'Present' ? 'text-green-600' : 'text-slate-600'}`}>{student.attendance || '--'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Plan</span> <span className="font-semibold text-purple-600">{student.plan}</span></div>
                    </div>

                    <Button onClick={() => openEditModal(student)} variant="outline" size="sm" className="w-full">
                      Update Vitals
                    </Button>
                    <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">IoT Auto-sync coming soon</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'alerts' && (
            <div className="max-w-3xl animate-in fade-in duration-500 space-y-4">
              <Card className="p-4 border-l-4 border-l-amber-500 bg-white shadow-sm flex gap-4">
                <div className="bg-amber-100 p-3 rounded-full h-fit text-amber-600"><Bell size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Low Supply Alert</h4>
                  <p className="text-slate-600 text-sm">Diaper inventory is running low in Toddler Room B.</p>
                  <span className="text-xs text-slate-400 mt-2 block">2 hours ago</span>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-sm flex gap-4">
                <div className="bg-blue-100 p-3 rounded-full h-fit text-blue-600"><Clock size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">Staff Meeting Reminder</h4>
                  <p className="text-slate-600 text-sm">Monthly staff coordination meeting at 4:00 PM.</p>
                  <span className="text-xs text-slate-400 mt-2 block">5 hours ago</span>
                </div>
              </Card>
            </div>
          )}

          {adminTab === 'financials' && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                  <DollarSign className="mb-4 opacity-80" size={32} />
                  <h3 className="text-3xl font-bold mb-1">$42,500</h3>
                  <p className="text-emerald-100">Monthly Revenue</p>
                  <div className="mt-4 text-xs bg-black/10 inline-block px-2 py-1 rounded">+12% from last month</div>
                </Card>
                <Card className="p-6">
                  <Users className="mb-4 text-purple-600" size={32} />
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">124</h3>
                  <p className="text-slate-500">Active Enrollments</p>
                  <div className="mt-4 text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded font-bold">+5 New this week</div>
                </Card>
                <Card className="p-6">
                  <CreditCard className="mb-4 text-blue-600" size={32} />
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">98%</h3>
                  <p className="text-slate-500">Payment Collection Rate</p>
                  <div className="mt-4 text-xs text-slate-400">2 pending invoices</div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="text-purple-600" /> Revenue Forecast</h3>
                <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b border-slate-100">
                  {[40, 60, 45, 70, 65, 85, 80, 95, 90, 100, 95, 110].map((h, i) => (
                    <div key={i} className="w-full bg-purple-100 hover:bg-purple-600 transition-colors rounded-t-lg relative group" style={{ height: `${h / 1.5}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${h}k
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
                  <span>Jan</span><span>Dec</span>
                </div>
              </Card>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="max-w-2xl animate-in fade-in duration-500">
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-4">General Settings</h3>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-700">System Notifications</p>
                      <p className="text-xs text-slate-500">Enable email alerts for staff</p>
                    </div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-700">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Disables parent access temporarily</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Data Management</h3>
                  <Button variant="outline" className="w-full justify-center text-red-500 hover:bg-red-50 border-red-200">
                    <ShieldCheck size={18} className="mr-2" /> Export All Student Data (CSV)
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Student Management: ${selectedStudent?.name}`}
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
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Temperature (°F)"
                icon={Thermometer}
                value={statsForm.temp}
                onChange={e => setStatsForm({ ...statsForm, temp: e.target.value })}
              />
              <Select
                label="Mood"
                icon={Smile}
                value={statsForm.mood}
                onChange={e => setStatsForm({ ...statsForm, mood: e.target.value })}
                options={[
                  { label: 'Happy', value: 'Happy' },
                  { label: 'Neutral', value: 'Neutral' },
                  { label: 'Tired', value: 'Tired' },
                  { label: 'Crying', value: 'Crying' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Attendance"
                icon={Clock}
                value={statsForm.attendance}
                onChange={e => setStatsForm({ ...statsForm, attendance: e.target.value })}
                options={[
                  { label: 'Present', value: 'Present' },
                  { label: 'Absent', value: 'Absent' },
                  { label: 'Late', value: 'Late' },
                  { label: 'Checked Out', value: 'Checked Out' },
                ]}
              />
              <Select
                label="Meal Status"
                icon={Utensils}
                value={statsForm.meal}
                onChange={e => setStatsForm({ ...statsForm, meal: e.target.value })}
                options={[
                  { label: 'Not checked in', value: 'Not checked in' },
                  { label: 'Breakfast eaten', value: 'Breakfast eaten' },
                  { label: 'Lunch eaten', value: 'Lunch eaten' },
                  { label: 'Refused meal', value: 'Refused meal' },
                ]}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Staff Notes</label>
              <textarea
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 outline-none h-24"
                placeholder="Internal notes about behavior or health..."
                value={statsForm.notes}
                onChange={e => setStatsForm({ ...statsForm, notes: e.target.value })}
              />
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

            <div className="pt-4 flex gap-3">
              <Button onClick={() => setIsEditing(false)} variant="ghost" className="flex-1">Cancel</Button>
              <Button onClick={handleUpdateStats} isLoading={loading} className="flex-1">Save Updates</Button>
            </div>
          </div>
        )}

        {statsForm.activeModalTab === 'logs' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <HealthLogs student={selectedStudent} />
          </div>
        )}

        {statsForm.activeModalTab === 'docs' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <DoctorUpload studentId={selectedStudent?.id} uploader={user} appId={appId} db={db} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
