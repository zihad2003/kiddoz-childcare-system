const express = require('express');
const router = express.Router();
const { Staff } = require('../models');
const auth = require('../middleware/auth');

// Get all staff
router.get('/', auth, async (req, res) => {
    try {
        const staff = await Staff.findAll();
        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add staff (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, role, rate, experience, specialty, area, availability, img } = req.body;
        const newStaff = await Staff.create({
            id: `s-${Date.now()}`,
            name, role, rate, experience, specialty, area, availability, img
        });

        res.status(201).json(newStaff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update staff
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const staff = await Staff.findByPk(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });

        await staff.update(req.body);
        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete staff
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const staff = await Staff.findByPk(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });

        await staff.destroy();
        res.json({ message: 'Staff member removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
