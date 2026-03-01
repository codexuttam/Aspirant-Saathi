const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: { type: String, required: true },
        email: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        message: { type: String, required: true, maxlength: 500 },
        examType: { type: String, default: "Aspirant" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
