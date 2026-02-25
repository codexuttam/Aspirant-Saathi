const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const submitRoutes = require("./routes/submit.routes");
const attemptRoutes = require("./routes/attempt.routes");
const refundRoutes = require("./routes/refund.routes");
const contactRoutes = require("./routes/contact.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", submitRoutes);
app.use("/api", attemptRoutes);
app.use("/api/refund", refundRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = app;
