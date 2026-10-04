import React from "react";

const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    variant = "default",
}) => {
    return (
        <div className={`stat-card ${variant}`}>
            <div className="stat-card-top">
                <div className="stat-icon">
                    {icon}
                </div>
            </div>

            <div className="stat-value">
                {value}
            </div>

            <div className="stat-title">
                {title}
            </div>

            {subtitle && (
                <div className="stat-subtitle">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default StatCard;