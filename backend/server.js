const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const trainingCentreRoutes = require("./routes/trainingCentreRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const violationRoutes = require("./routes/violationRoutes");

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC UPLOADS
========================= */

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   API ROUTES
========================= */

app.use(
    "/api/training-centres",
    trainingCentreRoutes
);

app.use(
    "/api/monitoring",
    monitoringRoutes
);

app.use(
    "/api/violations",
    violationRoutes
);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillGuard AI Backend is running",
        service: "Node.js + Express",
        status: "online",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        timestamp: new Date().toISOString(),
    });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});