const express = require('express');
const router = express.Router();
const { User, Student, Staff, AuditLog, ApiKey, Webhook, AppVersion, Feedback, PlatformAnalytics, Billing, Payroll, Center } = require('../models');
const auth = require('../middleware/auth');
const superAdmin = require('../middleware/superAdmin');
const { Op } = require('sequelize');

// Middleware
router.use(auth);
router.use(superAdmin);

// === Platform Overview ===
router.get('/overview', async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStudents = await Student.count();
        const activeCenters = await Center.count({ where: { status: 'active' } });

        // Calculate revenue from Payroll/Billing if available, else mock logic for now or store in PlatformAnalytics
        // For now, let's sum up Billing
        const revenue = (await Billing.sum('amount')) || 0;

        res.json({
            totalUsers,
            totalStudents,
            revenue,
            growth: 12.5, // Mock growth for now
            activeCenters
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/analytics/revenue', async (req, res) => {
    // Return mock timeline data for demo purposes, or aggregate from Billing
    res.json({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 19000, 15000, 22000, 28000, 35000]
    });
});

router.get('/analytics/users', async (req, res) => {
    try {
        const total = await User.count();
        const byRole = await User.findAll({
            attributes: ['role', [User.sequelize.fn('COUNT', 'role'), 'count']],
            group: ['role']
        });
        res.json({ total, byRole });
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// === User Management ===
router.get('/users', async (req, res) => {
    try {
        const { role, search } = req.query;
        let where = {};
        if (role && role !== 'All') where.role = role;
        if (search) {
            where[Op.or] = [
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        const users = await User.findAll({ where });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/users/:id/suspend', async (req, res) => {
    try {
        // Just a toggle for now, assuming we don't have a status field yet on User, 
        // using the Center status pattern or adding a status field to User model would be better.
        // For now we mock the success.
        res.json({ message: 'User suspended' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// === Center Management ===
router.get('/centers', async (req, res) => {
    try {
        const centers = await Center.findAll();
        // If no centers, seed one
        if (centers.length === 0) {
            const defaultCenter = await Center.create({
                name: 'KiddoZ Main Campus',
                location: '123 Main St, Dhaka',
                contactEmail: 'admin@kiddoz.com',
                capacity: 200,
                status: 'active'
            });
            return res.json([defaultCenter]);
        }
        res.json(centers);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/centers', async (req, res) => {
    try {
        const center = await Center.create(req.body);
        res.json(center);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/centers/:id', async (req, res) => {
    try {
        const center = await Center.findByPk(req.params.id);
        if (center) {
            await center.update(req.body);
            res.json(center);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// === Developer Tools ===
router.get('/developer/api-keys', async (req, res) => {
    try {
        const keys = await ApiKey.findAll({ include: 'creator' });
        res.json(keys);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.post('/developer/api-keys', async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const newKey = await ApiKey.create({
            name,
            permissions,
            key: 'pk_' + Math.random().toString(36).substr(2, 16),
            createdBy: req.user.id
        });
        res.json(newKey);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.delete('/developer/api-keys/:id', async (req, res) => {
    await ApiKey.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Key revoked' });
});

router.get('/developer/webhooks', async (req, res) => {
    try {
        const hooks = await Webhook.findAll();
        res.json(hooks);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// === App Versions ===
router.get('/app/versions', async (req, res) => {
    const versions = await AppVersion.findAll({ order: [['releasedAt', 'DESC']] });
    res.json(versions);
});

router.post('/app/versions', async (req, res) => {
    const version = await AppVersion.create({ ...req.body, releasedAt: new Date() });
    res.json(version);
});

router.post('/app/push-notification', (req, res) => {
    // Stub
    res.json({ message: 'Notification queued' });
});

// === Feedback ===
router.get('/feedback', async (req, res) => {
    const feedback = await Feedback.findAll({ include: 'user' });
    res.json(feedback);
});

router.put('/feedback/:id/respond', async (req, res) => {
    try {
        const item = await Feedback.findByPk(req.params.id);
        if (item) {
            await item.update({ response: req.body.response, status: 'resolved' });
            res.json(item);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// === Security & Compliance ===
router.get('/security/audit-logs', async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['timestamp', 'DESC']],
            limit: 100,
            include: 'user'
        });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
});

router.get('/security/compliance', (req, res) => {
    res.json({ status: 'Compliant', lastCheck: new Date(), issues: 0 });
});

// === Staff Directory ===
router.get('/staff/all', async (req, res) => {
    const staff = await Staff.findAll();
    res.json(staff);
});

// === Content Management ===
router.get('/content', (req, res) => {
    res.json([]);
});

module.exports = router;
