import React, { useEffect, useState } from "react";

import {
    getTrainingCentres,
} from "../services/centreService";

import {
    getMonitoringRecords,
} from "../services/monitoringService";

import StatCard from "../components/StatCard";
import ComplianceBadge from "../components/ComplianceBadge";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
    const [centres, setCentres] = useState([]);
    const [monitoring, setMonitoring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                centreResponse,
                monitoringResponse,
            ] = await Promise.all([
                getTrainingCentres(),
                getMonitoringRecords(),
            ]);

            setCentres(centreResponse.data || []);

            setMonitoring(
                monitoringResponse.data || []
            );
        } catch (error) {
            console.error(
                "Dashboard loading error:",
                error
            );

            setError(
                "Unable to load dashboard data. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // -----------------------------------------
    // LOADING STATE
    // -----------------------------------------

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading dashboard..."
            />
        );
    }

    // -----------------------------------------
    // ERROR STATE
    // -----------------------------------------

    if (error) {
        return (
            <div className="page">
                <div className="page-header">
                    <div>
                        <h2>Dashboard</h2>

                        <p>
                            Real-time training centre
                            compliance overview
                        </p>
                    </div>
                </div>

                <div className="error-panel">
                    <h3>
                        Unable to load dashboard
                    </h3>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={loadDashboard}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // -----------------------------------------
    // CENTRE STATISTICS
    // -----------------------------------------

    const activeCentres = centres.filter(
        (centre) =>
            centre.status === "active"
    ).length;

    // Backend returns monitoring records
    // newest first.
    const latestMonitoring = monitoring[0];

    // -----------------------------------------
    // COMPLIANCE STATISTICS
    // -----------------------------------------

    const averageScore =
        monitoring.length > 0
            ? Math.round(
                monitoring.reduce(
                    (sum, item) =>
                        sum +
                        (item.complianceScore || 0),
                    0
                ) / monitoring.length
            )
            : 0;

    const attentionCount =
        monitoring.filter(
            (item) =>
                item.status !== "compliant"
        ).length;

    // -----------------------------------------
    // LATEST INSPECTION DATA
    // -----------------------------------------

    const latestAttendance =
        latestMonitoring?.attendance;

    const attendancePercentage =
        latestAttendance?.attendancePercentage ??
        0;

    const trainerDetected =
        latestMonitoring?.trainer?.detected ??
        false;

    const equipment =
        latestMonitoring?.equipment || [];

    // Only count equipment that the current
    // AI pipeline actually evaluates.
    const supportedEquipment =
        equipment.filter(
            (item) =>
                item.detectedQuantity !== null &&
                item.detectedQuantity !== undefined
        );

    // -----------------------------------------
    // EQUIPMENT COMPLIANCE
    // -----------------------------------------

    const totalRequiredEquipment =
        supportedEquipment.reduce(
            (sum, item) =>
                sum +
                (item.requiredQuantity || 0),
            0
        );

    const totalDetectedEquipment =
        supportedEquipment.reduce(
            (sum, item) =>
                sum +
                Math.min(
                    item.detectedQuantity || 0,
                    item.requiredQuantity || 0
                ),
            0
        );

    const equipmentCompliance =
        totalRequiredEquipment > 0
            ? Math.round(
                (
                    totalDetectedEquipment /
                    totalRequiredEquipment
                ) * 100
            )
            : 100;

    // -----------------------------------------
    // INSPECTION INFORMATION
    // -----------------------------------------

    const inspectionStatus =
        latestMonitoring?.status ||
        "warning";

    const inspectionDate =
        latestMonitoring?.createdAt ||
        latestMonitoring?.detectionTime;

    const formattedInspectionDate =
        inspectionDate
            ? new Date(
                inspectionDate
            ).toLocaleString()
            : "Not available";

    return (
        <div className="page">

            {/* -------------------------------- */}
            {/* PAGE HEADER */}
            {/* -------------------------------- */}

            <div className="page-header">
                <div>
                    <h2>Dashboard</h2>

                    <p>
                        Real-time training centre
                        compliance overview
                    </p>
                </div>
            </div>

            {/* -------------------------------- */}
            {/* MAIN STATISTICS */}
            {/* -------------------------------- */}

            <div className="stats-grid">

                <StatCard
                    title="Total Centres"
                    value={centres.length}
                    subtitle={`${activeCentres} active`}
                    icon="⌂"
                />

                <StatCard
                    title="Monitoring Records"
                    value={monitoring.length}
                    subtitle="AI inspections"
                    icon="◉"
                />

                <StatCard
                    title="Average Compliance"
                    value={`${averageScore}%`}
                    subtitle="Across inspections"
                    icon="✓"
                    variant="success"
                />

                <StatCard
                    title="Needs Attention"
                    value={attentionCount}
                    subtitle="Non-compliant records"
                    icon="⚠"
                    variant="warning"
                />

            </div>

            {/* -------------------------------- */}
            {/* DASHBOARD GRID */}
            {/* -------------------------------- */}

            <div className="dashboard-grid">

                {/* -------------------------------- */}
                {/* LATEST MONITORING */}
                {/* -------------------------------- */}

                <section className="panel">

                    <div className="panel-header">
                        <h3>
                            Latest Monitoring
                        </h3>
                    </div>

                    {latestMonitoring ? (
                        <div className="latest-monitoring">

                            <div>

                                <strong>
                                    {
                                        latestMonitoring
                                            .trainingCentre
                                            ?.name ||
                                        "Training Centre"
                                    }
                                </strong>

                                <p>
                                    {
                                        latestAttendance
                                            ?.detectedStudents ??
                                        0
                                    }

                                    {" / "}

                                    {
                                        latestAttendance
                                            ?.expectedStudents ??
                                        0
                                    }

                                    {" "}
                                    students detected
                                </p>

                                <p>
                                    Inspection:{" "}
                                    {
                                        formattedInspectionDate
                                    }
                                </p>

                            </div>

                            <ComplianceBadge
                                score={
                                    latestMonitoring
                                        .complianceScore
                                }
                            />

                        </div>
                    ) : (
                        <p className="empty-state">
                            No monitoring data
                            available yet.
                        </p>
                    )}

                </section>

                {/* -------------------------------- */}
                {/* INSPECTION BREAKDOWN */}
                {/* -------------------------------- */}

                <section className="panel">

                    <div className="panel-header">
                        <h3>
                            Inspection Breakdown
                        </h3>
                    </div>

                    {latestMonitoring ? (
                        <div className="system-status-list">

                            <div>
                                <span>
                                    Attendance
                                </span>

                                <strong>
                                    {
                                        attendancePercentage
                                    }%
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Trainer
                                </span>

                                <strong
                                    className={
                                        trainerDetected
                                            ? "online"
                                            : ""
                                    }
                                >
                                    {
                                        trainerDetected
                                            ? "Present"
                                            : "Not Detected"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Equipment
                                </span>

                                <strong>
                                    {
                                        equipmentCompliance
                                    }%
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Inspection Status
                                </span>

                                <strong>
                                    {
                                        inspectionStatus
                                            .replace(
                                                "-",
                                                " "
                                            )
                                    }
                                </strong>
                            </div>

                        </div>
                    ) : (
                        <p className="empty-state">
                            Run an AI inspection
                            to see compliance
                            breakdown.
                        </p>
                    )}

                </section>

                {/* -------------------------------- */}
                {/* SYSTEM STATUS */}
                {/* -------------------------------- */}

                <section className="panel">

                    <div className="panel-header">
                        <h3>
                            System Status
                        </h3>
                    </div>

                    <div className="system-status-list">

                        <div>
                            <span>
                                Node.js Backend
                            </span>

                            <strong className="online">
                                Online
                            </strong>
                        </div>

                        <div>
                            <span>
                                MongoDB
                            </span>

                            <strong className="online">
                                Connected
                            </strong>
                        </div>

                        <div>
                            <span>
                                YOLO11 AI Engine
                            </span>

                            <strong className="online">
                                Online
                            </strong>
                        </div>

                    </div>

                </section>

                {/* -------------------------------- */}
                {/* COMPLIANCE SUMMARY */}
                {/* -------------------------------- */}

                <section className="panel">

                    <div className="panel-header">
                        <h3>
                            Compliance Summary
                        </h3>
                    </div>

                    {latestMonitoring ? (
                        <div className="system-status-list">

                            <div>
                                <span>
                                    Overall Score
                                </span>

                                <strong>
                                    {
                                        latestMonitoring
                                            .complianceScore
                                    }%
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Students
                                </span>

                                <strong>
                                    {
                                        latestAttendance
                                            ?.detectedStudents ??
                                        0
                                    }

                                    /

                                    {
                                        latestAttendance
                                            ?.expectedStudents ??
                                        0
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Equipment Checked
                                </span>

                                <strong>
                                    {
                                        supportedEquipment
                                            .length
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Current Status
                                </span>

                                <ComplianceBadge
                                    score={
                                        latestMonitoring
                                            .complianceScore
                                    }
                                />
                            </div>

                        </div>
                    ) : (
                        <p className="empty-state">
                            No inspection has been
                            performed yet.
                        </p>
                    )}

                </section>

            </div>

        </div>
    );
};

export default Dashboard;