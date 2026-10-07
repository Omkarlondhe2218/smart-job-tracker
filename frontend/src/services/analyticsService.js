import api from "./api";

export const getAnalyticsSummary = async () => {
    const response = await api.get(
        "/dashboard/summary"
    );

    return response.data;
};

export const getAnalyticsApplications = async () => {
    const response = await api.get(
        "/applications",
        {
            params: {
                page: 1,
                limit: 100,
                sort_by: "created_at",
                sort_order: "desc",
            },
        }
    );

    return response.data;
};