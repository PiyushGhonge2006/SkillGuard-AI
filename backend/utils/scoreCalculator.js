const calculateComplianceScore = ({
    attendancePercentage = 0,
    trainerPresent = false,
    equipmentCompliance = 0,
}) => {
    const attendanceScore = Math.max(
        0,
        Math.min(100, attendancePercentage)
    );

    const trainerScore = trainerPresent ? 100 : 0;

    const equipmentScore = Math.max(
        0,
        Math.min(100, equipmentCompliance)
    );

    // Weightage
    const score =
        attendanceScore * 0.4 +
        trainerScore * 0.2 +
        equipmentScore * 0.4;

    return Math.round(score);
};

const getComplianceStatus = (score) => {
    if (score >= 90) {
        return "compliant";
    }

    if (score >= 70) {
        return "warning";
    }

    return "non-compliant";
};

module.exports = {
    calculateComplianceScore,
    getComplianceStatus,
};