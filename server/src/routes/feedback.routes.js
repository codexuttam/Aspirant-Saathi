const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { sendFeedbackEmail } = require("../utils/email");

router.post("/", verifyToken, async (req, res) => {
    const { rating, message } = req.body;

    if (!rating) {
        return res.status(400).json({ error: "Rating is required." });
    }

    try {
        await sendFeedbackEmail(req.user.name, req.user.email, rating, message);
        res.status(200).json({ message: "Feedback sent successfully" });
    } catch (error) {
        console.error("Feedback Route Error:", error);
        res.status(500).json({ error: "Failed to send feedback. Please try again later." });
    }
});

module.exports = router;
