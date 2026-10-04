import React, { useEffect, useState } from "react";

import {
    detectImage,
    detectVideo,
    createMonitoring,
} from "../services/monitoringService";

import { getTrainingCentres } from "../services/centreService";

import LoadingSpinner from "../components/LoadingSpinner";

const Monitoring = () => {
    const [file, setFile] = useState(null);
    const [centreId, setCentreId] = useState("");
    const [centres, setCentres] = useState([]);
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [centresLoading, setCentresLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------------------
    // LOAD TRAINING CENTRES
    // -----------------------------------------

    const loadCentres = async () => {
        try {
            setCentresLoading(true);
            setError("");

            const response =
                await getTrainingCentres();

            setCentres(response.data || []);
        } catch (error) {
            console.error(
                "Training centre loading error:",
                error
            );

            setError(
                "Unable to load training centres. Please check that the backend is running."
            );
        } finally {
            setCentresLoading(false);
        }
    };

    useEffect(() => {
        loadCentres();
    }, []);

    // -----------------------------------------
    // FILE CHANGE
    // -----------------------------------------

    const handleFileChange = (event) => {
        const selectedFile =
            event.target.files[0];

        setFile(selectedFile || null);
        setResult(null);
        setError("");
        setSuccess("");
    };

    // -----------------------------------------
    // ANALYZE FILE
    // -----------------------------------------

    const handleAnalyze = async () => {
        setError("");
        setSuccess("");

        if (!file) {
            setError(
                "Please select an image or video before starting the inspection."
            );
            return;
        }

        if (!centreId) {
            setError(
                "Please select a training centre before starting the inspection."
            );
            return;
        }

        try {
            setLoading(true);

            const isVideo =
                file.type.startsWith("video/");

            const response = isVideo
                ? await detectVideo(file)
                : await detectImage(file);

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "AI detection failed."
                );
            }

            setResult(response);

            const data = response.data;

            const students =
                data.summary?.find(
                    (item) =>
                        item.name === "person"
                )?.count || 0;

            await createMonitoring({
                trainingCentre: centreId,

                sourceType: isVideo
                    ? "video"
                    : "image",

                sourceFile:
                    `http://localhost:8000/uploads/${data.sourceFile}`,

                detectedStudents: students,

                // Demo behaviour:
                // YOLO11n COCO cannot distinguish
                // trainer from student.
                trainerDetected: true,

                detectedObjects:
                    data.summary || [],

                detections:
                    data.detections || [],
            });

            setSuccess(
                "AI inspection completed and monitoring record saved successfully."
            );
        } catch (error) {
            console.error(
                "Monitoring error:",
                error
            );

            setResult(null);

            setError(
                error?.message ||
                "Monitoring failed. Please make sure the AI service and backend are running."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // RENDER
    // -----------------------------------------

    return (
        <div className="page">

            {/* -------------------------------- */}
            {/* PAGE HEADER */}
            {/* -------------------------------- */}

            <div className="page-header">
                <div>
                    <h2>AI Monitoring</h2>

                    <p>
                        Upload an image or video for AI
                        compliance analysis.
                    </p>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* ERROR MESSAGE */}
            {/* -------------------------------- */}

            {error && (
                <div className="error-panel">
                    <h3>
                        Something went wrong
                    </h3>

                    <p>{error}</p>

                    {!loading && (
                        <button
                            className="retry-btn"
                            onClick={loadCentres}
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}

            {/* -------------------------------- */}
            {/* SUCCESS MESSAGE */}
            {/* -------------------------------- */}

            {success && (
                <div className="success-panel">
                    <h3>
                        Inspection Complete
                    </h3>

                    <p>{success}</p>
                </div>
            )}

            <div className="monitoring-layout">

                {/* -------------------------------- */}
                {/* UPLOAD PANEL */}
                {/* -------------------------------- */}

                <section className="panel monitoring-upload">

                    <h3>
                        Start Inspection
                    </h3>

                    <label>
                        Training Centre
                    </label>

                    <select
                        value={centreId}
                        onChange={(event) => {
                            setCentreId(
                                event.target.value
                            );
                            setError("");
                            setSuccess("");
                        }}
                        disabled={centresLoading || loading}
                    >
                        <option value="">
                            {centresLoading
                                ? "Loading centres..."
                                : "Select centre"}
                        </option>

                        {centres.map((centre) => (
                            <option
                                key={centre._id}
                                value={centre._id}
                            >
                                {centre.name}
                            </option>
                        ))}
                    </select>

                    <label>
                        Image / Video
                    </label>

                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />

                    {file && (
                        <div className="selected-file">
                            Selected: {file.name}
                        </div>
                    )}

                    <button
                        className="primary-btn full-width"
                        onClick={handleAnalyze}
                        disabled={
                            loading ||
                            centresLoading
                        }
                    >
                        {loading
                            ? "Analyzing..."
                            : "Run AI Inspection"}
                    </button>

                    {loading && (
                        <LoadingSpinner
                            text="YOLO11 is analyzing..."
                        />
                    )}

                </section>

                {/* -------------------------------- */}
                {/* DETECTION RESULT */}
                {/* -------------------------------- */}

                <section className="panel">

                    <h3>
                        Detection Result
                    </h3>

                    {!result ? (
                        <div className="empty-state">
                            Upload an image or video
                            to see AI detection
                            results.
                        </div>
                    ) : (
                        <div className="detection-result">

                            <div className="result-summary">

                                {result.data?.summary
                                    ?.length > 0 ? (
                                    result.data.summary.map(
                                        (item) => (
                                            <div
                                                className="detection-item"
                                                key={
                                                    item.name
                                                }
                                            >
                                                <strong>
                                                    {
                                                        item.count
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        item.name
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="empty-state">
                                        No objects were
                                        detected in this
                                        file.
                                    </div>
                                )}

                            </div>

                            <div className="result-info">

                                <p>
                                    <strong>
                                        Source:
                                    </strong>{" "}
                                    {
                                        result.data
                                            ?.sourceFile
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Objects:
                                    </strong>{" "}
                                    {
                                        result.data
                                            ?.statistics
                                            ?.totalObjects ||
                                        result.data
                                            ?.detections
                                            ?.length ||
                                        0
                                    }
                                </p>

                            </div>

                        </div>
                    )}

                </section>

            </div>
        </div>
    );
};

export default Monitoring;