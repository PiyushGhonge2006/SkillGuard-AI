import api from "./api";

const AI_BASE_URL =
    import.meta.env.VITE_AI_BASE_URL ||
    "http://localhost:8000";

export const getMonitoringRecords = async () => {
    const response = await api.get("/monitoring");
    return response.data;
};

export const getCentreMonitoring = async (centreId) => {
    const response = await api.get(
        `/monitoring/centre/${centreId}`
    );

    return response.data;
};

export const getMonitoringById = async (id) => {
    const response = await api.get(
        `/monitoring/${id}`
    );

    return response.data;
};

export const createMonitoring = async (data) => {
    const response = await api.post(
        "/monitoring",
        data
    );

    return response.data;
};

export const detectImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${AI_BASE_URL}/api/detection/image`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(
            "Image detection request failed"
        );
    }

    return response.json();
};

export const detectVideo = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${AI_BASE_URL}/api/detection/video`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(
            "Video detection request failed"
        );
    }

    return response.json();
};

export const getAIHealth = async () => {
    const response = await fetch(
        `${AI_BASE_URL}/health`
    );

    if (!response.ok) {
        throw new Error(
            "AI service is not available"
        );
    }

    return response.json();
};