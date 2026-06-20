import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardDataAPI } from "../../api/dashBoard";
import { getBudgetService } from "../../api/expenseService";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async ({ dateStr, month, year }, { rejectWithValue }) => {
    try {
      const response = await getDashboardDataAPI(dateStr, month, year);
      const budgetRes = await getBudgetService(month, year);

      return {
        dashboardData: response?.success ? response.data : null,
        budgetLimit: budgetRes?.data?.monthlyLimit || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  data: null,
  budgetLimit: 0,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.dashboardData;
        state.budgetLimit = action.payload.budgetLimit;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
