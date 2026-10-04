const mongoose = require("mongoose");

const monitoringSchema = new mongoose.Schema(
    {
        trainingCentre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingCentre",
            required: true,
        },

        sourceType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },

        sourceFile: {
            type: String,
            default: "",
        },

        detectionTime: {
            type: Date,
            default: Date.now,
        },

        attendance: {
            expectedStudents: {
                type: Number,
                default: 0,
            },

            detectedStudents: {
                type: Number,
                default: 0,
            },

            attendancePercentage: {
                type: Number,
                default: 0,
            },
        },

        trainer: {
            expected: {
                type: Boolean,
                default: true,
            },

            detected: {
                type: Boolean,
                default: false,
            },
        },

        equipment: [
            {
                name: {
                    type: String,
                    required: true,
                },

                requiredQuantity: {
                    type: Number,
                    default: 0,
                },

                detectedQuantity: {
                    type: Number,
                    default: 0,
                },

                compliant: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        detections: [
            {
                className: {
                    type: String,
                    required: true,
                },

                confidence: {
                    type: Number,
                    default: 0,
                },

                count: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        complianceScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: ["compliant", "warning", "non-compliant"],
            default: "warning",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Monitoring",
    monitoringSchema
);