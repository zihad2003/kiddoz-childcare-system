const express = require('express');
const router = express.Router();
const { Student, DailyActivity, HealthRecord, Billing, NannyBooking, Staff, Notification } = require('../models');
const auth = require('../middleware/auth');

// Get all students for logged-in parent
router.get('/students', auth, async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { parentId: req.user.id }
        });
        res.json(students);
    } catch (error) {
        console.error('Error fetching parent students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Get specific student details
router.get('/students/:id', auth, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: {
                id: req.params.id,
                parentId: req.user.id // Ensure parent owns this student
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// Get daily activities for a student
router.get('/students/:id/activities', auth, async (req, res) => {
    try {
        // Verify parent owns this student
        const student = await Student.findOne({
            where: { id: req.params.id, parentId: req.user.id }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const activities = await DailyActivity.findAll({
            where: { studentId: req.params.id },
            order: [['timestamp', 'DESC']],
            limit: 50
        });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Get health records for a student
router.get('/students/:id/health', auth, async (req, res) => {
    try {
        // Verify parent owns this student
        const student = await Student.findOne({
            where: { id: req.params.id, parentId: req.user.id }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const healthRecords = await HealthRecord.findAll({
            where: { studentId: req.params.id },
            order: [['uploadedAt', 'DESC']]
        });

        res.json(healthRecords);
    } catch (error) {
        console.error('Error fetching health records:', error);
        res.status(500).json({ error: 'Failed to fetch health records' });
    }
});

// Get billing/invoices for parent
router.get('/billing', auth, async (req, res) => {
    try {
        const billings = await Billing.findAll({
            where: { parentId: req.user.id },
            order: [['dueDate', 'DESC']]
        });

        res.json(billings);
    } catch (error) {
        console.error('Error fetching billing:', error);
        res.status(500).json({ error: 'Failed to fetch billing records' });
    }
});

// Create nanny booking request
router.post('/nanny-booking', auth, async (req, res) => {
    try {
        const { studentId, nannyId, date, startTime, endTime, duration, notes } = req.body;

        // Verify parent owns this student
        const student = await Student.findOne({
            where: { id: studentId, parentId: req.user.id }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get nanny details
        const nanny = await Staff.findOne({ where: { id: nannyId } });
        if (!nanny) {
            return res.status(404).json({ error: 'Nanny not found' });
        }

        // Calculate cost (simple calculation based on duration and rate)
        const hours = parseFloat(duration) || 0;
        const totalCost = hours * (parseFloat(nanny.rate) || 0);

        const booking = await NannyBooking.create({
            parentId: req.user.id,
            studentId,
            nannyId,
            nannyName: nanny.name,
            date,
            startTime,
            endTime,
            duration,
            status: 'Pending',
            notes,
            totalCost
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get parent's nanny bookings
router.get('/nanny-booking', auth, async (req, res) => {
    try {
        const bookings = await NannyBooking.findAll({
            where: { parentId: req.user.id },
            order: [['date', 'DESC']]
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get parent-specific notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const { Op } = require('sequelize');

        // Find notifications for:
        // 1. All users
        // 2. All parents
        // 3. Specific parent (recipientId)

        const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    { targetRole: 'all' },
                    { targetRole: 'parent' },
                    { recipientId: req.user.id }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching parent notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

module.exports = router;
