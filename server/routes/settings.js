const express = require('express');
const router = express.Router();
const { AppSettings } = require('../models');

// Default settings structure
const DEFAULT_SETTINGS = {
    // General Settings
    'general.notifications': { value: true, category: 'general', description: 'Enable email alerts for staff' },
    'general.maintenance': { value: false, category: 'general', description: 'Maintenance mode - disables parent access' },
    'general.autoBackup': { value: true, category: 'general', description: 'Enable daily automatic database backups' },
    'general.darkMode': { value: false, category: 'general', description: 'Enable dark mode UI theme' },

    // Security Settings
    'security.sessionTimeout': { value: '1hr', category: 'security', description: 'User session timeout duration' },
    'security.require2FA': { value: false, category: 'security', description: 'Require two-factor authentication for admin' },
    'security.passwordExpiry': { value: 90, category: 'security', description: 'Password expiry period in days' },
    'security.loginAttempts': { value: 5, category: 'security', description: 'Maximum failed login attempts before lockout' },

    // Operational Settings
    'operational.checkinStart': { value: '07:00', category: 'operational', description: 'Daily check-in start time' },
    'operational.checkoutEnd': { value: '18:00', category: 'operational', description: 'Daily check-out end time' },
    'operational.maxCapacity': { value: 100, category: 'operational', description: 'Maximum student capacity' },
    'operational.staffRatio': { value: 5, category: 'operational', description: 'Staff to child ratio (children per staff)' },
    'operational.lateGracePeriod': { value: 15, category: 'operational', description: 'Late pickup grace period in minutes' },
    'operational.tempThreshold': { value: 100.4, category: 'operational', description: 'Temperature alert threshold in °F' },

    // Communication Settings
    'communication.emailEnabled': { value: true, category: 'communication', description: 'Enable email notifications' },
    'communication.smsEnabled': { value: false, category: 'communication', description: 'Enable SMS notifications' },
    'communication.notificationFrequency': { value: 'immediate', category: 'communication', description: 'Parent notification frequency' },
    'communication.emergencyChannels': { value: ['email', 'sms'], category: 'communication', description: 'Emergency alert channels' },

    // Data Management Settings
    'data.autoDelete': { value: false, category: 'data', description: 'Automatically delete old records' },
    'data.retentionPeriod': { value: '5yr', category: 'data', description: 'Data retention period' },
    'data.exportFormat': { value: 'csv', category: 'data', description: 'Default export format' }
};

// Initialize default settings
const initializeSettings = async () => {
    try {
        for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
            const existing = await AppSettings.findOne({ where: { settingKey: key } });
            if (!existing) {
                await AppSettings.create({
                    settingKey: key,
                    settingValue: JSON.stringify(config.value),
                    category: config.category,
                    description: config.description
                });
            }
        }
        console.log('Settings initialized successfully');
    } catch (error) {
        console.error('Error initializing settings:', error.message);
    }
};

let settingsInitialized = false;

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
    try {
        // Initialize settings on first request if not already done
        if (!settingsInitialized) {
            await initializeSettings();
            settingsInitialized = true;
        }

        const settings = await AppSettings.findAll();

        // Transform to a more usable format
        const settingsMap = {};
        settings.forEach(setting => {
            settingsMap[setting.settingKey] = {
                value: JSON.parse(setting.settingValue),
                category: setting.category,
                description: setting.description,
                updatedAt: setting.updatedAt,
                updatedBy: setting.updatedBy
            };
        });

        res.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// GET /api/settings/:category - Get settings by category
router.get('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const settings = await AppSettings.findAll({ where: { category } });

        const settingsMap = {};
        settings.forEach(setting => {
            settingsMap[setting.settingKey] = {
                value: JSON.parse(setting.settingValue),
                category: setting.category,
                description: setting.description,
                updatedAt: setting.updatedAt,
                updatedBy: setting.updatedBy
            };
        });

        res.json(settingsMap);
    } catch (error) {
        console.error('Error fetching settings by category:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings - Update multiple settings
router.put('/', async (req, res) => {
    try {
        const updates = req.body; // { "general.notifications": true, "security.sessionTimeout": "2hr", ... }
        const updatedBy = req.user?.email || 'admin';

        const results = [];
        for (const [key, value] of Object.entries(updates)) {
            const setting = await AppSettings.findOne({ where: { settingKey: key } });
            if (setting) {
                await setting.update({
                    settingValue: JSON.stringify(value),
                    updatedBy
                });
                results.push({ key, success: true });
            } else {
                results.push({ key, success: false, error: 'Setting not found' });
            }
        }

        res.json({ message: 'Settings updated', results });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// PUT /api/settings/:key - Update a single setting
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const updatedBy = req.user?.email || 'admin';

        const setting = await AppSettings.findOne({ where: { settingKey: key } });
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }

        await setting.update({
            settingValue: JSON.stringify(value),
            updatedBy
        });

        res.json({ message: 'Setting updated successfully', setting });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

module.exports = router;
