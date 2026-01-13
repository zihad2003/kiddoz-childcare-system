import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Users, Bell, LogOut, Search, X, Edit2, ShieldCheck, Thermometer, Smile, Utensils, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Select from '../ui/Select';
import HealthLogs from './HealthLogs';
import DoctorUpload from './DoctorUpload';

const AdminDashboard = ({ user, setView, db, appId }) => {
  const [adminTab, setAdminTab] = useState('roster');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Stats form for the modal
  const [statsForm, setStatsForm] = useState({ temp: '', mood: '', attendance: '', meal: '' });

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
      meal: student.meal || 'Not checked'
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
      setIsEditing(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
      alert("Update failed");
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
          <div className="bg-white text-purple-900 p-2 rounded-lg shadow-lg">K</div>
          <span>Staff Portal</span>
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
            {adminTab === 'roster' ? <><Users className="text-purple-600" /> Student Roster</> : <><Bell className="text-purple-600" /> Notifications</>}
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
                  </Card>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'alerts' && (
            <div className="max-w-3xl animate-in fade-in duration-500">
              <Card className="p-8 text-center border-dashed border-2 border-slate-200 shadow-none bg-slate-50">
                <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No New System Alerts</h3>
                <p className="text-slate-500">Everything is running smoothly. Check back later for system notifications.</p>
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
            <DoctorUpload studentId={selectedStudent?.id} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
