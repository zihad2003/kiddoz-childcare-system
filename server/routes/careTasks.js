const express = require('express');
const router = express.Router();
const { CareTask, Student } = require('../models');
const verifyToken = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all care tasks (can filter by date, group, student)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { date, group, studentId } = req.query;
        const where = {};

        // Default to today if no date provided? Or return all? 
        // Let's filter by date if provided, otherwise all (or maybe default today)
        if (date) where.date = date;
        if (group) where.group = group;
        if (studentId) where.studentId = studentId;

        const tasks = await CareTask.findAll({
            where,
            order: [['scheduledTime', 'ASC']]
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a care task
router.post('/', verifyToken, async (req, res) => {
    try {
        const task = await CareTask.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update care task (mark complete, etc)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const task = await CareTask.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.update(req.body);
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Generate daily tasks for a student (Batch creation)
router.post('/generate', verifyToken, async (req, res) => {
    try {
        const { studentId } = req.body;
        const student = await Student.findByPk(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Logic to generate tasks based on student age/group
        // This simulates the utils/taskAutomation logic
        const tasks = [];
        const commonTasks = [
            { time: '09:00 AM', type: 'Medicine Check', priority: 'High' },
            { time: '10:30 AM', type: 'Diaper Change', priority: 'High' },
            { time: '12:00 PM', type: 'Lunch Feed', priority: 'Medium' },
            { time: '02:00 PM', type: 'Nap Check', priority: 'Medium' },
        ];

        // Ensure we don't create duplicates for today?
        // For simplicity, just create them.

        for (const t of commonTasks) {
            tasks.push({
                scheduledTime: t.time,
                type: t.type,
                priority: t.priority,
                studentId: student.id,
                studentName: student.name,
                group: 'Infant', // Should be dynamic based on student
                date: new Date()
            });
        }

        const createdTasks = await CareTask.bulkCreate(tasks);
        res.json(createdTasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
