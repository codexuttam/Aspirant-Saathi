// fs no longer needed — images are passed as in-memory buffers from multer memoryStorage
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFromImage({ imageBuffer, mimeType, question, exam, marks, answerText }) {
  const modelName = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";
  console.log("Using Gemini Model:", modelName);
  const model = genAI.getGenerativeModel({ model: modelName });

  // ─────────────────────────────────────────────────────────
  //  MARKS → LENGTH & DEPTH MAPPING (scaled to exam reality)
  // ─────────────────────────────────────────────────────────
  let wordCountGuide, depthGuide, structurePrescription, paragraphTarget;

  const m = Number(marks) || 10;

  if (m <= 5) {
    wordCountGuide = "200-300 words (sharp and precise, ~1 page)";
    depthGuide = "Short but complete. Strong single-line intro, 2-3 focused body points with brief examples, one-line punchy conclusion.";
    paragraphTarget = "4-5 paragraphs total";
    structurePrescription = "Intro (1 para) -> Body (2-3 tight paras) -> Conclusion (1 para)";
  } else if (m <= 10) {
    wordCountGuide = "500-700 words (comprehensive, ~2 full pages)";
    depthGuide = "Detailed intro with context, 3-4 well-developed body paragraphs each covering a distinct dimension with data/examples/case studies, strong forward-looking conclusion with way forward.";
    paragraphTarget = "6-8 paragraphs total";
    structurePrescription = "Intro (1-2 paras) -> Body (3-4 paras with distinct sub-angles: economic, social, political, environment, constitutional, etc.) -> Conclusion (1 para with way forward)";
  } else if (m <= 15) {
    wordCountGuide = "900-1200 words (very detailed, ~3-4 full pages)";
    depthGuide = "Rich contextual introduction with statistics or quote. Body must cover 4-5 distinct dimensions in separate paragraphs, each with specific examples, committee recommendations, government schemes, court judgements, international comparisons where relevant. Conclusion must prescribe a concrete way forward with policy recommendations.";
    paragraphTarget = "10-13 paragraphs total";
    structurePrescription = "Intro (2 paras: hook + definition/context) -> Body (5-6 thematic paras) -> Conclusion (1-2 paras: synthesis + way forward with specific recommendations)";
  } else if (m <= 20) {
    wordCountGuide = "1400-1800 words (exhaustive, ~5-6 pages)";
    depthGuide = "Commanding introduction with a quote, statistic, or provocative statement. Body must be multidimensional: historical background, current status, challenges, international perspective, constitutional/legal angle, government initiatives (scheme names, years, budgets), expert opinions, inter-linkages. Conclusion must give comprehensive way forward citing specific measures, global best practices, and a vision statement.";
    paragraphTarget = "13-16 paragraphs total";
    structurePrescription = "Intro (2 paras) -> Historical context (1 para) -> Current scenario (2 paras) -> Challenges/Issues (2 paras) -> Government Initiatives (1-2 paras) -> International angle (1 para) -> Way forward/Solutions (2 paras) -> Conclusion (1-2 paras)";
  } else if (m <= 25) {
    wordCountGuide = "2000-2800 words (very exhaustive, ~7-8 pages)";
    depthGuide = "Comprehensive answer resembling a mini-essay. Starts with an impactful intro (quote, case study, statistic). Body systematically covers: definition & scope, historical evolution, constitutional/statutory framework, socio-economic dimensions, environmental angle, gender/marginalized communities angle, international comparisons, landmark Supreme Court cases or committee reports, government programs with specific names/years/outcomes, criticisms and challenges. Conclusion: multi-point way forward with time-bound recommendations and a visionary closing statement.";
    paragraphTarget = "18-22 paragraphs total";
    structurePrescription = "Hook Intro (2 paras) -> Background & Evolution (2 paras) -> Multidimensional Body (8-10 distinct thematic paras) -> Critique/Challenges (2 paras) -> Way Forward (2-3 paras) -> Conclusion (1 para)";
  } else if (m <= 30) {
    wordCountGuide = "3000-4000 words (near-essay level, ~9-11 pages)";
    depthGuide = "An exceptionally thorough response. Introduction must be gripping — use a relevant quote from a constitutional expert, historical figure, or a striking statistic. The body must be encyclopedic: constitutional provisions, statutory frameworks, historical evolution, political dimensions, economic implications, social impact with data, environmental considerations, judicial pronouncements with case names, international treaties or comparisons, critiques of existing policies, failure analysis, and success stories. Every paragraph must have a specific example, data point, or authoritative reference. Conclusion must prescribe a detailed, actionable, vision-driven way forward spanning governance, civil society, and international cooperation.";
    paragraphTarget = "22-28 paragraphs total";
    structurePrescription = "Powerful Intro (2-3 paras) -> Historical & Constitutional Foundation (2-3 paras) -> Deep Multidimensional Body (10-12 thematic para clusters) -> Judicial & International Angle (2 paras) -> Failures & Critiques (2 paras) -> Detailed Way Forward (3 paras) -> Inspiring Conclusion (1 para)";
  } else {
    // 50 marks and above — full essay/paper level
    wordCountGuide = "5000-7000 words (full essay level, 14-20 pages equivalent)";
    depthGuide = "This is a full-length essay or dissertation-style answer. It must be a comprehensive, authoritative, and beautifully written piece. Introduction must open with a powerful quote, anecdote, or philosophical reflection (3-4 paragraphs). The body must be organized into clearly demarcated thematic sections covering ALL possible dimensions: historical, constitutional, political, economic, social, environmental, technological, gender, international, and ethical. Every claim must be backed by specific data, case studies, government reports, Supreme Court rulings, expert opinions, or international comparisons. Include thematic sections with mini-headers. Identify failures, systemic gaps, and structural issues. Provide a solutions section with actionable, phased, and institution-specific recommendations. Conclusion must be a powerful synthesis — forward-looking, visionary, and memorable.";
    paragraphTarget = "35-45 paragraphs organized under clear thematic sections";
    structurePrescription = "Epic Intro (3-4 paras with anecdote/quote/context) -> Definitional Clarity (1-2 paras) -> Historical Trajectory (3 paras) -> Constitutional & Legal Framework (2-3 paras) -> Socio-Economic Analysis (4-5 paras) -> Environment/Gender/Technology Dimensions (3-4 paras) -> Government Initiatives (3-4 paras with specific schemes, budgets, outcomes) -> Judicial Landscape (2-3 paras) -> International Comparison & Best Practices (2-3 paras) -> Failures, Criticisms & Gaps (2-3 paras) -> Comprehensive Way Forward (4-5 paras) -> Visionary Conclusion (2 paras)";
  }

  // ─────────────────────────────────────────────────────────
  //  EXAM-SPECIFIC CONTEXT
  // ─────────────────────────────────────────────────────────
  let examInstruction = "";
  let structureGuide = structurePrescription;

  if (exam.includes("UPSC CSE (Mains) - GS") || exam.includes("State PSC")) {
    examInstruction = `Standard: Civil Services Mains (UPSC/State PSC).
    Approach: Analytical, multidimensional, balanced — cover Social, Economic, Political, Constitutional, Environmental, Ethical, International dimensions wherever relevant.
    Tone: Mature, administrative, neutral but insightful.
    Must Include: Government schemes (with names & years), Supreme Court cases, committee reports, international comparisons, data/statistics, critical analysis, and a strong constructive way forward.`;
    if (m <= 10) structureGuide = "Tight Intro -> 3-4 distinct dimensional body paras -> Punchy conclusion with way forward.";
  } else if (exam.includes("Optional") || exam.includes("Judicial")) {
    examInstruction = `Standard: Subject Specialist / Judicial Services.
    Focus: Technical precision, academic rigor, heavy substantiation with scholars/theories or Acts/Sections/Case Laws.
    Tone: Academic, authoritative, citation-heavy.
    Must Include: Specific legal sections, landmark judgements with year, scholar quotes, doctrines, and a nuanced academic conclusion.`;
  } else if (exam.includes("Essay")) {
    examInstruction = `Standard: Essay Paper.
    Focus: Flow, coherence, literary quality, varied perspectives (philosophical, sociological, economic, administrative, historical), personal reflections, anecdotes.
    Avoid: Bullet points. Pure paragraph prose only.
    Must Include: Opening anecdote or powerful quote, thesis statement, thematic paragraphs each making a distinct argument, counterarguments addressed, and a memorable conclusion.`;
    structureGuide = "Intro with Anecdote/Quote -> Thesis -> Thematic Body Paras -> Counterargument -> Synthesis -> Conclusion";
    wordCountGuide = m > 100 ? "1000-1200 words of pure flowing prose" : "500-700 words of pure flowing prose";
  } else if (exam.includes("CAPF") || exam.includes("CDS")) {
    examInstruction = `Standard: Defence Officer (CAPF/CDS).
    Focus: Clear argumentation (For/Against), security perspective, governance efficiency, precise and confident language.
    Must Include: Security implications, operational examples, constitutional provisions, international defence context.`;
    structureGuide = "Intro -> For Arguments -> Against Arguments -> Balanced Synthesis -> Security-Focused Conclusion.";
  } else if (exam.includes("IB") || exam.includes("RAW")) {
    examInstruction = `Standard: Intelligence Bureau.
    Focus: Security implications, threat landscape, crisp precise language, zero fluff.
    Must Include: Threat categories, intelligence failures, structural reforms, legal framework (UAPA, NSA, etc.), operational recommendations.`;
    structureGuide = "Problem Definition -> Threat Analysis -> Historical Incidents -> Legal Framework -> Security Assessment -> Recommendations";
  } else if (exam.includes("SSC")) {
    examInstruction = `Standard: SSC/Clerical Recruitment.
    Focus: Format compliance, grammar excellence, vocabulary precision.
    Priority: Strict adherence to word limit and prescribed format.`;
    structureGuide = "Strict format adherence as per question type.";
  } else {
    examInstruction = `Standard: ${exam} competitive examination. Apply best practices for this exam type.`;
  }

  // ─────────────────────────────────────────────────────────
  //  MASTER PROMPT
  // ─────────────────────────────────────────────────────────
  let prompt = `
You are a WORLD-CLASS competitive exam evaluator and model answer writer with 20+ years experience producing top-rank answers for UPSC, State PSC, CAPF, IB and other Indian competitive exams.

===================================================
QUESTION: "${question}"
EXAM: ${exam}
MAX MARKS: ${m}
===================================================

EVALUATION PARAMETERS:
1. Directive Compliance — Did the student address the exact directive (Analyze/Discuss/Critically Evaluate/Examine)?
2. Relevance & Focus — Does every sentence serve the question?
3. Structural Quality — Intro, Body, Conclusion: each present and well-developed?
4. Content Depth — Facts, data, schemes, cases, scholars cited?
5. Balance — Multiple dimensions covered? (Social/Economic/Political/Constitutional/Environmental/Ethical/International)
6. Presentation — Flow, transitions, language quality?

===================================================
CRITICAL TASK: WRITE THE COMPLETE MODEL ANSWER
===================================================

You MUST write a COMPLETE, FULL-LENGTH, PERFECT model answer in the "improvedAnswer" field.

MANDATORY REQUIREMENTS FOR THE MODEL ANSWER:
[TARGET LENGTH]: ${wordCountGuide}
[PARAGRAPH TARGET]: Write AT LEAST ${paragraphTarget}
[STRUCTURE TO FOLLOW]: ${structureGuide}
[DEPTH REQUIRED]: ${depthGuide}

ABSOLUTE PROHIBITIONS — NEVER DO THESE:
- DO NOT write a brief outline or summary
- DO NOT say "the answer would include..." — WRITE the actual content
- DO NOT truncate with "..." or "etc."
- DO NOT end early because the answer is getting long — write EVERY paragraph in full
- DO NOT produce less than the minimum word count target
- DO NOT write a placeholder — produce the real, complete, full content

MANDATORY CONTENT REQUIREMENTS:
- CRITICAL EXCEPTION: If the uploaded image or text does NOT contain any valid handwritten or typed answer to the question (e.g. blank page, unrelated photo, or pure gibberish), you MUST skip all other instructions. Set "strengths", "weaknesses", and "suggestions" to contain EXACTLY ONE item: "the uploaded image does not conatin any valid answer". Also set "improvedAnswer" to: "the uploaded image does not conatin any valid answer", and totalMarks to 0.
- Include SPECIFIC examples: scheme names with years, specific data/statistics, Supreme Court case names with years, committee names
- Each body paragraph must have: topic sentence + 2-4 supporting sentences with evidence + linking sentence to next para
- Transitions between sections must be smooth and natural
- Government initiatives must be mentioned with full names, launch year, and impact data
- If constitutional provisions are relevant, cite specific Article numbers
- Way forward must be specific, actionable, multi-point, and visionary — never generic platitudes

EXAM CONTEXT: ${examInstruction}

Respond ONLY in valid JSON (no markdown wrapping, no text outside JSON):

{
  "totalMarks": number,
  "maxMarks": ${m},
  "breakup": {
    "introduction": number,
    "body": number,
    "conclusion": number
  },
  "structureAnalysis": {
    "intro": { "present": boolean, "feedback": "detailed 2-3 sentence feedback on intro quality" },
    "body": { "present": boolean, "feedback": "detailed 2-3 sentence feedback on body depth and dimensions covered" },
    "conclusion": { "present": boolean, "feedback": "detailed 2-3 sentence feedback plus specific improvement suggestion" }
  },
  "strengths": ["specific strength 1 with example from the answer", "specific strength 2 with example"],
  "weaknesses": ["specific weakness 1 with exact suggestion to fix it", "specific weakness 2 with suggestion"],
  "suggestions": ["actionable targeted suggestion 1", "actionable targeted suggestion 2", "actionable targeted suggestion 3"],
  "improvedAnswer": "THE COMPLETE FULL-LENGTH MODEL ANSWER GOES HERE. This MUST be ${wordCountGuide} long. Write every single paragraph in full. Do not abbreviate. Write exactly as the ultimate topper would — factually rich, analytically sharp, structurally perfect, and impressively comprehensive. This field must contain the ENTIRE ANSWER — not a summary, not an outline, THE FULL TEXT with all paragraphs fully written."
}
`;

  // ─────────────────────────────────────────────────────────
  //  BUILD CONTENT PARTS
  // ─────────────────────────────────────────────────────────
  const parts = [];


  if (imageBuffer) {
    parts.push({
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType || "image/jpeg",
      },
    });
    prompt += "\n\n(Evaluate the handwritten answer in the image above)";
  }

  if (answerText) {
    prompt += `\n\nStudent Answer: \n"${answerText}"`;
  }

  parts.push({ text: prompt });

  let result;
  try {
    result = await model.generateContent(parts);
  } catch (err) {
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

    const message = err.message || String(err);
    let statusCode = err.status || err.statusCode || err.code || 500;
    if (typeof statusCode === "string") {
      const asNum = parseInt(statusCode, 10);
      if (!Number.isNaN(asNum)) statusCode = asNum;
    }
    if (message.includes("Too Many Requests") || message.includes("Quota exceeded") || statusCode === 429) {
      statusCode = 429;
    }

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
  console.log("Raw Response from Gemini:", rawText);

  // Very robust JSON extraction using regex to capture everything from the first '{' to the last '}'
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("Gemini did not return any JSON object:", rawText);
    throw new Error("Gemini returned an invalid response format (No JSON found).");
  }

  const cleaned = jsonMatch[0];
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse extracted JSON:", cleaned);
    // If it fails, maybe try to strip out those pesky markdown blocks again manually
    const furtherCleaned = cleaned.replace(/```json|```/g, "").trim();
    return JSON.parse(furtherCleaned);
  }
}

