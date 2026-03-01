const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { sendFeedbackEmail } = require("../utils/email");

const User = require("../models/User");
const Feedback = require("../models/Feedback");

// POST /api/feedback — Submit feedback (auth required)
router.post("/", verifyToken, async (req, res) => {
    const { rating, message, examType } = req.body;

    if (!rating) {
        return res.status(400).json({ error: "Rating is required." });
    }
    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Save to DB
        const feedback = new Feedback({
            userId: user._id,
            name: user.name || "Anonymous",
            email: user.email,
            rating,
            message: message.trim(),
            examType: examType || "Aspirant",
        });
        await feedback.save();

        // Send email notification
        try {
            await sendFeedbackEmail(user.name, user.email, rating, message);
        } catch (emailErr) {
            console.error("Email notification failed:", emailErr.message);
        }

        res.status(200).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.error("Feedback Route Error:", error);
        res.status(500).json({ error: "Failed to submit feedback. Please try again later." });
    }
});

// GET /api/feedback — Fetch all public feedbacks (no auth)
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("name rating message examType createdAt");
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Fetch Feedbacks Error:", error);
        res.status(500).json({ error: "Failed to fetch feedbacks." });
    }
});

module.exports = router;
