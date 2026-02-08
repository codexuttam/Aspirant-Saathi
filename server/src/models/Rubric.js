const mongoose = require("mongoose");

const rubricSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        criteria: [
            {
                name: { type: String, required: true },
                maxMarks: { type: Number, required: true },
                description: { type: String },
            },
        ],
        totalMarks: {
            type: Number,
            required: true,
        },
        guidelines: {
            type: String, // General guidelines for the evaluator
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rubric", rubricSchema);
