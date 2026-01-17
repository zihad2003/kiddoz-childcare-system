const express = require('express');
const router = express.Router();
const { Student, User } = require('../models');
const auth = require('../middleware/auth');

// Get all students (for admin) or filtered by parent
router.get('/', auth, async (req, res) => {
    try {
        let whereClause = {};
        if (req.user.role === 'parent') {
            whereClause.parentId = req.user.id;
        }

        // For admin, we can optionally filter by parentId query param
        if (req.user.role === 'admin' && req.query.parentId) {
            whereClause.parentId = req.query.parentId;
        }

        const students = await Student.findAll({ where: whereClause });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a single student
router.get('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Security check
        if (req.user.role === 'parent' && student.parentId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Enroll a student
router.post('/', auth, async (req, res) => {
    try {
        const { name, dob, gender, plan, photoUrl, childData } = req.body;
        let parentId = req.user.id;

        // Admins can enroll for others if they provide parentId
        if (req.user.role === 'admin' && req.body.parentId) {
            parentId = req.body.parentId;
        }

        const newStudent = await Student.create({
            id: `K-${Math.floor(1000 + Math.random() * 9000)}`, // Simple ID generation
            parentId,
            name,
            dob,
            gender,
            plan: plan?.name || plan, // Handle object or string
            photoUrl,
            healthInfo: childData, // Storing raw extra data here for now
            attendance: 'Registered'
        });

        res.status(201).json(newStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update student (e.g. attendance, mood, etc.)
router.put('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Permission check: Only Admin/Staff can update operational data usually, but parents might update info
        if (req.user.role === 'parent' && student.parentId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await student.update(req.body);
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
