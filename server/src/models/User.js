const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  password: String, // Optional if using phone/google
  googleId: String,
  profileImage: { type: String, default: "" },
  exam: String,
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  tokens: { type: Number, default: 100 },
});

module.exports = mongoose.model("User", userSchema);
