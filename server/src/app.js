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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Note: MongoDB connection is performed in server.js before starting the HTTP server.
// This file only defines the Express app and routes so the server can decide when
// to start listening (after DB connection is established).

// Routes
app.use("/api/auth", authRoutes);   // public auth routes
app.use("/api", protectedRoutes);   // protected test route
app.use("/api", submitRoutes);      // submit answer route
app.use("/api", attemptRoutes);     // attempts + attempt details
app.use("/api/refund", refundRoutes); // refund routes

module.exports = app;
