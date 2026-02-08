const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        defaultRubricId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rubric",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
