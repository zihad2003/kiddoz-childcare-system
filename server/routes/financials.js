const express = require('express');
const router = express.Router();
const { Payroll } = require('../models');
const verifyToken = require('../middleware/auth');

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
