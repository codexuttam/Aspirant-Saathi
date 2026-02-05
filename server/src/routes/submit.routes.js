const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");
const Attempt = require("../models/Attempt");
const structuralParser = require("../utils/structuralParser");
const evaluationEngine = require("../utils/evaluationEngine");

const router = express.Router();

router.post(
  "/submit",
  authMiddleware,
  upload.single("answerImage"),
  async (req, res) => {
    try {
      const { question, exam, answerText } = req.body;

      if (!answerText && !req.file) {
        return res.status(400).json({
          error: "Either typed answer or image is required",
        });
      }

      // 🔍 Structural analysis
      const structureResult = structuralParser(answerText || "");

      // 🧠 Evaluation engine
      const evaluationResult = evaluationEngine(structureResult, exam);

      const attempt = await Attempt.create({
        userId: req.userId,
        exam,
        question,
        answerText,
        imagePath: req.file ? req.file.path : null,
        structureAnalysis: structureResult,
        evaluation: evaluationResult,
        status: "evaluated",
      });

      res.json({
        message: "Answer evaluated successfully",
        attemptId: attempt._id,
        evaluation: evaluationResult,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);


module.exports = router;
