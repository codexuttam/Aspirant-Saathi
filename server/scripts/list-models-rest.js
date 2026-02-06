require('dotenv').config({ path: './.env' });
const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

(async () => {
    if (!API_KEY) {
        console.error('GEMINI_API_KEY is not set in server/.env');
        process.exit(1);
    }

    try {
        const res = await fetch(url);
        if (!res.ok) {
            const text = await res.text();
            console.error('ListModels request failed', res.status, res.statusText, text);
            process.exit(1);
        }
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error calling ListModels:', err.message || err);
        process.exit(1);
    }
})();
