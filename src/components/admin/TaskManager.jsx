import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { CheckSquare, Square, Clock, Plus } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const TaskManager = ({ db, appId, currentUserRole, currentUserEmail }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [assignee, setAssignee] = useState('All');

    useEffect(() => {
        const q = query(collection(db, `artifacts/${appId}/public/data/tasks`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
    }, [db, appId]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        await addDoc(collection(db, `artifacts/${appId}/public/data/tasks`), {
            title: newTask,
            assignedTo: assignee,
            completed: false,
            createdBy: currentUserEmail,
            createdAt: serverTimestamp()
        });
        setNewTask('');
    };

    const toggleTask = async (task) => {
        await updateDoc(doc(db, `artifacts/${appId}/public/data/tasks`, task.id), {
            completed: !task.completed,
            completedBy: !task.completed ? currentUserEmail : null,
            completedAt: !task.completed ? serverTimestamp() : null
        });
    };

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, `artifacts/${appId}/public/data/tasks`, id));
    };

    // Filter tasks relevant to view
    const visibleTasks = tasks.filter(t =>
        currentUserRole === 'admin' || t.assignedTo === 'All' || t.assignedTo.toLowerCase() === currentUserRole.toLowerCase()
    );

    return (
        <Card className="p-4 bg-white shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckSquare size={18} className="text-purple-600" />
                {currentUserRole === 'admin' ? 'Staff Task Manager' : 'My Tasks'}
            </h3>

            {currentUserRole === 'admin' && (
                <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New task..."
                        className="flex-1 text-sm p-2 rounded border border-slate-200 outline-none focus:border-purple-500"
                    />
                    <select
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        className="text-sm p-2 rounded border border-slate-200 outline-none"
                    >
                        <option value="All">All Staff</option>
                        <option value="Teacher">Teachers</option>
                        <option value="Nurse">Nurses</option>
                        <option value="Nanny">Nannies</option>
                    </select>
                    <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
                        <Plus size={16} />
                    </button>
                </form>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
                {visibleTasks.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No tasks pending.</p>}

                {visibleTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 group">
                        <button onClick={() => toggleTask(task)} className={`transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-purple-500'}`}>
                            {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                        <div className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {task.title}
                            <span className="block text-[10px] text-slate-400">
                                {task.assignedTo} • {task.completed ? 'Done' : 'Pending'}
                            </span>
                        </div>
                        {currentUserRole === 'admin' && (
                            <button onClick={() => deleteTask(task.id)} className="text-red-400 opacity-0 group-hover:opacity-100 text-xs hover:underline">
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TaskManager;
