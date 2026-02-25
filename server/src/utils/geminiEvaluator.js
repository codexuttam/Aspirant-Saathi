const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFromImage({ imagePath, question, exam, marks, answerText }) {
  // Use gemini-2.5-flash by default as it supports both text and image inputs efficiently and has high limits
  const modelName = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";
  console.log("Using Gemini Model:", modelName);
  const model = genAI.getGenerativeModel({ model: modelName });

  // Define depth and criteria based on marks
  let wordCountGuide = "150 words";
  let depthGuide = "Concise, to the point.";

  const m = Number(marks) || 10;
  if (m <= 10) {
    wordCountGuide = "250-350 words (Extensive for 10 marks)";
    depthGuide = "Highly detailed, precise, focus on key points with substantial depth.";
  } else if (m <= 15) {
    wordCountGuide = "600-800 words (Very lengthy and detailed, 3-4 pages)";
    depthGuide = "Extremely detailed, include numerous examples, multiple dimensions, comprehensive.";
  } else if (m <= 20) {
    wordCountGuide = "1000-1500 words (Multiple pages, exhaustive)";
    depthGuide = "Profound in-depth analysis, exhaustive coverage of every possible angle, way forward required.";
  } else {
    wordCountGuide = "Exhaustive length (2000-3000+ words, up to 10 pages)";
    depthGuide = "Maximum extensive depth, multidimensional, argumentative, flow is critical, leave no stone unturned.";
  }

  // Define specific exam pattern instructions
  let examInstruction = "";
  let structureGuide = "";

  // UPSC CSE & State PSC - General Studies
  if (exam.includes("UPSC CSE (Mains) - GS") || exam.includes("State PSC")) {
    examInstruction = `Standard: Civil Services (UPSC/State PSC). 
    Focus: Analytical depth, multidimensional approach (Social, Economic, Political, International, Ethical), balanced view, and constructive conclusion.
    Structure: Intro (Definition/Context) -> Body (Arguments/Dimensions/Examples) -> Conclusion (Way Forward).`;
    if (m <= 10) structureGuide = "Concise Intro/Conclusion. Focus on 3-4 strong dimensions.";
    else structureGuide = "Detailed Intro. Body must cover multiple dimensions deeply. Conclusion must be forward-looking.";
  }

  // UPSC Optionals / Law
  else if (exam.includes("Optional") || exam.includes("Judicial")) {
    examInstruction = `Standard: Subject Specialist / Judicial.
    Focus: Technical depth, use of scholars/theories (for optional) or case laws/sections (for law).
    Tone: Academic and authoritative.`;
    structureGuide = "Standard academic essay structure with heavy substantiation.";
  }

  // Essays (UPSC/CAPF)
  else if (exam.includes("Essay")) {
    examInstruction = `Standard: Essay Paper.
    Focus: Flow, coherence, anecdotes, varied perspectives, and philosophical/administrative depth.
    Avoid: Header/Footer style bullets. Use paragraph format.`;
    structureGuide = "Intro (Anecdote/Quote) -> Thesis -> Body Paragraphs (Thematic) -> Conclusion.";
    wordCountGuide = m > 100 ? "1000-1200 words" : "300-400 words";
  }

  // CAPF / Defence
  else if (exam.includes("CAPF") || exam.includes("CDS")) {
    examInstruction = `Standard: Defence Officer (CAPF/CDS).
    Focus: Argumentative (For/Against), clear stance, precise language, security perspective.
    Report Writing: Objective, third-person, factual.`;
    structureGuide = "Essay: Intro -> For/Against Args -> Synthesis. Report: Headline -> Data -> Analysis.";
  }

  // Intelligence (IB/RAW)
  else if (exam.includes("IB") || exam.includes("RAW")) {
    examInstruction = `Standard: Intelligence Bureau.
    Focus: Security implications, threat analysis, crisp and precise language. No fluff.
    Warning: Avoid flowery language. Be direct.`;
    structureGuide = "Problem -> Analysis -> Solution/Security Implication.";
  }

  // SSC / Recruitment
  else if (exam.includes("SSC")) {
    examInstruction = `Standard: SSC/Clerical Recruitment.
    Focus: Grammar, vocabulary, format compliance (Letter/Precis/Essay).
    Priority: adherence to word limit and format is supreme.`;
    structureGuide = "Strict format adherence.";
  }

  else {
    examInstruction = `Standard: ${exam} competitive exam.`;
  }

  // Construct the base prompt
  let prompt = `
You are a highly critical, top-tier examiner for the ${exam} examination. Your task is to evaluate the student's answer with extreme rigor and provide a completely fleshed-out, perfect model answer.

Question: "${question}"
Max Marks: ${m}
Expected Length: ~${wordCountGuide}
Exam Context: ${examInstruction}
Structure Guide: ${structureGuide}
Depth Required: ${depthGuide}

Evaluation Criteria:
1. **Directives**: Pay close attention to the directive word (e.g., "Analyze", "Discuss", "Critical Evaluate"). Penalize if the demand is not met.
2. **Relevance**: Does the answer directly address the question?
3. **Substantiation**: usage of examples, data, articles (for GS/Law), scholars (for Optional).

Task:
- Evaluate the student's answer (text/image) strictly against marks (${m}).
- Provide a score out of ${m}.
- If the answer is too short for ${m} marks, penalize heavily.
- For Essays, judge flow and coherence strictly.
- In the "improvedAnswer" field, you MUST write an EXTREMELY LENGTHY, comprehensive, and perfect model answer that guarantees full marks (${m}/${m}) for the ${exam} exam. You MUST strictly follow the expected length (${wordCountGuide}). If the marks require exhaustive detail (even up to 10 pages), provide it. Do not hold back. Do not summarize. Do not give a brief outline. Write the complete, perfectly structured full-length answer exactly as the ultimate topper would write it.

Respond ONLY in valid JSON format:

{
  "totalMarks": number,
  "maxMarks": ${m},
  "breakup": {
    "introduction": number,
    "body": number,
    "conclusion": number
  },
  "structureAnalysis": {
    "intro": { "present": boolean, "feedback": "string" },
    "body": { "present": boolean, "feedback": "string" },
    "conclusion": { "present": boolean, "feedback": "string" }
  },
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": ["string", "string"],
  "improvedAnswer": "The completely written, perfect, exam-ready model answer. Must be extremely detailed, factual, and perfectly match the expected length, depth, and structure requirements."
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
