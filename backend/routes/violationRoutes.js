const express = require("express");

const {
    getViolations,
    getViolationById,
    getCentreViolations,
    updateViolationStatus,
    deleteViolation,
} = require("../controllers/violationController");

const router = express.Router();

// Get all violations
router.get("/", getViolations);

// Get violations for a specific centre
router.get(
    "/centre/:centreId",
    getCentreViolations
);

// Get one violation
router.get("/:id", getViolationById);

// Update violation status
router.put(
    "/:id/status",
    updateViolationStatus
);

// Delete violation
router.delete("/:id", deleteViolation);

module.exports = router;