const express = require("express");

const {
    getTrainingCentres,
    getTrainingCentreById,
    createTrainingCentre,
    updateTrainingCentre,
    deleteTrainingCentre,
} = require("../controllers/trainingCentreController");

const router = express.Router();

router.get("/", getTrainingCentres);

router.get("/:id", getTrainingCentreById);

router.post("/", createTrainingCentre);

router.put("/:id", updateTrainingCentre);

router.delete("/:id", deleteTrainingCentre);

module.exports = router;