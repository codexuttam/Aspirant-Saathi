const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exam: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answerText: {
      type: String,
    },

    imagePath: {
      type: String,
    },

    status: {
      type: String,
      enum: ["uploaded", "evaluated"],
      default: "uploaded",
    },

    // 🔍 Structural Parser Output (IBC analysis)
    structureAnalysis: {
      type: Object,
    },

    // 🧠 Evaluation Engine Output (Marks + Feedback)
    evaluation: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);
