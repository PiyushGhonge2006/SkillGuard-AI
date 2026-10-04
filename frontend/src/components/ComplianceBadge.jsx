import React from "react";

const ComplianceBadge = ({ score = 0 }) => {
    let status = "non-compliant";

    if (score >= 90) {
        status = "compliant";
    } else if (score >= 70) {
        status = "warning";
    }

    const labels = {
        compliant: "Compliant",
        warning: "Needs Attention",
        "non-compliant": "Non-Compliant",
    };

    return (
        <span
            className={`compliance-badge ${status}`}
        >
            <span className="badge-dot"></span>

            {labels[status]} • {score}%
        </span>
    );
};

export default ComplianceBadge;