const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const Attempt = require("../models/Attempt");

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

module.exports = router;
