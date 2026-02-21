const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/email");

router.post("/", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
    }

    try {
        await sendContactEmail(name, email, subject || "No Subject", message);
        res.status(200).json({ message: "Contact message sent successfully" });
    } catch (error) {
        console.error("Contact Route Error:", error);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
});

module.exports = router;
