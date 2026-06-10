import {
  createTodoService,
  updateTodoService,
  deleteTodoService,
  getTodosByDateService,
  getTodosService,
} from "../services/todo.service.js";

export const getTodosController = async (req, res) => {
  try {
    const todos = await getTodosService(req.user.id);

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTodoController = async (req, res) => {
  try {
    const { title, date, time, priority } = req.body;
    console.log("\n--- BACKEND: createTodoController ---");
    console.log("Received body:", req.body);
    console.log("User ID:", req.user.id);

    const todo = await createTodoService({
      title,
      date,
      time,
      priority,
      user: req.user.id,
    });
    
    console.log("Successfully saved in DB:", todo);
    console.log("-------------------------------------\n");

    res.status(201).json({
      success: true,
      todo,
    });
  } catch (error) {
    console.error("Backend Error in createTodoController:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodosByDateController = async (req, res) => {
  try {
    const { date } = req.params;

    const todos = await getTodosByDateService(req.user.id, date);

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTodoController = async (req, res) => {
  try {
    const todo = await updateTodoService(req.params.id, req.user.id, req.body);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTodoController = async (req, res) => {
  try {
    const todo = await deleteTodoService(req.params.id, req.user.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
