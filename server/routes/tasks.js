const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const verifyToken = require('../middleware/auth');

// Get all tasks (potentially filtered by role)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { role } = req.user;
        let whereClause = {};

        // If not admin, only show tasks assigned to 'All', their role, or specifically them (by email/name if we had it perfect, but role is good start)
        // For simplicity, we fetch all and filter in frontend or here if needed.
        // Let's return all for now to let frontend filter.

        const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Task
router.post('/', verifyToken, async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.email
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Task (Toggle complete)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.update(req.body);
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
