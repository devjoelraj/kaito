import mongoose from "mongoose";
import Todo from "../models/todo.model.js";
import Expense from "../models/expense.model.js";

export const getDashboardDataService = async (userId, date, month, year) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const topTodos = await Todo.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ priority: 1, time: 1 })
    .limit(4);

  const topTodosSortedByTime = await Todo.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ time: 1 })
    .limit(4);

  const totalTodosToday = await Todo.countDocuments({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const completedTodosToday = await Todo.countDocuments({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    completed: true,
  });

  const expensesThisMonth = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        month: Number(month),
        year: Number(year),
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpenseMonth =
    expensesThisMonth.length > 0 ? expensesThisMonth[0].totalAmount : 0;

  return {
    topTodos: topTodosSortedByTime,
    todoCard: {
      total: totalTodosToday,
      completed: completedTodosToday,
      pending: totalTodosToday - completedTodosToday,
    },
    expenseCard: {
      totalExpenseMonth,
    },
  };
};
