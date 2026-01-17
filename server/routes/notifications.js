const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const verifyToken = require('../middleware/auth');

// Get all notifications
router.get('/', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Notification (System or Admin)
router.post('/', verifyToken, async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
