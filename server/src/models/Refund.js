const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional in case user is not logged in? But usually logged in. Let's keep it optional but preferred.
    email: { type: String, required: true },
    name: { type: String },
    issue: { type: String, required: true },
    screenshotPath: { type: String, required: true }, // Path to uploaded screenshot
    status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Refund", refundSchema);
