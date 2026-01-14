import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const TASK_TEMPLATES = {
    'Infant': [
        { type: 'Diaper Change', time: '09:00', priority: 'High' },
        { type: 'Bottle Feeding', time: '10:00', priority: 'High' },
        { type: 'Nap Check', time: '11:00', priority: 'Medium' },
        { type: 'Diaper Change', time: '12:00', priority: 'High' },
        { type: 'Tummy Time', time: '14:00', priority: 'Low' }
    ],
    'Toddler': [
        { type: 'Morning Snack', time: '09:30', priority: 'Medium' },
        { type: 'Diaper/Potty', time: '10:30', priority: 'High' },
        { type: 'Lunch', time: '12:00', priority: 'High' },
        { type: 'Nap', time: '13:00', priority: 'High' },
        { type: 'Afternoon Snack', time: '15:00', priority: 'Medium' }
    ],
    'Preschool': [
        { type: 'Circle Time', time: '09:00', priority: 'Medium' },
        { type: 'Outdoor Play', time: '10:30', priority: 'Low' },
        { type: 'Lunch', time: '12:00', priority: 'High' },
        { type: 'Quiet Time', time: '13:00', priority: 'Medium' },
        { type: 'Educational Activity', time: '14:30', priority: 'High' }
    ]
};

export const generateDailyTasksForStudent = async (db, appId, student) => {
    // Determine age group based on grade or age
    let group = 'Toddler';
    if (student.grade === 'Daycare' || student.age < 2) group = 'Infant';
    if (student.grade === 'Preschool' || student.grade === 'KG-1' || student.grade === 'KG-2') group = 'Preschool';

    const templates = TASK_TEMPLATES[group] || TASK_TEMPLATES['Toddler'];
    const tasks = [];

    const todayDate = new Date().toISOString().split('T')[0];

    for (const template of templates) {
        const taskData = {
            studentId: student.id || student.docId,
            studentName: student.name,
            group: group,
            type: template.type,
            scheduledTime: template.time,
            priority: template.priority,
            status: 'Pending',
            date: todayDate,
            createdAt: serverTimestamp(),
            assignedTo: 'Unassigned' // Can be claimed by any staff
        };

        // Push promise to array
        tasks.push(addDoc(collection(db, `artifacts/${appId}/public/data/care_tasks`), taskData));
    }

    await Promise.all(tasks);
    return tasks.length;
};
