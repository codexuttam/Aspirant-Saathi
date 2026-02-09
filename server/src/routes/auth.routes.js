const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const dns = require("dns").promises;

// Helper to validate email domain
async function isEmailDomainValid(email) {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (err) {
    return false;
  }
}

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Basic Syntax Check
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // 2. Check existing user in DB
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "Email already exists" });

  // 3. Cloud Check: Verify Domain MX Records
  const isDomainValid = await isEmailDomainValid(email);
  if (!isDomainValid) {
    return res.status(400).json({ error: "Invalid email domain. Please enter a valid email address." });
  }

  const hashed = await bcrypt.hash(password, 10);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Create User (Unverified)
  const user = await User.create({
    name,
    email,
    password: hashed,
    otp,
    otpExpires,
    isVerified: false
  });

  // 4. Send Email & Handle Failure
  try {
    const { sendOTP } = require("../utils/email");
    await sendOTP(email, otp);

    res.json({
      message: "OTP sent to your email",
      email: email,
      otpSent: true
    });
  } catch (emailErr) {
    // If sending fails, delete the user so they can try again
    await User.findByIdAndDelete(user._id);
    console.error("Email send failed:", emailErr);
    return res.status(500).json({ error: "Failed to send verification email. Please check your email address." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Store OTP
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send Email
  const { sendOTP } = require("../utils/email");
  await sendOTP(user.email, otp);

  res.json({
    message: "OTP sent to your email",
    email: user.email,
    otpSent: true
  });
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // Clear OTP and set Verified
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  await user.save();

  // Generate Token
  const token = jwt.sign({ id: user._id }, "secretkey");

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    }
  });
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send Email
  const { sendOTP } = require("../utils/email");
  await sendOTP(user.email, otp);

  res.json({ message: "OTP resent successfully" });
});

// Check if email exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});

// Get Current User Profile
router.get("/me", require("../middleware/auth.middleware"), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Profile Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/avatar", require("../middleware/auth.middleware"), upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Construct public URL
    // Assuming server serves /uploads static route
    const imageUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
