import apiClient from "./apiClient";

export const saveBudgetService = async (budgetData) => {
  try {
    const response = await apiClient.post("/expenses", budgetData);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Save Budget Error:", error);
    throw error;
  }
};

export const getBudgetService = async (month, year) => {
  try {
    const response = await apiClient.get(`/expenses?month=${month}&year=${year}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Get Budget Error:", error);
    throw error;
  }
};
