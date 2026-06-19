import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getDashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboardController);

export default router;
