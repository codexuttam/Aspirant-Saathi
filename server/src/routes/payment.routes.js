const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Helper to get key from server safely
router.get('/config', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_fake_key' });
});

router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_fake_key';
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'fake_secret';

        // Developer / Demo Mode: Simulate payment if real keys don't exist
        if (keyId.includes('rzp_test_zH6P') || keyId === 'rzp_test_fake_key') {
            return res.json({
                id: `order_fake_${Date.now()}`,
                amount: 499 * 100,
                currency: "INR",
                isSimulated: true
            });
        }

        const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: 499 * 100, // exact amount as mentioned in Pricing.jsx
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json({ error: "Error creating order from Razorpay" });

        res.json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ error: error?.error?.description || "Razorpay API Error: Verify your keys." });
    }
});

router.post('/verify', authMiddleware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'fake_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is successful, upgrade user
            const user = await User.findById(req.userId);
            if (user) {
                user.isPro = true;
                user.tokens = 99999; // Arbitrarily high for unlimited
                await user.save();
                return res.status(200).json({ message: "Payment verified successfully", isPro: true });
            }
            return res.status(404).json({ message: "User not found!" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

// SIMULATE ENDPOINT FOR DEMO
router.post('/verify-simulated', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            user.isPro = true;
            user.tokens = 99999;
            await user.save();
            return res.status(200).json({ message: "Simulated payment successful", isPro: true });
        }
        return res.status(404).json({ message: "User not found!" });
    } catch (error) {
        console.error("Simulated verification error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

module.exports = router;
