import {
  createTodoService,
  updateTodoService,
  deleteTodoService,
  getTodosByDateService,
} from "../services/todo.service.js";

export const createTodoController = async (req, res) => {
  try {
    const { title, date, time, priority } = req.body;

    const todo = await createTodoService({
      title,
      date,
      time,
      priority,
      user: req.user.id,
    });

    res.status(201).json({
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

export const getTodosByDateController = async (req, res) => {
  try {
    const { date } = req.params;

    const todos = await getTodosByDateService(req.user._id, date);

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
    const todo = await updateTodoService(req.params.id, req.user._id, req.body);

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
    const todo = await deleteTodoService(req.params.id, req.user._id);

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
