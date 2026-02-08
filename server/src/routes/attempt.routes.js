const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const Attempt = require("../models/Attempt");
const evaluateFromImage = require("../utils/geminiEvaluator");

const router = express.Router();

// Get all attempts of logged-in user
router.get("/attempts", authMiddleware, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

// Get a single attempt (for details page)
router.get("/attempts/:id", authMiddleware, async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempt" });
  }
});

// Re-evaluate an existing attempt with a new exam format
router.post("/attempts/:id/re-evaluate", authMiddleware, async (req, res) => {
  try {
    const { exam } = req.body;
    if (!exam) return res.status(400).json({ error: "Exam type is required" });

    const attempt = await Attempt.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    // Call Gemini Evaluator again with new exam
    console.log(`Re-evaluating attempt ${req.params.id} for exam ${exam}`);
    console.log(`Image Path: ${attempt.imagePath}, Question: ${attempt.question}`);

    const evaluation = await evaluateFromImage({
      imagePath: attempt.imagePath,
      question: attempt.question,
      exam: exam,
      answerText: attempt.answerText,
    });
    console.log("Evaluation successful");

    // Update attempt
    attempt.exam = exam;
    attempt.evaluation = evaluation;
    attempt.structureAnalysis = evaluation.structureAnalysis;
    attempt.status = "evaluated"; // Just in case

    await attempt.save();

    res.json(attempt);
  } catch (err) {
    console.error("Re-evaluation error:", err);
    res.status(500).json({ error: "Re-evaluation failed", details: err.message });
  }
});

module.exports = router;
