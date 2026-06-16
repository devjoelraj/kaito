import {
  getBudgetService,
  saveBudgetService,
} from "../services/expense.service.js";

export const saveBudgetController = async (req, res) => {
  try {
    const budget = await saveBudgetService(req.user._id, req.body);

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
      req.user._id,
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
