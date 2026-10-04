const Violation = require("../models/Violation");

// GET all violations
const getViolations = async (req, res) => {
    try {
        const violations = await Violation.find()
            .populate("trainingCentre")
            .populate("monitoring")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: violations.length,
            data: violations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch violations",
            error: error.message,
        });
    }
};

// GET single violation
const getViolationById = async (req, res) => {
    try {
        const violation = await Violation.findById(
            req.params.id
        )
            .populate("trainingCentre")
            .populate("monitoring");

        if (!violation) {
            return res.status(404).json({
                success: false,
                message: "Violation not found",
            });
        }

        res.status(200).json({
            success: true,
            data: violation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch violation",
            error: error.message,
        });
    }
};

// GET violations for a centre
const getCentreViolations = async (req, res) => {
    try {
        const violations = await Violation.find({
            trainingCentre: req.params.centreId,
        })
            .populate("monitoring")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: violations.length,
            data: violations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch centre violations",
            error: error.message,
        });
    }
};

// UPDATE violation status
const updateViolationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "open",
            "reviewed",
            "resolved",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid violation status",
            });
        }

        const violation = await Violation.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!violation) {
            return res.status(404).json({
                success: false,
                message: "Violation not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Violation status updated successfully",
            data: violation,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update violation",
            error: error.message,
        });
    }
};

// DELETE violation
const deleteViolation = async (req, res) => {
    try {
        const violation = await Violation.findByIdAndDelete(
            req.params.id
        );

        if (!violation) {
            return res.status(404).json({
                success: false,
                message: "Violation not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Violation deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete violation",
            error: error.message,
        });
    }
};

module.exports = {
    getViolations,
    getViolationById,
    getCentreViolations,
    updateViolationStatus,
    deleteViolation,
};