const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const submitRoutes = require("./routes/submit.routes");
const attemptRoutes = require("./routes/attempt.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes);   // public auth routes
app.use("/api", protectedRoutes);   // protected test route
app.use("/api", submitRoutes);      // submit answer route
app.use("/api", attemptRoutes);     // attempts + attempt details

module.exports = app;
