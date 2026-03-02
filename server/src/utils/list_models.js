require("dotenv").config({ path: "server/.env" });

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("Available Gemini Models:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.error("No models found. Check API key.", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

listAllModels();
