import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CheckCircle, Clock, Baby, AlertCircle, Filter, CalendarCheck, User } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, writeBatch, getDocs } from 'firebase/firestore';
import { generateDailyTasksForStudent } from '../../utils/taskAutomation';
import { useToast } from '../../context/ToastContext';

const ChildCareTaskManager = ({ db, appId, students, currentUser }) => {
    const { addToast } = useToast();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All'); // All, Pending, Completed
    const [selectedGroup, setSelectedGroup] = useState('All'); // All, Infant, Toddler, Preschool
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Query tasks for today (simplified query for demo, ideally filter by date)
        const q = query(collection(db, `artifacts/${appId}/public/data/care_tasks`), orderBy('scheduledTime', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setTasks(data);
        });
        return () => unsubscribe();
    }, [db, appId]);

    const handleGenerateTasks = async () => {
        setLoading(true);
        try {
            let count = 0;
            // Generate for all students (in real app, check if already generated for today)
            for (const student of students) {
                count += await generateDailyTasksForStudent(db, appId, student);
            }
            addToast(`Generated ${count} care tasks for today`, 'success');
        } catch (e) {
            console.error(e);
            if (e.code === 'permission-denied') {
                addToast('Permission Denied Check Firestore Rules', 'error');
            } else {
                addToast('Task generation failed', 'error');
            }
        }
        setLoading(false);
    };

    const handleCompleteTask = async (task) => {
        try {
            await updateDoc(doc(db, `artifacts/${appId}/public/data/care_tasks`, task.id), {
                status: 'Completed',
                completedAt: serverTimestamp(),
                completedBy: currentUser?.email || 'Admin',
                details: 'Routine check completed'
            });
            addToast('Task marked as done', 'success');
        } catch (e) {
            console.error(e);
            addToast('Update failed', 'error');
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (filter !== 'All' && t.status !== filter) return false;
        if (selectedGroup !== 'All' && t.group !== selectedGroup) return false;
        return true;
    });

    const pendingCount = tasks.filter(t => t.status === 'Pending').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarCheck className="text-purple-600" /> Daily Care & Compliance
                    </h2>
                    <p className="text-slate-500">Track routine care tasks for all age groups.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateTasks} isLoading={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Clock size={16} className="mr-2" /> Generate Today's Schedule
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase">Total Tasks</p>
                    <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                </Card>
                <Card className="p-4 bg-amber-50 border-amber-100">
                    <p className="text-xs font-bold text-amber-600 uppercase">Pending</p>
                    <p className="text-2xl font-bold text-amber-900">{pendingCount}</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-100">
                    <p className="text-xs font-bold text-green-600 uppercase">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{completedCount}</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-100">
                    <p className="text-xs font-bold text-purple-600 uppercase">Completion Rate</p>
                    <p className="text-2xl font-bold text-purple-900">
                        {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                    </p>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl border border-slate-200">
                <Filter size={16} className="text-slate-400 mr-2" />
                <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="p-2 text-sm bg-slate-50 rounded-lg border border-slate-200 outline-none"
                >
                    <option value="All">All Groups</option>
                    <option value="Infant">Infants</option>
                    <option value="Toddler">Toddlers</option>
                    <option value="Preschool">Preschool</option>
                </select>

                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="p-2 text-sm bg-slate-50 rounded-lg border border-slate-200 outline-none"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Task List */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="p-4">Time</th>
                                <th className="p-4">Task Type</th>
                                <th className="p-4">Child (Group)</th>
                                <th className="p-4">Assigned To</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                        No tasks found. Click "Generate Today's Schedule" to start.
                                    </td>
                                </tr>
                            )}
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-slate-600">
                                        {task.scheduledTime}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{task.type}</div>
                                        <div className="text-xs text-slate-400">{task.priority} Priority</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                {task.studentName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">{task.studentName}</p>
                                                <p className="text-[10px] uppercase text-slate-400 font-bold">{task.group}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {task.status === 'Completed' ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <User size={14} /> {task.completedBy}
                                            </span>
                                        ) : (
                                            <span className="italic text-slate-300">--</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {task.status === 'Completed' ? (
                                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                                        ) : (
                                            <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {task.status !== 'Completed' && (
                                            <Button onClick={() => handleCompleteTask(task)} size="sm" className="bg-white border border-slate-200 hover:bg-green-50 text-slate-600 hover:text-green-700">
                                                <CheckCircle size={16} className="mr-2" /> Mark Done
                                            </Button>
                                        )}
                                        {task.status === 'Completed' && (
                                            <span className="text-xs text-slate-400 font-mono">
                                                {task.completedAt ? new Date(task.completedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Done'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ChildCareTaskManager;
