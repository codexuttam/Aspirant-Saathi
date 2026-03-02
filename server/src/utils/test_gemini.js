const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
// Try multiple paths to find the .env
require("dotenv").config({ path: path.join(__dirname, "../../../server/.env") });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API Key found in .env. Checking paths...");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-pro"
        ];

        console.log(`Using Key: ${apiKey.substring(0, 8)}...`);

        for (const m of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`✅ Success with model: ${m}`);
            } catch (err) {
                console.log(`❌ Failed with model: ${m} - ${err.message}`);
            }
        }
    } catch (err) {
        console.error("List test failed:", err);
    }
}

listModels();
