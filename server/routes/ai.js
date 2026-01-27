const express = require('express');
const router = express.Router();
const axios = require('axios');
const http = require('http');

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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
        console.error('Gemini API Error:', err.response?.data || err.message);
        const detail = err.response?.data?.error?.message || err.message;
        res.status(500).json({ message: `AI Assistant error: ${detail}` });
    }
});

// MJPEG Proxy for IP Webcam
// Usage: /api/ai/proxy-stream?url=http://192.168.0.102:8080/video
router.get('/proxy-stream', (req, res) => {
    const streamUrl = req.query.url;

    if (!streamUrl) {
        return res.status(400).send('Missing "url" query parameter');
    }

    console.log(`[Proxy] Connecting to stream: ${streamUrl}`);

    // Fetch the stream from the IP camera
    const request = http.get(streamUrl, (streamRes) => {
        // Prepare headers for the browser
        // We MUST override CORS headers to allow the frontend canvas to read the pixels
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'no-cache',
            'Connection': 'close',
            'Content-Type': streamRes.headers['content-type'] || 'multipart/x-mixed-replace; boundary=--boundary'
        };

        res.writeHead(streamRes.statusCode, headers);

        // Pipe the data
        streamRes.pipe(res);

        streamRes.on('end', () => {
            console.log('[Proxy] Stream ended');
            res.end();
        });
    });

    request.on('error', (err) => {
        console.error('[Proxy] Stream Error:', err.message);
        res.status(500).end();
    });

    // Cleanup when client disconnects
    res.on('close', () => {
        request.destroy();
    });
});

module.exports = router;
