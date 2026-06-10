import express from "express";

import {
  createTodoController,
  updateTodoController,
  deleteTodoController,
  getTodosByDateController,
  getTodosController,
} from "../controllers/todo.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTodoController);
router.get("/", protect, getTodosController);
router.get("/:date", protect, getTodosByDateController);
router.put("/:id", protect, updateTodoController);
router.delete("/:id", protect, deleteTodoController);

export default router;
