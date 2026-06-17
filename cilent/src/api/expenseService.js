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

export const addExpenseItemService = async (expenseData) => {
  try {
    const response = await apiClient.post("/expenses/item", expenseData);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Add Expense Error:", error);
    throw error;
  }
};

export const getExpensesByMonthService = async (month, year) => {
  try {
    const response = await apiClient.get(`/expenses/items?month=${month}&year=${year}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Get Expenses Error:", error);
    throw error;
  }
};

export const getMonthlyActivityAPI = async (year) => {
  try {
    const response = await apiClient.get(`/expenses/monthly-activity?year=${year}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Get Monthly Activity Error:", error);
    throw error;
  }
};
