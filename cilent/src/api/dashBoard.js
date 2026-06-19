import apiClient from "./apiClient";

export const getDashboardDataAPI = async (date, month, year) => {
  try {
    const response = await apiClient.get(
      `/dashboard?date=${date}&month=${month}&year=${year}`
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};
