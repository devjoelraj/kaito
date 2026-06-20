import {
  addExpenseItemService,
  getExpensesByMonthService,
  getMonthlyActivityService,
} from "../services/expense.service.js";
import {
  getBudgetService,
  saveBudgetService,
} from "../services/expense.service.js";

export const saveBudgetController = async (req, res) => {
  try {
    const budget = await saveBudgetService(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      data: budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBudgetController = async (req, res) => {
  try {
    const { month, year } = req.query;

    const budget = await getBudgetService(
      req.user.id,
      Number(month),
      Number(year),
    );

    return res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addExpenseController = async (req, res) => {
  try {
    const expense = await addExpenseItemService(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExpensesController = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const expenses = await getExpensesByMonthService(
      req.user.id,
      Number(month),
      Number(year),
    );

    return res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyActivityController = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    const activity = await getMonthlyActivityService(
      req.user.id,
      Number(year)
    );

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
