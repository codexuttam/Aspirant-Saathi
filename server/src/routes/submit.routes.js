const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");
const Attempt = require("../models/Attempt");
const evaluateFromImage = require("../utils/geminiEvaluator");

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
      const { question, exam } = req.body;

      // 🔒 Validation
      if (!question || !exam) {
        return res.status(400).json({
          error: "Question and exam are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Handwritten answer image is required",
        });
      }

      // 🧠 Gemini Vision Evaluation
      const evaluation = await evaluateFromImage({
        imagePath: req.file.path,
        question,
        exam,
      });

      // 💾 Save attempt
      const attempt = await Attempt.create({
        userId: req.userId,
        exam,
        question,
        imagePath: req.file.path,
        status: "evaluated",
        evaluation,
      });

      // ✅ Response
      res.json({
        message: "Answer evaluated successfully",
        attemptId: attempt._id,
        evaluation,
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
