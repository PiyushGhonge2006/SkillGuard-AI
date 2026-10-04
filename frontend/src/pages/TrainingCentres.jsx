import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getTrainingCentres,
    deleteTrainingCentre,
} from "../services/centreService";

import LoadingSpinner from "../components/LoadingSpinner";

const TrainingCentres = () => {
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadCentres = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getTrainingCentres();

            setCentres(response.data || []);
        } catch (error) {
            console.error(
                "Centre loading error:",
                error
            );

            setError(
                "Unable to load training centres. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCentres();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Delete this training centre?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);
            setError("");

            await deleteTrainingCentre(id);

            await loadCentres();
        } catch (error) {
            console.error(
                "Delete centre error:",
                error
            );

            setError(
                "Unable to delete the training centre. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading training centres..."
            />
        );
    }

    return (
        <div className="page">

            {/* PAGE HEADER */}
            <div className="page-header">
                <div>
                    <h2>Training Centres</h2>

                    <p>
                        Manage registered training centres
                    </p>
                </div>

                <Link
                    to="/training-centres/new"
                    className="primary-btn"
                >
                    + Add Centre
                </Link>
            </div>

            {/* ERROR STATE */}
            {error && (
                <div className="error-panel">
                    <h3>Something went wrong</h3>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={loadCentres}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* EMPTY STATE */}
            {!error && centres.length === 0 ? (
                <div className="empty-panel">
                    <h3>
                        No training centres
                    </h3>

                    <p>
                        Add your first training centre
                        to start monitoring.
                    </p>

                    <Link
                        to="/training-centres/new"
                        className="primary-btn"
                        style={{
                            display: "inline-block",
                            marginTop: "16px",
                        }}
                    >
                        + Add Centre
                    </Link>
                </div>
            ) : (
                !error && (
                    <div className="centre-grid">

                        {centres.map((centre) => (
                            <div
                                className="centre-card"
                                key={centre._id}
                            >

                                {/* CARD HEADER */}
                                <div className="centre-card-header">
                                    <div>
                                        <h3>
                                            {centre.name}
                                        </h3>

                                        <span>
                                            {centre.centreCode}
                                        </span>
                                    </div>

                                    <span
                                        className={`centre-status ${centre.status}`}
                                    >
                                        {centre.status}
                                    </span>
                                </div>

                                {/* LOCATION */}
                                <p className="centre-location">
                                    📍 {centre.location}
                                </p>

                                {/* BASIC INFO */}
                                <div className="centre-info">

                                    <div>
                                        <span>
                                            Trainer
                                        </span>

                                        <strong>
                                            {centre.trainerName}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Students
                                        </span>

                                        <strong>
                                            {centre.expectedStudents}
                                        </strong>
                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="centre-actions">

                                    <Link
                                        to={`/training-centres/${centre._id}`}
                                        className="secondary-btn"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        className="danger-btn"
                                        onClick={() =>
                                            handleDelete(
                                                centre._id
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            centre._id
                                        }
                                    >
                                        {deletingId ===
                                            centre._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )
            )}

        </div>
    );
};

export default TrainingCentres;