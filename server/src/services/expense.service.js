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
