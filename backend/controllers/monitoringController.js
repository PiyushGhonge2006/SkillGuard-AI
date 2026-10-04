const Monitoring = require("../models/Monitoring");
const TrainingCentre = require("../models/TrainingCentre");
const Violation = require("../models/Violation");

const {
    runComplianceCheck,
} = require("../utils/complianceEngine");

// GET all monitoring records
const getMonitoringRecords = async (req, res) => {
    try {
        const records = await Monitoring.find()
            .populate("trainingCentre")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch monitoring records",
            error: error.message,
        });
    }
};

// GET monitoring records for a centre
const getCentreMonitoring = async (req, res) => {
    try {
        const records = await Monitoring.find({
            trainingCentre: req.params.centreId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch centre monitoring records",
            error: error.message,
        });
    }
};

// GET single monitoring record
const getMonitoringById = async (req, res) => {
    try {
        const record = await Monitoring.findById(
            req.params.id
        ).populate("trainingCentre");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Monitoring record not found",
            });
        }

        res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch monitoring record",
            error: error.message,
        });
    }
};

// Create monitoring record
const createMonitoring = async (req, res) => {
    try {
        const {
            trainingCentre,
            sourceType,
            sourceFile,
            detectedStudents = 0,
            trainerDetected = false,
            detectedObjects = [],
            detections = [],
        } = req.body;

        const centre = await TrainingCentre.findById(
            trainingCentre
        );

        if (!centre) {
            return res.status(404).json({
                success: false,
                message: "Training centre not found",
            });
        }

        const compliance = runComplianceCheck({
            expectedStudents: centre.expectedStudents,
            detectedStudents,
            trainerExpected: true,
            trainerDetected,
            requiredEquipment: centre.requiredEquipment,
            detectedObjects,
        });

        const monitoring = await Monitoring.create({
            trainingCentre,
            sourceType,
            sourceFile,
            attendance: compliance.attendance,

            trainer: {
                expected: true,
                detected: trainerDetected,
            },

            equipment: compliance.equipment,

            detections,

            complianceScore: compliance.complianceScore,

            status: compliance.status,
        });

        // Create violations
        const createdViolations = [];

        for (const violation of compliance.violations) {
            const savedViolation = await Violation.create({
                trainingCentre,
                monitoring: monitoring._id,

                type: violation.type,
                title: violation.title,
                description: violation.description,
                severity: violation.severity,

                detectedValue:
                    violation.detectedValue ?? null,

                expectedValue:
                    violation.expectedValue ?? null,

                evidenceImage: sourceFile || "",
            });

            createdViolations.push(savedViolation);
        }

        res.status(201).json({
            success: true,
            message: "Monitoring record created successfully",

            data: {
                monitoring,
                violations: createdViolations,
            },
        });
    } catch (error) {
        console.error("CREATE MONITORING ERROR:", error);

        res.status(400).json({
            success: false,
            message: "Failed to create monitoring record",
            error: error.message,
        });
    }
};

module.exports = {
    getMonitoringRecords,
    getCentreMonitoring,
    getMonitoringById,
    createMonitoring,
};