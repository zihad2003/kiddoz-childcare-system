const express = require('express');
const router = express.Router();
const { Incident, Student, Notification } = require('../models');
const auth = require('../middleware/auth');

// Get all incidents (Admin/Staff) or filter by parent
router.get('/', auth, async (req, res) => {
    try {
        let where = {};
        if (req.user.role === 'parent') {
            // High efficiency filter for parents
            const students = await Student.findAll({ where: { parentId: req.user.id }, attributes: ['id'] });
            const studentIds = students.map(s => s.id);
            where.studentId = studentIds;
        }

        const incidents = await Incident.findAll({
            where,
            include: [{ model: Student, as: 'student', attributes: ['name'] }],
            order: [['updatedAt', 'DESC']]
        });
        res.json(incidents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cipher extraction failed (Server Error)' });
    }
});

// Post new incident
router.post('/', auth, async (req, res) => {
    try {
        // Whitelist validation
        const { studentId, type, severity, description, location, actionTaken, witnesses, teacherSignature } = req.body;

        const student = await Student.findByPk(studentId);
        if (!student) return res.status(404).json({ message: 'Subject node not found' });

        const incident = await Incident.create({
            studentId,
            type,
            severity,
            description,
            location,
            actionTaken,
            witnesses,
            teacherSignature,
            reportedBy: req.user.email,
            status: 'Parent_Pending'
        });

        // Trigger Notification to Parent
        await Notification.create({
            studentId: student.id,
            recipientId: student.parentId,
            targetRole: 'parent',
            title: `⚠️ Security Incident Report: ${student.name}`,
            message: `A new ${type} report has been filed for ${student.name}. Please review and authorize.`,
            type: 'warning'
        });

        res.status(201).json(incident);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Protocol commit failure' });
    }
});

// Update signature / status
router.patch('/:id', auth, async (req, res) => {
    try {
        const incident = await Incident.findByPk(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Record not found' });

        // Security check for parent signature
        if (req.user.role === 'parent' && req.body.parentSignature) {
            const student = await Student.findByPk(incident.studentId);
            if (student.parentId !== req.user.id) return res.status(403).json({ message: 'Unauthorized signature link' });

            await incident.update({
                parentSignature: req.body.parentSignature,
                parentNotifiedAt: new Date(),
                parentNotified: true,
                status: 'Resolved'
            });
        } else {
            // General updates by staff/admin
            await incident.update(req.body);
        }

        res.json(incident);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Link synchronization failure' });
    }
});

module.exports = router;
