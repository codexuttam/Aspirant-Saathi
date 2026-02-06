const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFromImage({ imagePath, question, exam }) {
  // Allow overriding model name via env so we can pick a supported model at runtime
  const modelName = process.env.GEMINI_MODEL || "gemini-1.0-pro-vision";
  const model = genAI.getGenerativeModel({ model: modelName });

  const imageBuffer = fs.readFileSync(imagePath);

  const prompt = `
You are a strict ${exam} examiner.

Question:
"${question}"

Instructions:
- Carefully read the handwritten answer from the image
- Evaluate strictly as per ${exam} standards
- Maximum marks: 10
- Assess:
  1. Introduction
  2. Body (analysis, dimensions, examples)
  3. Conclusion (forward-looking)

Respond ONLY in valid JSON:

{
  "totalMarks": number,
  "breakup": {
    "introduction": number,
    "body": number,
    "conclusion": number
  },
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string],
  "improvedAnswer": string
}
`;

  let result;
  try {
    result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/png",
        },
      },
      { text: prompt },
    ]);
  } catch (err) {
    // If the selected model does not support generateContent or is not available,
    // try to produce a more structured error. Also attempt to list available models
    // for diagnostics only if the SDK exposes a listing method.
    try {
      if (typeof genAI.listModels === "function") {
        const models = await genAI.listModels();
        console.error("Gemini model error:", err.message || err);
        console.error("Available models (first 20 shown):", models.slice(0, 20));
      } else {
        console.error("Gemini model error (listing not available on SDK):", err.message || err);
      }
    } catch (listErr) {
      console.error("Error listing models:", listErr.message || listErr);
    }

    // Detect HTTP 429 / quota messages and extract retry information when present.
    const message = err.message || String(err);
    let statusCode = err.status || err.statusCode || err.code || 500;
    if (typeof statusCode === "string") {
      // sometimes SDKs set code to '429'
      const asNum = parseInt(statusCode, 10);
      if (!Number.isNaN(asNum)) statusCode = asNum;
    }
    if (message.includes("Too Many Requests") || message.includes("Quota exceeded") || statusCode === 429) {
      statusCode = 429;
    }

    // Try to parse retry delay: either 'Please retry in 50.28s' or JSON field "retryDelay":"50s"
    let retryAfter = null;
    const m1 = message.match(/Please retry in (\d+(?:\.\d+)?)s/);
    if (m1) retryAfter = Math.ceil(parseFloat(m1[1]));
    const m2 = message.match(/"retryDelay"\s*:\s*"(\d+)s"/);
    if (m2) retryAfter = Math.ceil(parseInt(m2[1], 10));

    const outErr = new Error(`Gemini evaluation failed: ${message}. Check GEMINI_MODEL and API access.`);
    outErr.statusCode = statusCode;
    if (retryAfter) outErr.retryAfter = retryAfter;
    throw outErr;
  }

  const rawText = result.response.text();

  // Gemini often wraps JSON in markdown
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

module.exports = evaluateFromImage;
