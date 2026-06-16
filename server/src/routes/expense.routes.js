import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import {
  getBudgetController,
  saveBudgetController,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/", protect, saveBudgetController);

router.get("/", protect, getBudgetController);

export default router;
