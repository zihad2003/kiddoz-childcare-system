const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
    try {
        const { message, mode } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
        }

        let systemPrompt = mode === 'health'
            ? `You are a Health Analysis AI for KiddoZ. Tone: Professional. If user asks about a specific child ID, pretend to look up their specific vitals (Temp, Mood, Meal) from the database context provided in the previous turn.`
            : "You are the friendly AI assistant for KiddoZ. Answer questions about Pre-School, Day Care, and Nanny services. Tone: Warm, helpful.";

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: message }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const botText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection glitch. Please try again.";
        res.json({ text: botText });
    } catch (err) {
        console.error('Gemini API Error:', err.response?.data || err.message);
        res.status(500).json({ message: 'AI Assistant is temporarily unavailable.' });
    }
});

module.exports = router;
