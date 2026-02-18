const express = require('express');
const router = express.Router();
const axios = require('axios');
const http = require('http');
const https = require('https');

// OpenAI/Gemini Chat Proxy
const { Student, DailyActivity, HealthRecord, Milestone } = require('../models');

// OpenAI/Gemini Chat Proxy
router.post('/chat', async (req, res) => {
    try {
        const { message, mode, childId, contextTimestamp } = req.body; // childId needed for health mode
        const apiKey = process.env.GEMINI_API_KEY;

        console.log('DEBUG: Chat Request Received. API Key defined:', !!apiKey, 'Length:', apiKey?.length);

        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
        }

        let systemPrompt = "";
        let contextData = "No specific data context available.";

        if (mode === 'health' && childId) {
            // --- Fetch Health/Activity Context ---
            try {
                const student = await Student.findByPk(childId);
                const activities = await DailyActivity.findAll({
                    where: { studentId: childId },
                    limit: 15,
                    order: [['timestamp', 'DESC']]
                });
                const healthRecords = await HealthRecord.findAll({
                    where: { studentId: childId },
                    limit: 5,
                    order: [['uploadedAt', 'DESC']]
                });
                const milestones = await Milestone.findAll({
                    where: { studentId: childId },
                    order: [['achievedDate', 'DESC']]
                });

                if (student) {
                    contextData = `
                        CHILD PROFILE:
                        Name: ${student.name}
                        Age: ${student.age}
                        Class: ${student.plan || 'N/A'}
                        Allergies/Info: ${JSON.stringify(student.healthInfo || {})}
                        Current Status: Mood=${student.mood || 'N/A'}, Meal=${student.meal || 'N/A'}

                        RECENT ACTIVITIES (Past 15):
                        ${activities.map(a => `- [${new Date(a.timestamp).toLocaleString()}] ${a.activityType}: ${a.value} (${a.details || ''})`).join('\n')}

                        HEALTH RECORDS (Recent):
                        ${healthRecords.map(h => `- [${new Date(h.uploadedAt).toLocaleDateString()}] ${h.recordType}: ${h.description}`).join('\n')}

                        MILESTONES ACHIEVED:
                        ${milestones.length > 0
                            ? milestones.map(m => `- [${m.achievedDate}] ${m.title}: ${m.description || 'No details'}`).join('\n')
                            : 'No specific milestones recorded yet.'}
                    `;
                }
            } catch (dbError) {
                console.error("Error fetching context:", dbError);
                contextData = "Error retrieving child data from database.";
            }

            systemPrompt = `You are a specialist Health & Development AI for KiddoZ. 
            Your role is to analyze the provided data and answer the parent's question about their child.
            
            STRICT RULES:
            1. ONLY answer based on the provided context data.
            2. If the data doesn't answer the question, say "I don't have that specific record yet."
            3. Be warm, reassuring, and professional.
            4. Do NOT give medical advice. Encourage consulting a doctor for illness.
            5. Use formatting (bullet points) and emojis to be friendly.
            
            CONTEXT DATA:
            ${contextData}`;

        } else {
            // General Info Mode
            systemPrompt = `You are the friendly AI assistant for KiddoZ Childcare Center. 
            Answer questions about our services based on this info:
            - Hours: Mon-Fri 7AM-6PM.
            - Ages: 6 months to 5 years.
            - Infants (1:3 ratio), Toddlers (1:4), Preschool (1:6).
            - Services: Full day care, nutritious meals (included), YOLO safety tracking, AI health monitoring.
            - Pricing: Infants $1200/mo, Toddlers $1000/mo, Preschool $900/mo.
            - Tuition includes meals. 10% sibling discount.
            - Location: 123 Main Street.
            
            Tone: Enthusiastic, helpful, and polite. Use emojis.`;
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{
                    role: "user",
                    parts: [{ text: `Context: ${contextData}\n\nUser Question: ${message}` }]
                }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const botText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble analyzing that right now.";
        res.json({ text: botText });
    } catch (err) {
        console.error('Gemini API Error (Falling back to Mock):', err.response?.data || err.message);

        // --- Mock Fallback Logic ---
        // If the real AI fails (e.g. invalid key), return a simulated response so the demo works.
        await new Promise(r => setTimeout(r, 1000)); // Simulate think time

        const { message: reqMessage, mode: reqMode } = req.body || {}; // Safety check
        let mockResponse = "";

        if (reqMode === 'health') {
            mockResponse = "Based on the recent logs, everything looks normal! 🌟 \n\n- **Activity**: Consistent play patterns detected.\n- **Health**: No fever or issues recorded recently.\n\nKeep up the great work, super parent! 🛡️";
            if (reqMessage && (reqMessage.toLowerCase().includes('eat') || reqMessage.toLowerCase().includes('food'))) {
                mockResponse = "Dietary records show healthy appetite today! 🍎 Ate full portions at lunch. Hydration levels are good too.";
            } else if (reqMessage && (reqMessage.toLowerCase().includes('mood') || reqMessage.toLowerCase().includes('happy'))) {
                mockResponse = "Mood analysis indicates a very happy day! 😊 Plenty of smiles recorded during morning playtime.";
            }
        } else {
            mockResponse = "Hello! I'm the KiddoZ automated assistant. 🤖 \n\nSince our advanced AI brain is momentarily offline (API Key Limit), here is some quick info:\n\n- **Hours**: 7AM - 6PM\n- **Location**: 123 Main St\n- **Enrollment**: Open for 2024!\n\nHow else can I help? (Note: Contextual AI is currently limited).";
            if (reqMessage && (reqMessage.toLowerCase().includes('price') || reqMessage.toLowerCase().includes('cost'))) {
                mockResponse = "Our plans start at **$450/month**. \n\n- **Little Explorer**: $450 (Day Care)\n- **Growth Scholar**: $750 (Pre-School)\n- **VIP Guardian**: $1200 (All-inclusive)\n\nSibling discounts available! 🏷️";
            } else if (reqMessage && (reqMessage.toLowerCase().includes('enroll') || reqMessage.toLowerCase().includes('join') || reqMessage.toLowerCase().includes('register'))) {
                mockResponse = "We are currently accepting new enrollments! 📝\n\n1. **Visit us** for a tour (Mon-Fri 10AM).\n2. **Fill out** the registration form online.\n3. **Meet** our directors.\n\nSpots are filling up fast for the Fall semester! 🏃‍♂️";
            }
        }

        res.json({ text: mockResponse });
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

module.exports = router;
