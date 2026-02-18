import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Users, Bell, LogOut, Search, Edit2, ShieldCheck, Clock, DollarSign, Settings, UserCheck, ScanFace, Database, Loader2, Send, AlertTriangle, Info, CheckCircle, FileText } from 'lucide-react';
import { BANGLADESHI_STUDENTS } from '../../data/bangladeshiData';
import DataQueryFilter from './DataQueryFilter';
import TaskManager from './TaskManager';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import StaffManager from './StaffManager';
import PayrollManager from './PayrollManagerClean';
import LiveStreamManager from './LiveStreamManager';
import NurseDashboard from './NurseDashboard';
import TeacherDashboard from './TeacherDashboard';
import ChildCareTaskManager from './ChildCareTaskManager';
import NannyDashboard from './NannyDashboard';
import StudentDailyUpdateModal from './StudentDailyUpdateModal';
import AppSettings from './AppSettings';
import IncidentReportManager from './IncidentReportManager';
import api from '../../services/api';

const AdminDashboard = ({ user, handleLogout }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState('admin'); // admin | teacher | nurse | nanny

  // Auth Guard: Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Role based access control
  const canAccess = (feature) => {
    if (currentRole === 'admin') return true;
    if (currentRole === 'teacher' && ['roster', 'alerts', 'live', 'care', 'incidents'].includes(feature)) return true;
    if (currentRole === 'nurse' && ['roster', 'alerts', 'care', 'incidents'].includes(feature)) return true;
    if (currentRole === 'nanny') return false; // Nanny has their own full dashboard, uses AdminDashboard as wrapper but hides standard tabs
    return false;
  };

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      addToast("Failed to load students", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const [filterConfig, setFilterConfig] = useState({ status: 'All', payment: 'All', grade: 'All', minAge: '', maxAge: '' });
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });
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
      await api.addStudent({
        ...randomStudent,
        plan: { name: randomStudent.plan },
        childData: { ...randomStudent, enrollmentDate: new Date() }
      });

      addToast(`Successfully enrolled ${randomStudent.name} into the system.`, 'success');
      await fetchStudents();
    } catch (e) {
      console.error(e);
      addToast(e.response?.data?.message || 'Failed to sync data with the server. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processStudents = () => {
    let result = [...students];

    // Search
    if (searchTerm) {
      result = result.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-purple-900 text-white p-6 flex flex-col shadow-2xl z-10 transition-colors duration-500"
        style={{ backgroundColor: currentRole === 'nurse' ? '#0f766e' : (currentRole === 'teacher' ? '#ea580c' : (currentRole === 'nanny' ? '#be185d' : '')) }}>

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
          <div className="bg-white text-purple-900 p-2 rounded-lg shadow-lg">K</div>
          <span>
            {currentRole === 'admin' ? 'KiddoZ Admin' : (currentRole === 'teacher' ? 'Teacher Portal' : 'Nurse Station')}
          </span>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => setTab('roster')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'roster' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <Users size={20} /> {currentRole === 'nurse' ? 'Health Check' : 'Student Roster'}
          </button>

          <button
            onClick={() => setTab('nannies')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'nannies' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <UserCheck size={20} /> Manage Staff
          </button>

          <button
            onClick={() => setTab('care')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'care' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <Clock size={20} /> Care & Tasks
          </button>

          <button
            onClick={() => setTab('live')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'live' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <ScanFace size={20} /> AI Surveillance
          </button>

          <button
            onClick={() => setTab('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'alerts' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <Bell size={20} /> Alerts Center
          </button>

          <button
            onClick={() => setTab('incidents')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'incidents' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
          >
            <FileText size={20} /> Incidents
          </button>

          {canAccess('financials') && (
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Admin Tools</p>
              <button
                onClick={() => setTab('financials')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'financials' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
              >
                <DollarSign size={20} /> Financials
              </button>
              <button
                onClick={() => setTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${adminTab === 'settings' ? 'bg-white/20 shadow-lg translate-x-1' : 'hover:bg-white/10 text-purple-100 hover:text-white'}`}
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

        <button onClick={() => { if (handleLogout) handleLogout(); navigate('/login'); }} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:text-red-300 hover:bg-white/5 transition">
          <LogOut size={20} /> Exit Portal
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-8 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-slate-800 capitalize flex items-center gap-3">
            {adminTab === 'roster' && <><Users className="text-purple-600" /> Student Roster</>}
            {adminTab === 'care' && <><Clock className="text-purple-600" /> Daily Care Management</>}
            {adminTab === 'live' && <><ScanFace className="text-purple-600" /> AI Surveillance</>}
            {adminTab === 'nannies' && <><UserCheck className="text-purple-600" /> Staff Directory</>}
            {adminTab === 'alerts' && <><Bell className="text-purple-600" /> Notifications</>}
            {adminTab === 'incidents' && <><FileText className="text-purple-600" /> Incident Reports</>}
            {adminTab === 'financials' && <><DollarSign className="text-purple-600" /> Financial Overview</>}
            {adminTab === 'settings' && <><Settings className="text-purple-600" /> System Settings</>}
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={enrollBangladeshiData}
                        variant="outline"
                        size="sm"
                        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        disabled={loading}
                      >
                        {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Database size={16} className="mr-2" />}
                        {loading ? 'Processing...' : 'Load BD Data'}
                      </Button>
                      <Badge color="bg-purple-100 text-purple-700">{students.length} Total Students</Badge>
                      <Badge color="bg-green-100 text-green-700">{students.filter(s => s.attendance === 'Present').length} Present</Badge>
                    </div>
                  </div>

                  <DataQueryFilter
                    onFilterChange={setFilterConfig}
                    onSortChange={setSortConfig}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map(student => (
                      <Card key={student.id} className="group hover:border-purple-300 relative overflow-hidden">
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

              {adminTab === 'care' && (
                <ChildCareTaskManager students={students} currentUser={user} />
              )}

              {adminTab === 'live' && (
                <div className="animate-in fade-in duration-500">
                  <LiveStreamManager />
                </div>
              )}

              {adminTab === 'nannies' && (
                <StaffManager />
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
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
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
      case 'warning': return { border: 'border-l-amber-500', bg: 'bg-amber-100 text-amber-600', icon: <AlertTriangle size={20} /> };
      case 'admin': return { border: 'border-l-purple-500', bg: 'bg-purple-100 text-purple-600', icon: <ShieldCheck size={20} /> };
      case 'health': return { border: 'border-l-teal-500', bg: 'bg-teal-100 text-teal-600', icon: <CheckCircle size={20} /> };
      case 'system': return { border: 'border-l-red-500', bg: 'bg-red-100 text-red-600', icon: <AlertTriangle size={20} /> };
      default: return { border: 'border-l-blue-500', bg: 'bg-blue-100 text-blue-600', icon: <Info size={20} /> };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="animate-spin text-purple-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Send Notification Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send size={16} className="mr-2" /> {showForm ? 'Cancel' : 'Send Notification'}
        </Button>
      </div>

      {/* Send Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-purple-500 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-bold mb-4 text-slate-800">Create New Notification</h4>
          <form onSubmit={handleSend} className="space-y-3">
            <input
              type="text"
              placeholder="Notification title..."
              value={newAlert.title}
              onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
              required
            />
            <textarea
              placeholder="Write your message..."
              value={newAlert.message}
              onChange={e => setNewAlert({ ...newAlert, message: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 h-24 resize-none"
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
            <Button type="submit" disabled={sending} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
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
