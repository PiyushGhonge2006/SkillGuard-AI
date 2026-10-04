import React from "react";

const Navbar = ({ title = "SkillGuard AI" }) => {
    return (
        <header className="navbar">
            <div>
                <h1>{title}</h1>
                <p>Training Centre Compliance Monitoring</p>
            </div>

            <div className="navbar-status">
                <span className="status-dot"></span>
                System Online
            </div>
        </header>
    );
};

export default Navbar;