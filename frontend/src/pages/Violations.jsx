import React, { useEffect, useState } from "react";

import api from "../services/api";
import ViolationCard from "../components/ViolationCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Violations = () => {
    const [violations, setViolations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [success, setSuccess] = useState("");

    const loadViolations = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response =
                await api.get("/violations");

            setViolations(
                response.data.data || []
            );
        } catch (error) {
            console.error(
                "Violation loading error:",
                error
            );

            setError(
                "Unable to load violations. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadViolations();
    }, []);

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            setUpdatingId(id);
            setError("");
            setSuccess("");

            await api.put(
                `/violations/${id}/status`,
                { status }
            );

            setSuccess(
                "Violation status updated successfully."
            );

            await loadViolations();

        } catch (error) {
            console.error(
                "Status update error:",
                error
            );

            setError(
                "Unable to update violation status. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading violations..."
            />
        );
    }

    return (
        <div className="page">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <h2>Violations</h2>

                    <p>
                        Detected compliance issues and
                        evidence
                    </p>
                </div>
            </div>

            {/* ERROR STATE */}
            {error && (
                <div className="error-panel">
                    <h3>
                        Something went wrong
                    </h3>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={loadViolations}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* SUCCESS STATE */}
            {success && !error && (
                <div className="success-panel">
                    <h3>
                        Update Successful
                    </h3>

                    <p>{success}</p>
                </div>
            )}

            {/* EMPTY STATE */}
            {!error &&
                violations.length === 0 ? (
                <div className="empty-panel">
                    <h3>
                        No violations found
                    </h3>

                    <p>
                        Great — there are no recorded
                        violations yet.
                    </p>
                </div>
            ) : (
                !error && (
                    <div className="violations-grid">

                        {violations.map(
                            (violation) => (
                                <ViolationCard
                                    key={
                                        violation._id
                                    }
                                    violation={
                                        violation
                                    }
                                    onStatusChange={
                                        updateStatus
                                    }
                                    updating={
                                        updatingId ===
                                        violation._id
                                    }
                                />
                            )
                        )}

                    </div>
                )
            )}

        </div>
    );
};

export default Violations;