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
        console.error('STUDENTS_FETCH_ERROR:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
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

        // Basic Validation
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Student name is required' });
        }
        if (!dob) {
            return res.status(400).json({ message: 'Date of birth is required' });
        }

        let parentId = req.user.id;

        // Admins can enroll for others if they provide parentId
        if (req.user.role === 'admin' && req.body.parentId) {
            parentId = req.body.parentId;
            // Verify parent exists if provided by admin
            const parent = await User.findByPk(parentId);
            if (!parent) return res.status(400).json({ message: 'Specified parent does not exist' });
        }

        const newStudent = await Student.create({
            id: `K-${Math.floor(1000 + Math.random() * 9000)}`, // Simple ID generation
            parentId,
            name: name.trim(),
            dob,
            gender: gender || 'Other',
            plan: plan?.name || plan || 'Little Explorer', // Handle object or string with default
            photoUrl,
            healthInfo: childData, // Storing raw extra data here for now
            attendance: 'Registered'
        });

        res.status(201).json(newStudent);
    } catch (err) {
        console.error('Enrollment Error:', err);
        res.status(500).json({ message: 'Enrollment failed due to a server error. Please try again later.' });
    }
});

// Update student (e.g. attendance, mood, etc.)
router.put('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Permission check: Only Admin/Staff can update operational data
        if (req.user.role === 'parent' && student.parentId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedStudent = await student.update(req.body);

        // --- Automatically Log to DailyActivity for History & AI Analysis ---
        const { DailyActivity } = require('../models');
        const updates = req.body;
        const logEntries = [];

        // 1. Meal Log
        if (updates.mealType || updates.mealAmount) {
            logEntries.push({
                studentId: student.id,
                activityType: 'meal',
                value: updates.mealAmount || 'Noted',
                details: `${updates.mealType || 'Meal'}: ${updates.foodDetails || 'No details'}`,
                recordedBy: req.user.email
            });
        }

        // 2. Vitals Log (Mood/Temp)
        if (updates.temp || updates.mood) {
            logEntries.push({
                studentId: student.id,
                activityType: 'vitals',
                value: updates.temp || updates.mood,
                details: `Temp: ${updates.temp || 'N/A'}, Mood: ${updates.mood || 'N/A'}`,
                recordedBy: req.user.email
            });
        }

        // 3. Activity Log
        if (updates.activityType) {
            logEntries.push({
                studentId: student.id,
                activityType: updates.activityType.toLowerCase(),
                value: updates.activityDetails || 'Completed',
                details: updates.notes || '',
                recordedBy: req.user.email
            });
        }

        // 4. Medication Log
        if (updates.medGiven && updates.medName) {
            logEntries.push({
                studentId: student.id,
                activityType: 'medication',
                value: 'Administered',
                details: `${updates.medName} (${updates.medDosage || 'Std Dose'})`,
                recordedBy: req.user.email
            });
        }

        // Create log entries in bulk
        if (logEntries.length > 0) {
            await DailyActivity.bulkCreate(logEntries);
        }

        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Log a milestone
router.post('/:id/milestones', auth, async (req, res) => {
    try {
        const { title, category, description, achievedDate } = req.body;
        const student = await Student.findByPk(req.params.id);

        if (!student) return res.status(404).json({ message: 'Student not found' });

        const { Milestone, Notification } = require('../models');

        const milestone = await Milestone.create({
            studentId: student.id,
            title,
            category,
            description,
            achievedDate: achievedDate || new Date(),
            recordedBy: req.user.email
        });

        // Notify parent
        await Notification.create({
            studentId: student.id,
            parentId: student.parentId,
            title: `🌟 New Milestone: ${title}`,
            message: `${student.name} achieved a new milestone in ${category}!`,
            type: 'health' // categorized as health/growth
        });

        res.status(201).json(milestone);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
