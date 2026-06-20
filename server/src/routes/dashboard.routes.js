import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getDashboardController, getProfileController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboardController);
router.get("/profile", protect, getProfileController);

export default router;
