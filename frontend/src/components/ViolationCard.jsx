import React from "react";

const ViolationCard = ({
    violation,
    onStatusChange,
    updating = false,
}) => {
    if (!violation) return null;

    return (
        <div className="violation-card">

            {/* HEADER */}
            <div className="violation-header">

                <div>
                    <span
                        className={`severity ${violation.severity}`}
                    >
                        {violation.severity}
                    </span>

                    <h3>
                        {violation.title}
                    </h3>
                </div>

                <span
                    className={`violation-status ${violation.status}`}
                >
                    {violation.status}
                </span>

            </div>

            {/* DESCRIPTION */}
            <p>
                {violation.description}
            </p>

            {/* VALUES */}
            <div className="violation-meta">

                <span>
                    Expected:{" "}
                    {violation.expectedValue ??
                        "—"}
                </span>

                <span>
                    Detected:{" "}
                    {violation.detectedValue ??
                        "—"}
                </span>

            </div>

            {/* EVIDENCE */}
            {violation.evidenceImage && (
                <div className="violation-evidence">
                    <img
                        src={
                            violation.evidenceImage
                        }
                        alt="Violation evidence"
                    />
                </div>
            )}

            {/* ACTION */}
            {onStatusChange && (
                <button
                    className="resolve-btn"
                    onClick={() =>
                        onStatusChange(
                            violation._id,
                            "reviewed"
                        )
                    }
                    disabled={
                        updating ||
                        violation.status ===
                        "reviewed"
                    }
                >
                    {updating
                        ? "Updating..."
                        : violation.status ===
                            "reviewed"
                            ? "Reviewed"
                            : "Mark Reviewed"}
                </button>
            )}

        </div>
    );
};

export default ViolationCard;