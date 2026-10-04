import api from "./api";

// Get all training centres
export const getTrainingCentres = async () => {
    const response = await api.get("/training-centres");
    return response.data;
};

// Get one training centre
export const getTrainingCentreById = async (id) => {
    const response = await api.get(
        `/training-centres/${id}`
    );

    return response.data;
};

// Create training centre
export const createTrainingCentre = async (data) => {
    const response = await api.post(
        "/training-centres",
        data
    );

    return response.data;
};

// Update training centre
export const updateTrainingCentre = async (id, data) => {
    const response = await api.put(
        `/training-centres/${id}`,
        data
    );

    return response.data;
};

// Delete training centre
export const deleteTrainingCentre = async (id) => {
    const response = await api.delete(
        `/training-centres/${id}`
    );

    return response.data;
};