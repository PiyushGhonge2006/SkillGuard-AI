import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
    getTrainingCentreById,
} from "../services/centreService";

import {
    getCentreMonitoring,
} from "../services/monitoringService";

import LoadingSpinner from "../components/LoadingSpinner";

const CentreDetails = () => {
    const { id } = useParams();

    const [centre, setCentre] = useState(null);
    const [monitoring, setMonitoring] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCentreDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                centreResponse,
                monitoringResponse,
            ] = await Promise.all([
                getTrainingCentreById(id),
                getCentreMonitoring(id),
            ]);

            setCentre(
                centreResponse.data
            );

            setMonitoring(
                monitoringResponse.data || []
            );
        } catch (error) {
            console.error(
                "Centre details loading error:",
                error
            );

            setError(
                "Unable to load centre details. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCentreDetails();
    }, [id]);

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading centre details..."
            />
        );
    }

    if (error) {
        return (
            <div className="page">

                <div className="error-panel">

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-btn"
                        onClick={
                            loadCentreDetails
                        }
                    >
                        Retry
                    </button>

                </div>

            </div>
        );
    }

    if (!centre) {
        return (
            <div className="page">

                <div className="empty-panel">

                    <h3>
                        Training centre not found
                    </h3>

                    <p>
                        The requested centre could
                        not be found.
                    </p>

                    <Link
                        to="/training-centres"
                        className="primary-btn"
                        style={{
                            display:
                                "inline-block",
                            marginTop: "16px",
                        }}
                    >
                        Back to Centres
                    </Link>

                </div>

            </div>
        );
    }

    const latestMonitoring =
        monitoring.length > 0
            ? monitoring[0]
            : null;

    const attendance =
        latestMonitoring?.attendance
            ?.attendancePercentage ?? 0;

    const trainerPresent =
        latestMonitoring?.trainer?.detected ??
        false;

    const complianceScore =
        latestMonitoring?.complianceScore ?? 0;

    return (
        <div className="page">

            {/* HEADER */}
            <div className="page-header">

                <div>

                    <h2>
                        {centre.name}
                    </h2>

                    <p>
                        {centre.centreCode} •{" "}
                        {centre.location}
                    </p>

                </div>

                <Link
                    to="/training-centres"
                    className="secondary-btn"
                >
                    ← Back
                </Link>

            </div>


            {/* CENTRE SUMMARY */}
            <div className="stats-grid">

                <div className="stat-card">

                    <span>
                        Expected Students :
                    </span>

                    <strong>
                        {centre.expectedStudents}
                    </strong>

                </div>


                <div className="stat-card">

                    <span>
                        Latest Attendance :
                    </span>

                    <strong>
                        {attendance}%
                    </strong>

                </div>


                <div className="stat-card">

                    <span>
                        Trainer :
                    </span>

                    <strong>
                        {trainerPresent
                            ? "Present"
                            : "Not Detected"}
                    </strong>

                </div>


                <div className="stat-card">

                    <span>
                        Compliance Score :
                    </span>

                    <strong>
                        {complianceScore}%
                    </strong>

                </div>

            </div>


            {/* CENTRE INFORMATION */}
            <div className="dashboard-grid">

                <div className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Centre Information
                            </h3>

                            <p>
                                Registered centre
                                details
                            </p>

                        </div>

                    </div>


                    <div className="details-list">

                        <div>

                            <span>
                                Centre Name :
                            </span>

                            <strong>
                                {centre.name}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Centre Code :
                            </span>

                            <strong>
                                {centre.centreCode}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Location :
                            </span>

                            <strong>
                                {centre.location}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Trainer :
                            </span>

                            <strong>
                                {centre.trainerName}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Status :
                            </span>

                            <strong>
                                {centre.status}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* REQUIRED EQUIPMENT */}
                <div className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Required Equipment
                            </h3>

                            <p>
                                Infrastructure
                                requirements
                            </p>

                        </div>

                    </div>


                    {centre.requiredEquipment
                        ?.length > 0 ? (

                        <div className="equipment-list">

                            {centre.requiredEquipment.map(
                                (equipment, index) => (

                                    <div
                                        className="equipment-item"
                                        key={index}
                                    >

                                        <span>
                                            {
                                                equipment.name
                                            }
                                        </span>

                                        <strong>
                                            ×{" "}
                                            {
                                                equipment.quantity
                                            }
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-state">

                            No equipment
                            requirements configured.

                        </div>

                    )}

                </div>

            </div>


            {/* LATEST INSPECTION */}
            <div className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Latest Inspection
                        </h3>

                        <p>
                            Most recent AI
                            monitoring result
                        </p>

                    </div>

                </div>


                {!latestMonitoring ? (

                    <div className="empty-state">

                        No monitoring records
                        available for this centre.

                    </div>

                ) : (

                    <div className="latest-inspection">

                        <div>

                            <span>
                                Compliance Score :
                            </span>

                            <strong>
                                {
                                    latestMonitoring
                                        .complianceScore
                                }
                                %
                            </strong>

                        </div>


                        <div>

                            <span>
                                Attendance :
                            </span>

                            <strong>
                                {attendance}%
                            </strong>

                        </div>


                        <div>

                            <span>
                                Trainer :
                            </span>

                            <strong>
                                {trainerPresent
                                    ? "Present"
                                    : "Not Detected"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Status :
                            </span>

                            <strong>
                                {
                                    latestMonitoring.status
                                }
                            </strong>

                        </div>

                    </div>

                )}

            </div>


            {/* MONITORING HISTORY */}
            <div className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Monitoring History
                        </h3>

                        <p>
                            Previous AI inspection
                            records
                        </p>

                    </div>

                </div>


                {monitoring.length === 0 ? (

                    <div className="empty-state">

                        No monitoring history
                        available.

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Score
                                    </th>

                                    <th>
                                        Attendance
                                    </th>

                                    <th>
                                        Trainer
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {monitoring.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record._id
                                            }
                                        >

                                            <td>
                                                {
                                                    record.complianceScore
                                                }
                                                %
                                            </td>


                                            <td>
                                                {record
                                                    .attendance
                                                    ?.attendancePercentage ??
                                                    0}
                                                %
                                            </td>


                                            <td>
                                                {record
                                                    .trainer
                                                    ?.detected
                                                    ? "Present"
                                                    : "Not Detected"}
                                            </td>


                                            <td>

                                                <span
                                                    className={`centre-status ${record.status}`}
                                                >
                                                    {
                                                        record.status
                                                    }
                                                </span>

                                            </td>


                                            <td>
                                                {record.createdAt
                                                    ? new Date(
                                                        record.createdAt
                                                    ).toLocaleString()
                                                    : "—"}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default CentreDetails;