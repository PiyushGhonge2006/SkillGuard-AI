import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        {
            label: "Dashboard",
            path: "/",
            icon: "▦",
        },
        {
            label: "Training Centres",
            path: "/training-centres",
            icon: "⌂",
        },
        {
            label: "Monitoring",
            path: "/monitoring",
            icon: "◉",
        },
        {
            label: "Violations",
            path: "/violations",
            icon: "⚠",
        },
        {
            label: "Reports",
            path: "/reports",
            icon: "▤",
        },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">S</div>

                <div>
                    <h2>SkillGuard</h2>
                    <span>AI Monitoring</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <span>AI Engine</span>
                <strong>YOLO11 • Online</strong>
            </div>
        </aside>
    );
};

export default Sidebar;