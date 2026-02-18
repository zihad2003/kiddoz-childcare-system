const express = require('express');
const router = express.Router();
const { Payroll, Student } = require('../models');
const verifyToken = require('../middleware/auth');

// Get Revenue Summary based on Student Plans
router.get('/revenue', verifyToken, async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['plan']
        });

        const pricing = {
            'Little Explorer': 450,
            'Growth Scholar': 750,
            'VIP Guardian': 1200
        };

        const summary = students.reduce((acc, s) => {
            const price = pricing[s.plan] || 0;
            acc.total += price;
            acc.count += 1;
            acc.byPlan[s.plan] = (acc.byPlan[s.plan] || 0) + price;
            return acc;
        }, { total: 0, count: 0, byPlan: {} });

        res.json(summary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all payroll records
router.get('/payroll', verifyToken, async (req, res) => {
    try {
        const records = await Payroll.findAll({
            order: [['date', 'DESC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new payment request
router.post('/payroll', verifyToken, async (req, res) => {
    try {
        const record = await Payroll.create(req.body);
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark as Paid
router.patch('/payroll/:id', verifyToken, async (req, res) => {
    try {
        const record = await Payroll.findByPk(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        await record.update({ status: 'Paid' });
        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
