const express = require('express');
const router = express.Router();
const { User, Student, Staff, AuditLog, ApiKey, Webhook, AppVersion, Feedback, PlatformAnalytics, Billing, Payroll, Center, Bulletin, AppSettings, sequelize } = require('../models');
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
        const revenue = (await Billing.sum('amount', { where: { status: 'Paid' } })) || 0;
        const pendingRevenue = (await Billing.sum('amount', { where: { status: 'Pending' } })) || 0;
        const totalExpenses = (await Payroll.sum('amount', { where: { status: 'Paid' } })) || 0;

        res.json({
            totalUsers,
            totalStudents,
            revenue,
            pendingRevenue,
            totalExpenses,
            netProfit: revenue - totalExpenses,
            growth: 12.5,
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

router.post('/users', async (req, res) => {
    try {
        const { email, fullName, role, password, phone, status } = req.body;
        // Basic check for existing user
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'User already registered' });

        const newUser = await User.create({
            email,
            fullName,
            role: role || 'parent',
            password: password || 'kiddoz123', // Default password if manually enrolled
            phone,
            status: status || 'active'
        });
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (user) {
            // Remove empty password from update if present
            const updateData = { ...req.body };
            if (updateData.password === '') delete updateData.password;

            await user.update(updateData);
            res.json(user);
        } else {
            console.log(`User not found: ${req.params.id}`);
            res.status(404).json({ message: 'Target User Not Found in Matrix' });
        }
    } catch (err) {
        console.error('Update User Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (user) {
            // Prevent self-deletion if current user
            if (user.id === req.user.id) return res.status(400).json({ message: 'Cannot delete own account' });

            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } else {
            console.log(`User to delete not found: ${req.params.id}`);
            res.status(404).json({ message: 'Destruction Target (User) Not Found' });
        }
    } catch (err) {
        console.error('Delete User Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// === Center Management ===
router.get('/centers/:id/details', async (req, res) => {
    try {
        const center = await Center.findOne({ where: { id: req.params.id } });
        if (!center) return res.status(404).json({ message: 'Center not found' });

        const students = await Student.findAll({
            where: { centerId: center.id },
            limit: 10,
            order: [['createdAt', 'DESC']]
        });
        const staff = await Staff.findAll({
            where: { centerId: center.id },
            limit: 10
        });

        const studentCount = await Student.count({ where: { centerId: center.id } });
        const staffCount = await Staff.count({ where: { centerId: center.id } });

        const occupancy = Math.round((studentCount / (center.capacity || 100)) * 100);

        // Mocking some trend data for the detailed view
        const occupancyTrend = [
            { name: 'Week 1', value: Math.max(0, Math.round(occupancy * 0.8)) },
            { name: 'Week 2', value: Math.max(0, Math.round(occupancy * 0.9)) },
            { name: 'Week 3', value: occupancy },
            { name: 'Week 4', value: Math.min(100, Math.round(occupancy * 1.05)) }
        ];

        res.json({
            ...center.toJSON(),
            students,
            staff,
            studentCount,
            staffCount,
            occupancyTrend,
            revenue: 125000, // Still mocking revenue per center for now
        });
    } catch (err) {
        console.error('Fetch Center Details Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/centers', async (req, res) => {
    try {
        const centers = await Center.findAll();

        // Enhance centers with counts
        const enhancedCenters = await Promise.all(centers.map(async (center) => {
            const studentCount = await Student.count({ where: { centerId: center.id } });
            const staffCount = await Staff.count({ where: { centerId: center.id } });
            const centerRevenue = await Billing.sum('amount', {
                where: {
                    status: 'Paid',
                    studentId: { [Op.in]: (await Student.findAll({ where: { centerId: center.id }, attributes: ['id'] })).map(s => s.id) }
                }
            }) || 0;

            return {
                ...center.toJSON(),
                studentCount,
                staffCount,
                revenue: centerRevenue,
                occupancy: Math.round((studentCount / (center.capacity || 100)) * 100)
            };
        }));

        res.json(enhancedCenters);
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
        const center = await Center.findOne({ where: { id: req.params.id } });
        if (center) {
            await center.update(req.body);
            res.json(center);
        } else {
            console.log(`Center not found for update: ${req.params.id}`);
            res.status(404).json({ message: 'Target Node (Center) Not Found' });
        }
    } catch (err) {
        console.error('Update Center Error:', err);
        res.status(500).json({ message: 'Server error during center update' });
    }
});
router.delete('/centers/:id', async (req, res) => {
    try {
        const center = await Center.findOne({ where: { id: req.params.id } });
        if (center) {
            // Check if there are linked students or staff
            const studentCount = await Student.count({ where: { centerId: center.id } });
            const staffCount = await Staff.count({ where: { centerId: center.id } });

            if (studentCount > 0 || staffCount > 0) {
                return res.status(400).json({
                    message: `Conflict: Center has ${studentCount} students and ${staffCount} staff. Reassign them before deleting.`
                });
            }

            await center.destroy();
            res.json({ message: 'Center deleted successfully' });
        } else {
            console.log(`Center not found for delete: ${req.params.id}`);
            res.status(404).json({ message: 'Decommission Target (Center) Not Found' });
        }
    } catch (err) {
        console.error('Delete Center Error:', err);
        res.status(500).json({ message: 'Server error during center deletion' });
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
        const item = await Feedback.findOne({ where: { id: req.params.id } });
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

// === Staff Management ===
router.get('/staff/all', async (req, res) => {
    try {
        const staff = await Staff.findAll();
        res.json(staff);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.post('/staff', async (req, res) => {
    try {
        const member = await Staff.create(req.body);
        res.json(member);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.put('/staff/:id', async (req, res) => {
    try {
        const member = await Staff.findOne({ where: { id: req.params.id } });
        if (member) {
            await member.update(req.body);
            res.json(member);
        } else { res.status(404).json({ message: 'Not found' }); }
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.delete('/staff/:id', async (req, res) => {
    try {
        await Staff.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// === Content/Bulletins ===
router.get('/bulletins', async (req, res) => {
    try {
        const bulletins = await Bulletin.findAll({ order: [['createdAt', 'DESC']] });
        res.json(bulletins);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.post('/bulletins', async (req, res) => {
    try {
        const bulletin = await Bulletin.create(req.body);
        res.json(bulletin);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.delete('/bulletins/:id', async (req, res) => {
    try {
        await Bulletin.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// === Settings ===
router.get('/settings', async (req, res) => {
    try {
        const settings = await AppSettings.findAll();
        res.json(settings);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

router.post('/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        const [setting, created] = await AppSettings.findOrCreate({
            where: { settingKey: key },
            defaults: { settingValue: JSON.stringify(value) }
        });
        if (!created) {
            await setting.update({ settingValue: JSON.stringify(value) });
        }
        res.json(setting);
    } catch (err) { res.status(500).json({ message: 'Error' }); }
});

// === Financials ===
router.get('/financials/overview', async (req, res) => {
    try {
        const revenueByPlan = await Billing.findAll({
            attributes: ['plan', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
            where: { status: 'Paid' },
            group: ['plan']
        });

        const expensesByType = await Payroll.findAll({
            attributes: ['type', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
            where: { status: 'Paid' },
            group: ['type']
        });

        // MySQL compatible monthly aggregation
        const monthlyStats = await sequelize.query(`
            SELECT 
                MONTH(createdAt) as month_num,
                MONTHNAME(createdAt) as month_name,
                SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as revenue
            FROM Billings
            GROUP BY month_num, month_name
            ORDER BY month_num ASC
            LIMIT 6
        `, { type: sequelize.QueryTypes.SELECT });

        const monthlyRevenue = monthlyStats.map(s => ({
            month: s.month_name.substring(0, 3),
            revenue: s.revenue || 0,
            expenses: 40000 // Fallback for demo since joining Payrolls across months is complex in one query
        }));

        res.json({
            revenueByPlan,
            expensesByType,
            monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue : [
                { month: 'Jan', revenue: 45000, expenses: 32000 },
                { month: 'Feb', revenue: 52000, expenses: 34000 },
                { month: 'Mar', revenue: 48000, expenses: 33000 },
                { month: 'Apr', revenue: 61000, expenses: 38000 },
                { month: 'May', revenue: 55000, expenses: 36000 },
                { month: 'Jun', revenue: 67000, expenses: 40000 },
            ],
            summary: {
                totalRevenue: await Billing.sum('amount', { where: { status: 'Paid' } }) || 0,
                totalExpenses: await Payroll.sum('amount', { where: { status: 'Paid' } }) || 0,
                outstandingInvoices: await Billing.count({ where: { status: 'Pending' } }),
                pendingPayroll: await Payroll.count({ where: { status: 'Pending' } }),
                netProfit: (await Billing.sum('amount', { where: { status: 'Paid' } }) || 0) - (await Payroll.sum('amount', { where: { status: 'Paid' } }) || 0)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// === Catch-all for Diagnostics ===
router.use((req, res) => {
    console.log(`Unmatched SuperAdmin Route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: 'SuperAdmin route not matched',
        path: req.originalUrl,
        method: req.method
    });
});

module.exports = router;
