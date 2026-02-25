const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    await sendOTP(email, otp, "register");

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
  await sendOTP(user.email, otp, "login");

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

  const isFirstTime = !user.isVerified;

  // Clear OTP and set Verified
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  await user.save();

  const { sendWelcomeEmail, sendAdminNewUserNotification } = require("../utils/email");
  // Always send welcome/login email
  sendWelcomeEmail(user.name || "Aspirant", user.email, !isFirstTime).catch(console.error);

  if (isFirstTime) {
    sendAdminNewUserNotification(user.name, user.email).catch(console.error);
  }

  // Generate Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey");

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      tokens: user.tokens
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
  await sendOTP(user.email, otp, user.isVerified ? "login" : "register");

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

// Update Profile (Name & Email)
router.put("/update-profile", require("../middleware/auth.middleware"), async (req, res) => {
  try {
    const { name, email, exam, hobbies } = req.body;
    const userId = req.userId;

    const updates = {};
    if (name) updates.name = name;
    if (exam !== undefined) updates.exam = exam;
    if (hobbies !== undefined) updates.hobbies = hobbies;

    // If email is being updated, check if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updates.email = email;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// Google Login Route
// Google Login Route
// Google Login Route
router.post("/google", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) return res.status(400).json({ error: "No access token provided" });

  try {
    // Fetch User Info using Access Token
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const payload = await userInfoResponse.json();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) return res.status(400).json({ error: "Email not provided by Google" });

    // Find or Create User
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        isVerified: true, // Google emails are verified
        password: "" // No password for Google users
      });
      isNewUser = true;

      const { sendAdminNewUserNotification } = require("../utils/email");
      sendAdminNewUserNotification(user.name, user.email).catch(console.error);
    } else {
      // Update existing user with Google ID and picture if missing
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
      }
      if (!user.profileImage) user.profileImage = picture;

      await user.save();
    }

    const { sendWelcomeEmail } = require("../utils/email");
    sendWelcomeEmail(user.name || "Aspirant", user.email, !isNewUser).catch(console.error);

    // Generate specific JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        exam: user.exam, // Include exam
        detailsRequired: !user.exam, // If exam is missing, prompt for details
        tokens: user.tokens
      }
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// Phone Auth - Send OTP
router.post("/send-otp-phone", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ error: "Phone number required" });

  try {
    let user = await User.findOne({ phoneNumber });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (!user) {
      // Create new user (Signup flow implicitly)
      user = await User.create({
        phoneNumber,
        otp,
        otpExpires,
        isVerified: false
      });
    } else {
      // Update existing (Login flow)
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send SMS via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await twilioClient.messages.create({
        body: `Your Aspirant-Saathi OTP is: ${otp}. Valid for 10 mins.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log(`[HTTP GET SMS] OTP sent via Twilio to ${phoneNumber}`);
    } else {
      // Simulate SMS
      console.log(`[SMS SIMULATION] OTP for ${phoneNumber}: ${otp}`);
    }

    res.json({
      message: "OTP sent to your phone",
      phoneNumber,
      otpSent: true,
      dev_otp: otp // For testing convenience
    });
  } catch (err) {
    console.error("Phone Auth Error:", err);
    res.status(500).json({ error: "Failed to process phone number" });
  }
});

// Phone Auth - Verify OTP
router.post("/verify-otp-phone", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        exam: user.exam,
        detailsRequired: !user.name || !user.email || !user.exam,
        tokens: user.tokens
      }
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Complete Profile (Name, Email, Exam)
router.post("/complete-profile", require("../middleware/auth.middleware"), async (req, res) => {
  try {
    const { name, email, exam } = req.body;
    const userId = req.userId;

    const currentUser = await User.findById(userId);
    const isFirstTimeEmail = !currentUser.email && !!email;

    const updates = {};
    if (name) updates.name = name;
    if (exam) updates.exam = exam;

    if (email) {
      const existing = await User.findOne({ email });
      // If email exists and it's NOT the current user
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ error: "Email already taken" });
      }
      updates.email = email;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");

    if (isFirstTimeEmail) {
      const { sendWelcomeEmail } = require("../utils/email");
      sendWelcomeEmail(user.name || currentUser.name || "Aspirant", user.email).catch(console.error);
    }

    res.json({
      user,
      message: "Profile updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
