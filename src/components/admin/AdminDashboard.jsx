import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Users, Bell, LogOut, Search, X } from 'lucide-react';

const AdminDashboard = ({ user, setView, db, appId }) => {
  const [adminTab, setAdminTab] = useState('roster'); 
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statsForm, setStatsForm] = useState({ temp: '', mood: '', attendance: '', meal: '' });
  
  useEffect(() => {
    const qStudents = query(collection(db, `artifacts/${appId}/public/data/students`), orderBy('name'));
    const unsubStudents = onSnapshot(qStudents, (snapshot) => {
      const data = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
      setStudents(data);
    });
    return () => unsubStudents();
  }, []);

  const handleUpdateStats = async () => {
    if (!selectedStudent) return;
    try {
      await updateDoc(doc(db, `artifacts/${appId}/public/data/students`, selectedStudent.docId), {
        ...statsForm, lastUpdated: serverTimestamp()
      });
      setIsEditing(false);
      alert("Student stats updated successfully!");
    } catch (e) { alert("Update failed"); }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-purple-900 text-white p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-2 font-bold text-2xl"><div className="bg-white text-purple-900 p-1 rounded">K</div> Staff Portal</div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setAdminTab('roster')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${adminTab === 'roster' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}><Users size={20} /> Manage Roster</button>
          <button onClick={() => setAdminTab('alerts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${adminTab === 'alerts' ? 'bg-purple-700' : 'hover:bg-purple-800'}`}><Bell size={20} /> Alerts Center</button>
        </nav>
        <button onClick={() => setView('home')} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200"><LogOut size={20} /> Exit</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 capitalize">{adminTab === 'roster' ? 'Student Roster' : 'Notifications'}</h2>
        {adminTab === 'roster' && (
          <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input type="text" placeholder="Search by Name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => (
                <div key={student.docId} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-300 transition group">
                   <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                   <p className="text-xs font-mono text-slate-400 mb-4">ID: {student.id}</p>
                   <button onClick={() => { setSelectedStudent(student); setIsEditing(true); }} className="w-full bg-purple-50 text-purple-700 font-bold py-2 rounded-lg">Update Vitals</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Modal UI following original design in App.jsx */}
      </div>
    </div>
  );
};

export default AdminDashboard;