const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const verifyToken = require('../middleware/auth');

// Get all notifications
// Get all notifications (Admin/Staff view)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const role = req.user.role || 'staff';

        const whereClause = {
            [Op.or]: [
                { targetRole: 'all' },
                { targetRole: role }, // 'admin', 'staff', 'nurse', etc.
                { recipientId: req.user.id }
            ]
        };

        // If generic admin, show admin alerts too
        if (role === 'admin' || role === 'superadmin') {
            whereClause[Op.or].push({ targetRole: 'admin' });
        }

        const notifications = await Notification.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: err.message });
    }
});

// Create Notification (System or Admin)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, message, type, startRole, recipientId, studentId, details, targetRole } = req.body;

        const notification = await Notification.create({
            title,
            message,
            type: type || 'info',
            targetRole: targetRole || 'all',
            recipientId,
            studentId,
            details
        });

        res.status(201).json(notification);
    } catch (err) {
        console.error("Error creating notification:", err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
