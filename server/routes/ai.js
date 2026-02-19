const express = require('express');
const router = express.Router();
const axios = require('axios');
const http = require('http');
const https = require('https');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Overwrite or use unique? User asked "to add demo video by admin", plural/singular?
        // Let's use a standard name for the primary demo.
        cb(null, 'demo_yolo.mp4');
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

// OpenAI/Gemini Chat Proxy
const { Student, DailyActivity, HealthRecord, Milestone } = require('../models');
const { findManualAnswer } = require('../utils/manualQA');

// ─── Chatbot Logic (Static/Manual Mode) ──────────────────────────────────────
router.post('/chat', async (req, res) => {
    try {
        const { message, mode, childId } = req.body;
        console.log(`[Chatbot] Request received: "${message}" (Mode: ${mode})`);

        // 1. Check for manual Q&A matches (Center Info, Enrollment, etc.)
        const manualMatch = findManualAnswer(message);
        if (manualMatch && mode !== 'health') {
            console.log(`[Chatbot] Manual match found for: "${message}"`);
            return res.json({ text: manualMatch });
        }

        console.log(`[Chatbot] No specific manual match for: "${message}". Providing fallback.`);

        // 2. Specialized Fallback for Health Mode
        if (mode === 'health') {
            return res.json({
                text: "I'm currently focused on providing general center information. 🏥 For detailed health insights or recent activity logs for your child, please check the **Daily Reports** or **Health Records** tabs in your dashboard.\n\nIs there anything else I can help you with?"
            });
        }

        // 3. Catch-all for General Mode (if manualMatch failed)
        return res.json({
            text: manualMatch || "Assalamu Alaikum! I'm the KiddoZ Assistant. 🤖 I'm specialized in helping parents with info on enrollment, fees, meals, and more. \n\nHow can I help you today?"
        });

    } catch (err) {
        console.error('Chat Error:', err);
        res.status(500).json({ message: 'Internal assistant error' });
    }
});

// ─── Helper: pick http or https module based on URL ─────────────────────────
const getTransport = (url) => url.startsWith('https') ? https : http;

// ─── MJPEG Proxy Stream ───────────────────────────────────────────────────────
// Proxies an MJPEG stream from an IP camera through the backend so the browser
// never makes a direct HTTP request (avoids Mixed Content blocking on HTTPS).
// Usage: GET /api/ai/proxy-stream?url=http://192.168.0.102:8080/video
router.get('/proxy-stream', (req, res) => {
    let streamUrl = req.query.url;
    if (!streamUrl) return res.status(400).json({ error: 'Missing "url" query parameter' });

    // Normalise: append /video if not already a stream path
    try {
        const parsed = new URL(streamUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return res.status(400).json({ error: 'Only HTTP/HTTPS URLs are supported' });
        }
        if (!parsed.pathname.includes('/video') && !parsed.pathname.includes('/stream')) {
            parsed.pathname = parsed.pathname.replace(/\/$/, '') + '/video';
            streamUrl = parsed.toString();
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`[Proxy] Connecting to MJPEG stream: ${streamUrl}`);
    const transport = getTransport(streamUrl);

    const request = transport.get(streamUrl, { timeout: 15000 }, (streamRes) => {
        if (streamRes.statusCode < 200 || streamRes.statusCode >= 400) {
            if (!res.headersSent) res.status(502).json({ error: `Camera returned HTTP ${streamRes.statusCode}` });
            return;
        }

        res.writeHead(streamRes.statusCode, {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store',
            'Connection': 'keep-alive',
            'Content-Type': streamRes.headers['content-type'] || 'multipart/x-mixed-replace; boundary=--BoundaryString',
        });

        streamRes.pipe(res);
        streamRes.on('error', () => res.end());
    });

    request.on('timeout', () => {
        request.destroy();
        if (!res.headersSent) res.status(504).json({ error: 'Camera connection timed out. Verify IP, port and network.' });
    });
    request.on('error', (err) => {
        console.error('[Proxy] Error:', err.message);
        if (!res.headersSent) res.status(502).json({ error: `Cannot reach camera: ${err.message}` });
    });
    res.on('close', () => request.destroy());
});

// ─── Single-Frame Snapshot ────────────────────────────────────────────────────
// Grabs one JPEG frame from an MJPEG stream and returns it as image/jpeg.
// The frontend uses this to feed frames into the YOLO canvas without needing
// a persistent <img> src that triggers CORS taint.
// Usage: GET /api/ai/proxy-snapshot?url=http://192.168.0.102:8080/shot.jpg
router.get('/proxy-snapshot', (req, res) => {
    let snapUrl = req.query.url;
    if (!snapUrl) return res.status(400).json({ error: 'Missing "url" query parameter' });

    // IP Webcam snapshot endpoint is /shot.jpg
    try {
        const parsed = new URL(snapUrl);
        if (!parsed.pathname.includes('/shot') && !parsed.pathname.includes('/jpeg') && !parsed.pathname.includes('/snapshot')) {
            parsed.pathname = '/shot.jpg';
            snapUrl = parsed.toString();
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const transport = getTransport(snapUrl);
    const request = transport.get(snapUrl, { timeout: 5000 }, (snapRes) => {
        if (snapRes.statusCode !== 200) {
            if (!res.headersSent) res.status(502).json({ error: `Snapshot returned HTTP ${snapRes.statusCode}` });
            return;
        }
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Content-Type': snapRes.headers['content-type'] || 'image/jpeg',
        });
        snapRes.pipe(res);
    });
    request.on('timeout', () => { request.destroy(); if (!res.headersSent) res.status(504).end(); });
    request.on('error', (err) => { if (!res.headersSent) res.status(502).json({ error: err.message }); });
    res.on('close', () => request.destroy());
});

// ─── Demo Video Management ────────────────────────────────────────────────────
// Upload Demo Video
router.post('/demo-video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No video file provided' });

        const { AppSettings } = require('../models');
        const videoUrl = `/uploads/${req.file.filename}`;

        await AppSettings.upsert({
            settingKey: 'yolo.demoVideo',
            settingValue: JSON.stringify({ url: videoUrl, updatedAt: new Date() }),
            category: 'yolo',
            description: 'Path to the demo YOLO video'
        });

        res.json({ message: 'Demo video uploaded successfully', url: videoUrl });
    } catch (err) {
        console.error('Video Upload Error:', err);
        res.status(500).json({ message: 'Failed to process video upload' });
    }
});

// Get Demo Video Info
router.get('/demo-video', async (req, res) => {
    try {
        const { AppSettings } = require('../models');
        const setting = await AppSettings.findOne({ where: { settingKey: 'yolo.demoVideo' } });
        if (setting) {
            res.json(JSON.parse(setting.settingValue));
        } else {
            // Check if file actually exists in uploads
            const filePath = path.join(__dirname, '../uploads/demo_yolo.mp4');
            if (fs.existsSync(filePath)) {
                res.json({ url: '/uploads/demo_yolo.mp4' });
            } else {
                res.json({ url: null });
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch demo video info' });
    }
});

module.exports = router;
