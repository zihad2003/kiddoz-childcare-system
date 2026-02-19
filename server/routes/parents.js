const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Middleware to check if user is admin or superadmin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

// Get all parents
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const { search } = req.query;
        let where = { role: 'parent' };

        if (search) {
            where[Op.or] = [
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const parents = await User.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
        res.json(parents);
    } catch (err) {
        console.error('Error fetching parents:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a new parent
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { email, fullName, phone, address, password } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Parent already registered' });

        const newUser = await User.create({
            email,
            fullName,
            role: 'parent',
            password: password || 'password123', // Default
            phone,
            address,
            status: 'active'
        });

        const result = newUser.toJSON();
        delete result.password;
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding parent:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a parent
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const parent = await User.findOne({ where: { id: req.params.id, role: 'parent' } });
        if (!parent) return res.status(404).json({ message: 'Parent not found' });

        await parent.update(req.body);
        const result = parent.toJSON();
        delete result.password;
        res.json(result);
    } catch (err) {
        console.error('Error updating parent:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a parent
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const parent = await User.findOne({ where: { id: req.params.id, role: 'parent' } });
        if (!parent) return res.status(404).json({ message: 'Parent not found' });

        await parent.destroy();
        res.json({ message: 'Parent deleted successfully' });
    } catch (err) {
        console.error('Error deleting parent:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
