import React, { useEffect, useState } from "react";

import { getMonitoringRecords } from "../services/monitoringService";
import LoadingSpinner from "../components/LoadingSpinner";

const Reports = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMonitoringRecords();

            setRecords(response.data || []);
        } catch (error) {
            console.error(
                "Reports loading error:",
                error
            );

            setError(
                "Unable to load reports. Please check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading reports..."
            />
        );
    }

    return (
        <div className="page">

            {/* PAGE HEADER */}
            <div className="page-header">

                <div>

                    <h2>
                        Reports
                    </h2>

                    <p>
                        Compliance performance and
                        monitoring history
                    </p>

                </div>

            </div>


            {/* ERROR STATE */}
            {error && (
                <div className="error-panel">

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-btn"
                        onClick={loadReports}
                    >
                        Retry
                    </button>

                </div>
            )}


            {!error && (
                <>

                    {/* SUMMARY */}
                    <div className="stats-grid">

                        <div className="stat-card">

                            <span>
                                Total Inspections :
                            </span>

                            <strong>
                                {records.length}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Compliant :
                            </span>

                            <strong>
                                {
                                    records.filter(
                                        (record) =>
                                            record.status ===
                                            "compliant"
                                    ).length
                                }
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Warnings :
                            </span>

                            <strong>
                                {
                                    records.filter(
                                        (record) =>
                                            record.status ===
                                            "warning"
                                    ).length
                                }
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span>
                                Non-Compliant :
                            </span>

                            <strong>
                                {
                                    records.filter(
                                        (record) =>
                                            record.status ===
                                            "non-compliant"
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                    {/* PERFORMANCE */}
                    <div className="dashboard-grid">

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Overall Performance
                                    </h3>

                                    <p>
                                        Average compliance
                                        across inspections
                                    </p>

                                </div>

                            </div>


                            <div className="report-metrics">

                                <div className="report-metric">

                                    <span>
                                        Average Score :
                                    </span>

                                    <strong>
                                        {records.length
                                            ? Math.round(
                                                records.reduce(
                                                    (
                                                        total,
                                                        record
                                                    ) =>
                                                        total +
                                                        (
                                                            record.complianceScore ||
                                                            0
                                                        ),
                                                    0
                                                ) /
                                                records.length
                                            )
                                            : 0}
                                        %
                                    </strong>

                                </div>


                                <div className="report-metric">

                                    <span>
                                        Average Attendance :
                                    </span>

                                    <strong>
                                        {records.length
                                            ? Math.round(
                                                records.reduce(
                                                    (
                                                        total,
                                                        record
                                                    ) =>
                                                        total +
                                                        (
                                                            record
                                                                .attendance
                                                                ?.attendancePercentage ||
                                                            0
                                                        ),
                                                    0
                                                ) /
                                                records.length
                                            )
                                            : 0}
                                        %
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* STATUS SUMMARY */}
                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Inspection Status
                                    </h3>

                                    <p>
                                        Current monitoring
                                        distribution
                                    </p>

                                </div>

                            </div>


                            <div className="status-summary">

                                <div>

                                    <span>
                                        Compliant :
                                    </span>

                                    <strong>
                                        {
                                            records.filter(
                                                (record) =>
                                                    record.status ===
                                                    "compliant"
                                            ).length
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Warning :
                                    </span>

                                    <strong>
                                        {
                                            records.filter(
                                                (record) =>
                                                    record.status ===
                                                    "warning"
                                            ).length
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Non-Compliant :
                                    </span>

                                    <strong>
                                        {
                                            records.filter(
                                                (record) =>
                                                    record.status ===
                                                    "non-compliant"
                                            ).length
                                        }
                                    </strong>

                                </div>

                            </div>

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
                                    Most recent monitoring
                                    result
                                </p>

                            </div>

                        </div>


                        {records.length === 0 ? (

                            <div className="empty-state">
                                No inspection records
                                available yet.
                            </div>

                        ) : (

                            (() => {

                                const latestRecord =
                                    records[0];

                                return (

                                    <div className="latest-inspection">

                                        <div>

                                            <span>
                                                Score :
                                            </span>

                                            <strong>
                                                {
                                                    latestRecord.complianceScore
                                                }
                                                %
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Attendance :
                                            </span>

                                            <strong>
                                                {
                                                    latestRecord
                                                        .attendance
                                                        ?.attendancePercentage ??
                                                    0
                                                }
                                                %
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Trainer :
                                            </span>

                                            <strong>
                                                {latestRecord
                                                    .trainer
                                                    ?.detected
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
                                                    latestRecord.status
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                );

                            })()

                        )}

                    </div>


                    {/* HISTORY */}
                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <h3>
                                    Inspection History
                                </h3>

                                <p>
                                    Recent monitoring
                                    records
                                </p>

                            </div>

                        </div>


                        {records.length === 0 ? (

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
                                                Centre
                                            </th>

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

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {records.map(
                                            (record) => (

                                                <tr
                                                    key={
                                                        record._id
                                                    }
                                                >

                                                    <td>
                                                        {record
                                                            .trainingCentre
                                                            ?.name ||
                                                            "Unknown Centre"}
                                                    </td>


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

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>

            )}

        </div>
    );
};

export default Reports;