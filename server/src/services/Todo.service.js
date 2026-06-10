import Todo from "../models/Todo.model.js";

export const createTodoService = async (todoData) => {
  return await Todo.create(todoData);
};

export const getTodosService = async (userId) => {
  return await Todo.find({ user: userId }).sort({ time: 1 });
};

export const getTodosByDateService = async (userId, date) => {
  const startDate = new Date(date);

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);

  endDate.setHours(23, 59, 59, 999);

  return await Todo.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ time: 1 });
};

export const updateTodoService = async (todoId, userId, updateData) => {
  return await Todo.findOneAndUpdate(
    {
      _id: todoId,
      user: userId,
    },
    updateData,
    { new: true },
  );
};

export const deleteTodoService = async (todoId, userId) => {
  return await Todo.findOneAndDelete({
    _id: todoId,
    user: userId,
  });
};
