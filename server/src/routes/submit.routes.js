const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const { evaluateFromImage, checkQuestionRelevance } = require("../utils/geminiEvaluator");

const router = express.Router();

/**
 * POST /api/submit
 * Upload handwritten answer image + question
 * Gemini reads image and evaluates answer
 */
router.post(
  "/submit",
  authMiddleware,
  upload.single("answerImage"),
  async (req, res) => {
    try {
      const { question, exam, answerText } = req.body;

      // 🔒 Validation
      if (!question || !exam) {
        return res.status(400).json({
          error: "Question and exam are required",
        });
      }

      if (!req.file && !answerText) {
        return res.status(400).json({
          error: "Either a handwritten answer image or answer text is required",
        });
      }

      // 0. Fetch User
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.tokens === undefined) {
        user.tokens = 100; // Legacy user bonus
        await user.save();
      }

      // Check if question is relevant
      const isRelevant = await checkQuestionRelevance(question);
      if (!isRelevant) {
        // Penalty for irrelevant question
        if (!user.isPro) {
          user.tokens = Math.max(0, user.tokens - 10);
          await user.save();
        }
        return res.status(400).json({
          error: "Irrelevant question",
          message: "Honey please ask a relevant question so that I can evaluate it 💅✨",
          tokens: user.tokens // return updated tokens so frontend can update
        });
      }

      const tokensNeeded = req.file ? 20 : 5;

      if (user.tokens < tokensNeeded && !user.isPro) {
        return res.status(402).json({
          error: "Insufficient tokens",
          required: tokensNeeded,
          current: user.tokens,
          redirect: "/pricing"
        });
      }

      // 🧠 Gemini Evaluation
      const evaluation = await evaluateFromImage({
        imagePath: req.file ? req.file.path : null, // Handle optional file
        question,
        exam,
        marks: req.body.marks || 10,
        answerText, // Pass text
      });

      // Deduct Tokens
      if (!user.isPro) {
        user.tokens -= tokensNeeded;
        await user.save();
      }

      // 💾 Save attempt
      const attempt = await Attempt.create({
        userId: req.userId,
        exam,
        question,
        imagePath: req.file ? req.file.path : null, // Handle optional file
        answerText, // Save text
        status: "evaluated",
        structureAnalysis: evaluation.structureAnalysis, // Save structure metadata
        evaluation,
      });

      // ✅ Response
      res.json({
        message: "Answer evaluated successfully",
        attemptId: attempt._id,
        evaluation,
        tokens: user.tokens,
      });
    } catch (err) {
      console.error("SUBMIT ERROR 👉", err);

      // If the evaluator provided a statusCode (e.g., 429), forward that to the client
      const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

      // If there's a retryAfter value (seconds), include Retry-After header so clients can backoff
      if (err.retryAfter) {
        res.set("Retry-After", String(err.retryAfter));
      }

      res.status(status).json({
        error: "Evaluation failed",
        details: err.message,
      });
    }
  }
);

module.exports = router;
