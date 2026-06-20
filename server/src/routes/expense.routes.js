import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import {
  getBudgetController,
  saveBudgetController,
  addExpenseController,
  getExpensesController,
  getMonthlyActivityController,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/", protect, saveBudgetController);
router.get("/", protect, getBudgetController);

router.post("/item", protect, addExpenseController);
router.get("/items", protect, getExpensesController);

router.get("/monthly-activity", protect, getMonthlyActivityController);

export default router;
