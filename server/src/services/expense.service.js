import mongoose from "mongoose";
import Expense from "../models/expense.model.js";
import Budget from "../models/budget.model.js";

export const saveBudgetService = async (userId, budgetData) => {
  const { month, year, monthlyLimit, categories } = budgetData;

  return await Budget.findOneAndUpdate(
    {
      userId,
      month,
      year,
    },
    {
      monthlyLimit,
      categories,
    },
    {
      new: true,
      upsert: true,
    },
  );
};

export const getBudgetService = async (userId, month, year) => {
  return await Budget.findOne({
    userId,
    month,
    year,
  });
};

export const addExpenseItemService = async (userId, expenseData) => {
  const expense = new Expense({
    userId,
    ...expenseData,
  });
  return await expense.save();
};

export const getExpensesByMonthService = async (userId, month, year) => {
  return await Expense.find({
    userId,
    month,
    year,
  }).sort({ createdAt: -1 });
};

export const getMonthlyActivityService = async (userId, year) => {
  const result = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        year: Number(year),
      },
    },
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const formattedData = Array.from({ length: 12 }, (_, i) => {
    const monthRecord = result.find((r) => r._id === i + 1);
    return {
      month: i + 1,
      totalAmount: monthRecord ? monthRecord.totalAmount : 0,
    };
  });

  return formattedData;
};
