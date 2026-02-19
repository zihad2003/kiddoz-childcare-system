import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Users, Bell, LogOut, Search, Edit2, ShieldCheck, Clock, DollarSign, Settings, UserCheck, ScanFace, Database, Loader2, Send, AlertTriangle, Info, CheckCircle, FileText, Trash2, PlusCircle } from 'lucide-react';
import { BANGLADESHI_STUDENTS } from '../../data/bangladeshiData';
import DataQueryFilter from './DataQueryFilter';
import TaskManager from './TaskManager';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import StaffManager from './StaffManager';
import PayrollManager from './PayrollManagerClean';
import LiveStreamManager from './LiveStreamManager';
import YoloView from '../ai/YoloView';
import NurseDashboard from './NurseDashboard';
import TeacherDashboard from './TeacherDashboard';
import ChildCareTaskManager from './ChildCareTaskManager';
import NannyDashboard from './NannyDashboard';
import StudentDailyUpdateModal from './StudentDailyUpdateModal';
import IncidentReportManager from './IncidentReportManager';
import AppSettings from './AppSettings';
import AddStudentModal from './AddStudentModal';
import ParentManager from './ParentManager';
import api from '../../services/api';
import { studentService } from '../../services/studentService';

const AdminDashboard = ({ user, handleLogout }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(user?.role || 'admin');

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
    }
  }, [user]);

  // Map URL paths to tab keys
  const getTabFromPath = (path) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return 'roster';
    const subRoute = segments[1];
    if (subRoute === 'student') return 'roster';
    if (subRoute === 'staff') return 'nannies';
    return subRoute;
  };

  const adminTab = getTabFromPath(location.pathname);

  const setTab = (tab) => {
    if (tab === 'roster') navigate('/admin/student');
    else if (tab === 'nannies') navigate('/admin/staff');
    else navigate(`/admin/${tab}`);
  };

  const canAccess = (feature) => {
    if (user?.role === 'superadmin') return true;
    if (feature === 'financials' || feature === 'settings') {
      return currentRole === 'admin';
    }
    return true;
  };

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = studentService.subscribeToStudents((data) => {
      setStudents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const [filterConfig, setFilterConfig] = useState({ status: 'All', payment: 'All', grade: 'All', minAge: '', maxAge: '' });
  const [sortConfig, setSortConfig] = useState({ field: 'fullName', direction: 'asc' });
  const [settings, setSettings] = useState({ notifications: true, maintenance: false });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    addToast(`${key === 'notifications' ? 'Notifications' : 'Maintenance Mode'} ${!settings[key] ? 'Enabled' : 'Disabled'}`, 'success');
  };

  const enrollBangladeshiData = async () => {
    if (loading) return;
    setLoading(true);
    addToast('Initializing Bangladeshi student data synchronization...', 'info');
    try {
      const randomStudent = BANGLADESHI_STUDENTS[Math.floor(Math.random() * BANGLADESHI_STUDENTS.length)];
      await studentService.addStudent({
        fullName: randomStudent.name,
        dateOfBirth: randomStudent.dob,
        gender: randomStudent.gender || 'Other',
        plan: randomStudent.plan || 'Growth Scholar',
        attendance: 'Present',
        ...randomStudent
      });

      addToast(`Successfully enrolled ${randomStudent.name} into the system.`, 'success');
    } catch (e) {
      console.error(e);
      addToast('Failed to sync data with the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processStudents = () => {
    let result = [...students];

    // Search
    if (searchTerm) {
      result = result.filter(s =>
        (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter
    if (filterConfig.status !== 'All') result = result.filter(s => s.attendance === filterConfig.status);
    if (filterConfig.minAge) result = result.filter(s => Number(s.age) >= Number(filterConfig.minAge));
    if (filterConfig.date) {
      // Filter by createdAt (Enrollment Date)
      result = result.filter(s => {
        const studentDate = s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '';
        return studentDate === filterConfig.date;
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortConfig.field];
      let valB = b[sortConfig.field];

      // Handle undefined
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  };

  const filteredStudents = processStudents();

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the system? This action cannot be undone.`)) {
      try {
        await api.deleteStudent(id);
        addToast(`${name} removed from roster.`, 'success');
        // No need to refetch - real-time subscription handles updates automatically
      } catch (err) {
        console.error(err);
        addToast("Failed to delete student", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-primary-900 text-white p-6 flex flex-col shadow-2xl z-10 transition-colors duration-500"
        style={{ backgroundColor: currentRole === 'nurse' ? '#0f766e' : (currentRole === 'teacher' ? '#a05f5a' : (currentRole === 'nanny' ? '#be185d' : '')) }}>

        {/* Role Switcher (Simulation) */}
        <div className="mb-8">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2 block">Current Staff Profile</label>
          <select
            value={currentRole}
            onChange={(e) => { setCurrentRole(e.target.value); setTab('roster'); }}

            className="w-full bg-white/10 text-white font-bold rounded-lg p-2 border border-white/20 outline-none focus:bg-white/20"
          >
            <option value="admin" className="text-slate-900">Start Director (Admin)</option>
            <option value="teacher" className="text-slate-900">Lead Teacher</option>
          </select>
        </div>

        <div className="mb-6 flex items-center gap-3 font-bold text-2xl">
          <div className="bg-white text-primary-900 p-2 rounded-lg shadow-lg">K</div>
          <span>
            {currentRole === 'admin' ? 'KiddoZ Admin' : (currentRole === 'teacher' ? 'Teacher Portal' : 'Nurse Station')}
          </span>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => setTab('roster')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'roster' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <Users size={20} /> {currentRole === 'nurse' ? 'Health Check' : 'Student Roster'}
          </button>

          <button
            onClick={() => setTab('nannies')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'nannies' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <UserCheck size={20} /> Manage Staff
          </button>

          <button
            onClick={() => setTab('parents')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'parents' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <Users size={20} /> Parent Directory
          </button>

          <button
            onClick={() => setTab('care')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'care' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <Clock size={20} /> Care & Tasks
          </button>

          <button
            onClick={() => setTab('live')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'live' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <ScanFace size={20} /> AI Surveillance
          </button>

          <button
            onClick={() => setTab('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'alerts' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <Bell size={20} /> Alerts Center
          </button>

          <button
            onClick={() => setTab('incidents')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'incidents' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
          >
            <FileText size={20} /> Incidents
          </button>

          {canAccess('financials') && (
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Admin Tools</p>
              <button
                onClick={() => setTab('financials')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'financials' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
              >
                <DollarSign size={20} /> Financials
              </button>
              <button
                onClick={() => setTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'settings' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-primary-100 hover:text-white'}`}
              >
                <Settings size={20} /> App Settings
              </button>
            </div>
          )}
        </nav>

        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-white/60 font-medium uppercase mb-2">Logged in as</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {currentRole[0].toUpperCase()}
            </div>
            <div className="truncate text-sm font-semibold capitalize">{currentRole} Staff</div>
          </div>
        </div>

        <button onClick={() => { if (handleLogout) handleLogout(); navigate('/login'); }} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-primary-200 hover:text-red-300 hover:bg-white/5 transition">
          <LogOut size={20} /> Exit Portal
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-8 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-slate-800 capitalize flex items-center gap-3">
            {adminTab === 'roster' && <><Users className="text-primary-600" /> Student Roster</>}
            {adminTab === 'care' && <><Clock className="text-primary-600" /> Daily Care Management</>}
            {adminTab === 'live' && <><ScanFace className="text-primary-600" /> AI Surveillance</>}
            {adminTab === 'nannies' && <><UserCheck className="text-primary-600" /> Staff Directory</>}
            {adminTab === 'parents' && <><Users className="text-primary-600" /> Parent Directory</>}
            {adminTab === 'alerts' && <><Bell className="text-primary-600" /> Notifications</>}
            {adminTab === 'incidents' && <><FileText className="text-primary-600" /> Incident Reports</>}
            {adminTab === 'financials' && <><DollarSign className="text-primary-600" /> Financial Overview</>}
            {adminTab === 'settings' && <><Settings className="text-primary-600" /> System Settings</>}
          </h2>
        </header>

        <div className="p-8">
          {currentRole === 'nanny' ? (
            <NannyDashboard user={user} />
          ) : (
            <>
              {currentRole === 'nurse' && <NurseDashboard user={user} students={students} />}
              {currentRole === 'teacher' && <TeacherDashboard user={user} students={students} />}

              {currentRole === 'admin' && adminTab === 'roster' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative max-w-md w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by Name or ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition shadow-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsAddingStudent(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                        size="sm"
                      >
                        <PlusCircle size={16} className="mr-2" /> New Enrollment
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge color="bg-primary-100 text-primary-700">{students.length} Total Students</Badge>
                      <Badge color="bg-green-100 text-green-700">{students.filter(s => s.attendance === 'Present').length} Present</Badge>
                    </div>
                  </div>

                  <DataQueryFilter
                    onFilterChange={setFilterConfig}
                    onSortChange={setSortConfig}
                  />
                  <AddStudentModal
                    isOpen={isAddingStudent || (isEditing && selectedStudent)}
                    studentToEdit={isEditing ? selectedStudent : null}
                    onClose={() => { setIsAddingStudent(false); setIsEditing(false); setSelectedStudent(null); }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                          <div className="flex gap-4 mb-4">
                            <Skeleton variant="circular" width="48px" height="48px" />
                            <div className="flex-1 space-y-2">
                              <Skeleton width="70%" height="20px" />
                              <Skeleton width="40%" height="14px" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Skeleton width="100%" height="16px" />
                            <Skeleton width="100%" height="16px" />
                            <Skeleton width="60%" height="16px" />
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Skeleton width="50%" height="32px" />
                            <Skeleton width="50%" height="32px" />
                          </div>
                        </div>
                      ))
                    ) : filteredStudents.length === 0 ? (
                      <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Users size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400">No Students Found</h3>
                        <p className="text-slate-300 text-sm max-w-xs text-center mt-1">Try adjusting your search filters or start a new enrollment to populate the registry.</p>
                        <Button
                          onClick={() => { setSearchTerm(''); setFilterConfig({ status: 'All', grade: 'All' }); }}
                          variant="ghost"
                          className="mt-6 text-primary-600 font-black text-xs uppercase tracking-widest"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    ) : (
                      filteredStudents.map(student => (
                        <Card key={student.id} className="group hover:border-primary-300 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => { setSelectedStudent(student); setIsEditing(true); }} className="p-2 bg-white/90 hover:bg-primary-100 text-primary-700 rounded-lg shadow-sm transition" title="Edit Profile"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteStudent(student.id, student.fullName || student.name)} className="p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-lg shadow-sm transition" title="Remove"><Trash2 size={16} /></button>
                          </div>
                          <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg mb-3">
                              {(student.fullName || student.name || '?').charAt(0)}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 truncate">{student.fullName || student.name}</h3>
                            <p className="text-xs font-mono text-slate-400">ID: {student.id}</p>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600 mb-6">
                            <div className="flex justify-between"><span className="text-slate-400">Temp</span> <span className="font-semibold">{student.temp || '--'}°F</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Status</span> <span className={`font-semibold ${student.attendance === 'Present' ? 'text-green-600' : 'text-slate-600'}`}>{student.attendance || '--'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Plan</span> <span className="font-semibold text-primary-600">{student.plan}</span></div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => { setSelectedStudent(student); setShowVitalsModal(true); }} variant="outline" size="sm" className="flex-1">
                              Vitals
                            </Button>
                            <Button onClick={() => { setSelectedStudent(student); setIsEditing(true); }} variant="ghost" size="sm" className="flex-1 text-primary-600">
                              Edit
                            </Button>
                          </div>
                          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">IoT Auto-sync coming soon</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {adminTab === 'care' && (
                <ChildCareTaskManager students={students} currentUser={user} />
              )}

              {adminTab === 'live' && (
                <div className="animate-in fade-in duration-500 space-y-8">
                  <YoloView />
                  <div className="mt-12 opacity-50">
                    <LiveStreamManager />
                  </div>
                </div>
              )}

              {adminTab === 'nannies' && (
                <StaffManager />
              )}

              {adminTab === 'parents' && (
                <ParentManager />
              )}

              {adminTab === 'alerts' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">Real-time System Alerts</h3>
                    <AlertsFeed />
                  </div>
                  <div>
                    <TaskManager currentUserRole={currentRole} currentUserEmail={user?.email} />
                  </div>
                </div>
              )}

              {adminTab === 'incidents' && (
                <IncidentReportManager students={students} />
              )}

              {adminTab === 'financials' && (
                <PayrollManager />
              )}

              {adminTab === 'settings' && (
                <AppSettings />
              )}

              {/* Centralized Modal */}
              <StudentDailyUpdateModal
                isOpen={showVitalsModal}
                onClose={() => setShowVitalsModal(false)}
                student={selectedStudent}
                user={user}
                currentRole={currentRole}
              />

            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AlertsFeed = () => {
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: '', message: '', type: 'info', targetRole: 'all' });
  const [sending, setSending] = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    api.getNotifications()
      .then(data => { setAlerts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newAlert.title.trim() || !newAlert.message.trim()) {
      addToast('Title and message are required', 'error');
      return;
    }
    setSending(true);
    try {
      await api.addNotification(newAlert);
      addToast('Notification sent successfully!', 'success');
      setNewAlert({ title: '', message: '', type: 'info', targetRole: 'all' });
      setShowForm(false);
      fetchAlerts();
    } catch (err) {
      console.error(err);
      addToast('Failed to send notification', 'error');
    } finally {
      setSending(false);
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'warning': return { border: 'border-l-secondary-500', bg: 'bg-secondary-100 text-secondary-600', icon: <AlertTriangle size={20} /> };
      case 'admin': return { border: 'border-l-primary-500', bg: 'bg-primary-100 text-primary-600', icon: <ShieldCheck size={20} /> };
      case 'health': return { border: 'border-l-teal-500', bg: 'bg-teal-100 text-teal-600', icon: <CheckCircle size={20} /> };
      case 'system': return { border: 'border-l-red-500', bg: 'bg-red-100 text-red-600', icon: <AlertTriangle size={20} /> };
      default: return { border: 'border-l-blue-500', bg: 'bg-blue-100 text-blue-600', icon: <Info size={20} /> };
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height="20px" />
            <Skeleton width="90%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Send Notification Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary-600 hover:bg-primary-700 text-white">
          <Send size={16} className="mr-2" /> {showForm ? 'Cancel' : 'Send Notification'}
        </Button>
      </div>

      {/* Send Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-primary-500 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-bold mb-4 text-slate-800">Create New Notification</h4>
          <form onSubmit={handleSend} className="space-y-3">
            <input
              type="text"
              placeholder="Notification title..."
              value={newAlert.title}
              onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
            <textarea
              placeholder="Write your message..."
              value={newAlert.message}
              onChange={e => setNewAlert({ ...newAlert, message: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 h-24 resize-none"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <select value={newAlert.type} onChange={e => setNewAlert({ ...newAlert, type: e.target.value })} className="p-2 border border-slate-200 rounded-lg text-sm">
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="admin">🔒 Admin</option>
                <option value="system">🖥️ System</option>
              </select>
              <select value={newAlert.targetRole} onChange={e => setNewAlert({ ...newAlert, targetRole: e.target.value })} className="p-2 border border-slate-200 rounded-lg text-sm">
                <option value="all">👥 All Users</option>
                <option value="parent">👨‍👩‍👧 Parents Only</option>
                <option value="staff">👷 Staff Only</option>
                <option value="admin">🛡️ Admins Only</option>
              </select>
            </div>
            <Button type="submit" disabled={sending} className="w-full bg-primary-600 hover:bg-primary-700 text-white">
              {sending ? <><Loader2 size={16} className="animate-spin mr-2" /> Sending...</> : <><Send size={16} className="mr-2" /> Send Notification</>}
            </Button>
          </form>
        </Card>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-400 font-medium">No notifications yet.</p>
          <p className="text-slate-300 text-sm">Click "Send Notification" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const style = getTypeStyle(alert.type);
            return (
              <Card key={alert.id} className={`p-4 border-l-4 bg-white shadow-sm flex gap-4 ${style.border} ${alert.read ? 'opacity-60' : ''}`}>
                <div className={`p-3 rounded-full h-fit ${style.bg}`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-slate-800">{alert.title}</h4>
                    {alert.targetRole && alert.targetRole !== 'all' && (
                      <Badge color="bg-slate-100 text-slate-500">{alert.targetRole}</Badge>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm">{alert.message}</p>
                  <span className="text-xs text-slate-400 mt-2 block">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
