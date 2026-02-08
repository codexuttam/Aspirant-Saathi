const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFromImage({ imagePath, question, exam, answerText }) {
  // Use gemini-2.5-flash by default as it supports both text and image inputs efficiently and has high limits
  const modelName = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";
  console.log("Using Gemini Model:", modelName);
  const model = genAI.getGenerativeModel({ model: modelName });

  // Construct the base prompt
  let prompt = `
You are a highly critical, top-tier examiner for the ${exam} examination (e.g., UPSC Civil Services). Your task is to evaluate the student's answer with extreme rigor. Do not be lenient.

Question:
"${question}"

Evaluation Criteria:
1. **Directives**: Pay close attention to the directive word (e.g., "Analyze", "Critically Examine", "Discuss"). If the student fails to address the specific demand of the directive, penalize them heavily.
2. **Structure (IBC)**:
   - **Introduction**: Must define key terms or provide context/data. It should be concise (10-15% of answer).
   - **Body**: Must cover multiple dimensions (Social, Economic, Political, etc.) and include substantiation (examples, reports, articles, data).
   - **Conclusion**: Must be forward-looking, offer a way forward, or summarize effectively.
3. **Content Quality**: Look for depth, relevant examples, flow of arguments, and clarity. Generic points should receive low marks.
4. **Presentation**: Use of headings, subheadings, and points is encouraged.

Task:
- Read the answer (text or image) carefully.
- Identify the exact strengths and specific weaknesses.
- Provide a score out of 10 based on strict ${exam} standards (usually >6 is rare/exceptional).
- Analyze the structure explicitly.

Respond ONLY in valid JSON format:

{
  "totalMarks": number,
  "breakup": {
    "introduction": number,
    "body": number,
    "conclusion": number
  },
  "structureAnalysis": {
    "intro": { "present": boolean, "feedback": "Brief comment on intro quality" },
    "body": { "present": boolean, "feedback": "Brief comment on body depth/dimensions" },
    "conclusion": { "present": boolean, "feedback": "Brief comment on conclusion" }
  },
  "strengths": ["Specific point 1", "Specific point 2"],
  "weaknesses": ["Critical gap 1", "Critical gap 2", "Missed dimension"],
  "suggestions": ["Actionable advice 1", "Actionable advice 2"],
  "improvedAnswer": "A brief, model outline or improved version of the introduction/conclusion."
}
`;

  // Prepare the content parts for generation
  const parts = [];

  // If validation ensures at least one (image or text) is present:
  if (imagePath) {
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      parts.push({
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/png", // Assuming png/jpeg, gemini handles common types
        },
      });
      prompt += "\n\n(Evaluate the handwritten answer in the image above)";
    } else {
      console.warn(`⚠️ Warning: Image file not found at ${imagePath}. Proceeding without image.`);
    }
  }

  if (answerText) {
    prompt += `\n\nStudent Answer:\n"${answerText}"`;
  }

  parts.push({ text: prompt });

  let result;
  try {
    result = await model.generateContent(parts);
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
