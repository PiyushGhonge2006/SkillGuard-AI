const {
    calculateComplianceScore,
    getComplianceStatus,
} = require("./scoreCalculator");

const calculateAttendancePercentage = (
    expectedStudents,
    detectedStudents
) => {
    if (!expectedStudents || expectedStudents <= 0) {
        return 0;
    }

    const percentage =
        (detectedStudents / expectedStudents) * 100;

    return Math.min(100, Math.round(percentage));
};

const normalizeEquipmentName = (name = "") => {
    const value = name.toLowerCase().trim();

    const aliases = {
        laptop: "computer",
        laptops: "computer",
        pc: "computer",
        pcs: "computer",
    };

    return aliases[value] || value;
};

const checkEquipmentCompliance = (
    requiredEquipment = [],
    detectedObjects = []
) => {
    const equipmentResults = [];

    let totalRequired = 0;
    let totalDetected = 0;

    // Equipment that the current YOLO11n model
    // can reasonably verify.
    const supportedEquipment = [
        "computer",
        "laptop",
        "pc",
        "pcs",
    ];

    requiredEquipment.forEach((requiredItem) => {
        const originalName = requiredItem.name;

        const requiredName =
            normalizeEquipmentName(originalName);

        /*
         * Current YOLO11n COCO model does not reliably
         * detect projector or whiteboard.
         *
         * Therefore, unsupported infrastructure items
         * are excluded from automatic violation scoring.
         */
        if (!supportedEquipment.includes(requiredName)) {
            equipmentResults.push({
                name: originalName,
                requiredQuantity: requiredItem.quantity,
                detectedQuantity: null,
                compliant: true,
            });

            return;
        }

        const detectedItem = detectedObjects.find(
            (item) =>
                normalizeEquipmentName(item.name) ===
                requiredName
        );

        const detectedQuantity =
            detectedItem?.count || 0;

        totalRequired += requiredItem.quantity;

        totalDetected += Math.min(
            detectedQuantity,
            requiredItem.quantity
        );

        equipmentResults.push({
            name: originalName,
            requiredQuantity: requiredItem.quantity,
            detectedQuantity,
            compliant:
                detectedQuantity >=
                requiredItem.quantity,
        });
    });

    const equipmentCompliance =
        totalRequired > 0
            ? Math.round(
                (totalDetected / totalRequired) * 100
            )
            : 100;

    return {
        equipmentResults,
        equipmentCompliance,
    };
};

const generateViolations = ({
    expectedStudents,
    detectedStudents,
    trainerExpected = true,
    trainerDetected = false,
    equipmentResults = [],
}) => {
    const violations = [];

    // Attendance violation
    if (detectedStudents < expectedStudents) {
        violations.push({
            type: "attendance-shortage",
            title: "Attendance Shortage",
            description:
                `Expected ${expectedStudents} students but detected ${detectedStudents}.`,
            severity:
                detectedStudents / expectedStudents < 0.5
                    ? "high"
                    : "medium",
            detectedValue: detectedStudents,
            expectedValue: expectedStudents,
        });
    }

    // Trainer violation
    if (trainerExpected && !trainerDetected) {
        violations.push({
            type: "trainer-absent",
            title: "Trainer Not Detected",
            description:
                "Required trainer was not detected in the monitoring frame.",
            severity: "high",
            detectedValue: 0,
            expectedValue: 1,
        });
    }

    // Equipment violations
    equipmentResults.forEach((equipment) => {
        if (!equipment.compliant) {
            violations.push({
                type:
                    equipment.detectedQuantity === 0
                        ? "equipment-missing"
                        : "equipment-shortage",

                title:
                    equipment.detectedQuantity === 0
                        ? `${equipment.name} Missing`
                        : `${equipment.name} Shortage`,

                description:
                    `Required ${equipment.requiredQuantity} ${equipment.name}, but detected ${equipment.detectedQuantity}.`,

                severity:
                    equipment.detectedQuantity === 0
                        ? "high"
                        : "medium",

                detectedValue:
                    equipment.detectedQuantity,

                expectedValue:
                    equipment.requiredQuantity,
            });
        }
    });

    return violations;
};

const runComplianceCheck = ({
    expectedStudents,
    detectedStudents,
    trainerExpected = true,
    trainerDetected = false,
    requiredEquipment = [],
    detectedObjects = [],
}) => {
    const attendancePercentage =
        calculateAttendancePercentage(
            expectedStudents,
            detectedStudents
        );

    const {
        equipmentResults,
        equipmentCompliance,
    } = checkEquipmentCompliance(
        requiredEquipment,
        detectedObjects
    );

    const complianceScore =
        calculateComplianceScore({
            attendancePercentage,
            trainerPresent: trainerDetected,
            equipmentCompliance,
        });

    const status =
        getComplianceStatus(complianceScore);

    const violations =
        generateViolations({
            expectedStudents,
            detectedStudents,
            trainerExpected,
            trainerDetected,
            equipmentResults,
        });

    return {
        attendance: {
            expectedStudents,
            detectedStudents,
            attendancePercentage,
        },

        trainer: {
            expected: trainerExpected,
            detected: trainerDetected,
        },

        equipment: equipmentResults,

        complianceScore,

        status,

        violations,
    };
};

module.exports = {
    calculateAttendancePercentage,
    checkEquipmentCompliance,
    generateViolations,
    runComplianceCheck,
};