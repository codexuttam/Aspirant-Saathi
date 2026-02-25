const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/upload");
const Refund = require("../models/Refund");

const router = express.Router();

const jwt = require("jsonwebtoken");

// POST /api/refund/request
router.post(
    "/request",
    upload.single("screenshot"),
    async (req, res) => {
        try {
            const { issue, email, name } = req.body;

            // Check for user ID from token (optional)
            let userId = null;
            try {
                const token = req.headers.authorization?.split(" ")[1];
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
                    userId = decoded.id;
                }
            } catch (e) {
                // ignore invalid token
            }

            if (!issue) {
                return res.status(400).json({ error: "Issue description is required" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Payment screenshot is required" });
            }

            const refund = await Refund.create({
                userId,
                email: email || "No email provided", // Ideally fetch from user via userId if not provided, but frontend should send it or we fetch it.
                name: name || "No name provided",
                issue,
                screenshotPath: req.file.path,
            });

            res.status(201).json({
                message: "Refund request submitted successfully. We will review it within 14 days.",
                refundId: refund._id,
            });
        } catch (err) {
            console.error("Refund Request Error:", err);
            res.status(500).json({ error: "Failed to submit refund request" });
        }
    }
);

module.exports = router;
