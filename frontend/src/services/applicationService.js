import api from "./api";

export const getApplications = async (params = {}) => {
    const response = await api.get("/applications", {
        params,
    });

    return response.data;
};

export const createApplication = async (applicationData) => {
    const response = await api.post("/applications", applicationData);

    return response.data;
};

export const updateApplication = async (
    applicationId,
    applicationData
) => {
    const response = await api.put(
        `/applications/${applicationId}`,
        applicationData
    );

    return response.data;
};

export const deleteApplication = async (applicationId) => {
    const response = await api.delete(
        `/applications/${applicationId}`
    );

    return response.data;
};