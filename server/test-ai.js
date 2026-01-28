require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("1. Checking API Key...");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("❌ ERROR: No API Key found in .env file!");
        return;
    }
    console.log(`✅ API Key found: ${key.substring(0, 8)}...`);

    console.log("2. Connecting to Google AI...");
    try {
        const genAI = new GoogleGenerativeAI(key);
        // Try the standard model first
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("3. Sending 'Hello' to AI...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("\n🎉 SUCCESS! The AI replied:");
        console.log("------------------------------------------------");
        console.log(text);
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("\n❌ FAILED to connect to Google AI:");
        console.error(error.message);

        if (error.message.includes("fetch failed")) {
            console.log("👉 HINT: Check your internet connection.");
        } else if (error.message.includes("API key not valid")) {
            console.log("👉 HINT: Your API Key in .env is wrong.");
        } else if (error.message.includes("404")) {
            console.log("👉 HINT: 'gemini-pro' model might not be available. Try 'gemini-1.5-flash'.");
        }
    }
}

testGemini();