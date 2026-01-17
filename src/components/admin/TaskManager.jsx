import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle, Circle, Clock, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const TaskManager = ({ currentUserRole, currentUserEmail }) => {
    const { addToast } = useToast();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [assignTo, setAssignTo] = useState('All');

    useEffect(() => {
        api.getTasks().then(setTasks).catch(console.error);
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const task = await api.addTask({
                title: newTask,
                assignedTo: assignTo,
                completed: false,
                createdBy: currentUserEmail
            });
            setTasks([task, ...tasks]);
            setNewTask('');
            addToast('Task created', 'success');
        } catch (err) {
            console.error(err);
            addToast('Failed to create task', 'error');
        }
    };

    const toggleTask = async (task) => {
        try {
            const updated = await api.updateTask(task.id, {
                completed: !task.completed,
                completedBy: !task.completed ? currentUserEmail : null,
                completedAt: !task.completed ? new Date() : null
            });
            setTasks(tasks.map(t => t.id === task.id ? updated : t));
        } catch (err) {
            console.error(err);
            addToast('Failed to update task', 'error');
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
            addToast('Task deleted', 'success');
        } catch (err) {
            console.error(err);
            addToast('Failed to delete task', 'error');
        }
    };

    // Filter tasks relevant to current role
    const filteredTasks = tasks.filter(t =>
        t.assignedTo === 'All' ||
        t.assignedTo === currentUserRole ||
        t.assignedTo.includes(currentUserRole) // loose match
    );

    return (
        <Card className="h-full flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-purple-600" /> Pending Tasks
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar" style={{ maxHeight: '300px' }}>
                {filteredTasks.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No pending tasks for your role.</p>}

                {filteredTasks.map(task => (
                    <div key={task.id} className={`p-3 rounded-lg border flex items-start gap-3 group transition-colors ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-purple-100 hover:border-purple-300'}`}>
                        <button onClick={() => toggleTask(task)} className={`mt-0.5 ${task.completed ? 'text-slate-300' : 'text-purple-500 hover:text-purple-600'}`}>
                            {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </button>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{task.assignedTo}</span>
                                {task.completed && <span className="text-[10px] text-green-600">Done by {task.completedBy?.split('@')[0]}</span>}
                            </div>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddTask} className="mt-auto border-t pt-4">
                <input
                    type="text"
                    placeholder="Add new task..."
                    className="w-full text-sm p-2 mb-2 rounded border border-slate-200 outline-none focus:border-purple-400"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                />
                <div className="flex gap-2">
                    <select
                        value={assignTo}
                        onChange={e => setAssignTo(e.target.value)}
                        className="text-xs p-2 rounded border border-slate-200 outline-none bg-slate-50"
                    >
                        <option value="All">All Staff</option>
                        <option value="Teacher">Teachers</option>
                        <option value="Nurse">Nurses</option>
                        <option value="Nanny">Nannies</option>
                        <option value="Admin">Admins</option>
                    </select>
                    <Button size="sm" className="flex-1 justify-center"><Plus size={16} /> Add</Button>
                </div>
            </form>
        </Card>
    );
};

export default TaskManager;
