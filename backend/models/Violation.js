const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
    {
        trainingCentre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingCentre",
            required: true,
        },

        monitoring: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Monitoring",
            default: null,
        },

        type: {
            type: String,
            enum: [
                "attendance-shortage",
                "trainer-absent",
                "equipment-missing",
                "equipment-shortage",
                "infrastructure-issue",
                "other",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },

        detectedValue: {
            type: Number,
            default: null,
        },

        expectedValue: {
            type: Number,
            default: null,
        },

        evidenceImage: {
            type: String,
            default: "",
        },

        detectedAt: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["open", "reviewed", "resolved"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Violation",
    violationSchema
);