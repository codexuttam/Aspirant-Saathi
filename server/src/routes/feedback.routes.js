const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { sendFeedbackEmail } = require("../utils/email");

const User = require("../models/User");

router.post("/", verifyToken, async (req, res) => {
    const { rating, message } = req.body;

    if (!rating) {
        return res.status(400).json({ error: "Rating is required." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        await sendFeedbackEmail(user.name, user.email, rating, message);
        res.status(200).json({ message: "Feedback sent successfully" });
    } catch (error) {
        console.error("Feedback Route Error:", error);
        res.status(500).json({ error: "Failed to send feedback. Please try again later." });
    }
});

module.exports = router;