async function checkQuestionRelevance(question) {
  const modelName = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
You are an AI assistant designed to filter questions submitted by students preparing for competitive exams(like UPSC, state PSC, writing practice, academic, general knowledge, etc). 

Your task is to determine whether the submitted text is a valid, logical prompt that could reasonably be answered in an exam or evaluated as an essay / answer. 

Return ONLY valid JSON format with a single boolean field "isRelevant".

Examples of Irrelevant questions(Return { "isRelevant": false }):
  - "my name is shashank"
    - "hello there"
    - "how are you today"
    - "12345"
    - Gibberish like "asdfg"
      - "tell me a joke"

Examples of Relevant questions(Return { "isRelevant": true }):
  - "Discuss the impact of climate change on Indian agriculture."
    - "What are the fundamental rights guaranteed by the Indian Constitution?"
    - "Critically analyze the role of non-cooperation movement in India's freedom struggle."
    - "Write an essay on Women Empowerment."
    - "Explain the doctrine of basic structure."

Determine relevance for:
    "${question}"
      `;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in relevance check");
    const cleaned = jsonMatch[0].replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);
    return parsed.isRelevant === true;
  } catch (err) {
    console.warn("Relevance check failed, proceeding to evaluation by default", err.message);
    return true;
  }
}

module.exports = { evaluateFromImage, checkQuestionRelevance };
