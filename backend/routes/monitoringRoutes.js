const express = require("express");

const {
    getMonitoringRecords,
    getCentreMonitoring,
    getMonitoringById,
    createMonitoring,
} = require("../controllers/monitoringController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all monitoring records
router.get("/", getMonitoringRecords);

// Get monitoring records of a specific centre
router.get(
    "/centre/:centreId",
    getCentreMonitoring
);

// Get one monitoring record
router.get("/:id", getMonitoringById);

// Create monitoring record
router.post("/", createMonitoring);

// Upload image/video for monitoring
router.post(
    "/upload",
    upload.single("file"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image or video file uploaded",
            });
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: `/uploads/${req.file.filename}`,
                mimetype: req.file.mimetype,
                size: req.file.size,
            },
        });
    }
);

module.exports = router;