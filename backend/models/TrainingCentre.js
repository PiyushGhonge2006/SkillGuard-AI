const mongoose = require("mongoose");

const trainingCentreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        centreCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        trainerName: {
            type: String,
            required: true,
            trim: true,
        },

        expectedStudents: {
            type: Number,
            required: true,
            min: 1,
        },

        requiredEquipment: [
            {
                name: {
                    type: String,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "TrainingCentre",
    trainingCentreSchema
);