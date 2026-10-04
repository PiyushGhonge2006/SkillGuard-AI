const TrainingCentre = require("../models/TrainingCentre");

// GET /api/training-centres
const getTrainingCentres = async (req, res) => {
    try {
        const centres = await TrainingCentre.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: centres.length,
            data: centres,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch training centres",
            error: error.message,
        });
    }
};

// GET /api/training-centres/:id
const getTrainingCentreById = async (req, res) => {
    try {
        const centre = await TrainingCentre.findById(req.params.id);

        if (!centre) {
            return res.status(404).json({
                success: false,
                message: "Training centre not found",
            });
        }

        res.status(200).json({
            success: true,
            data: centre,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch training centre",
            error: error.message,
        });
    }
};

// POST /api/training-centres
const createTrainingCentre = async (req, res) => {
    try {
        const centre = await TrainingCentre.create(req.body);

        res.status(201).json({
            success: true,
            message: "Training centre created successfully",
            data: centre,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create training centre",
            error: error.message,
        });
    }
};

// PUT /api/training-centres/:id
const updateTrainingCentre = async (req, res) => {
    try {
        const centre = await TrainingCentre.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!centre) {
            return res.status(404).json({
                success: false,
                message: "Training centre not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Training centre updated successfully",
            data: centre,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update training centre",
            error: error.message,
        });
    }
};

// DELETE /api/training-centres/:id
const deleteTrainingCentre = async (req, res) => {
    try {
        const centre = await TrainingCentre.findByIdAndDelete(
            req.params.id
        );

        if (!centre) {
            return res.status(404).json({
                success: false,
                message: "Training centre not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Training centre deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete training centre",
            error: error.message,
        });
    }
};

module.exports = {
    getTrainingCentres,
    getTrainingCentreById,
    createTrainingCentre,
    updateTrainingCentre,
    deleteTrainingCentre,
};