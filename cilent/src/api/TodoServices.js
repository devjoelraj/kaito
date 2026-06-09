import apiClient from "./apiClient";

export const createTodoService = async (todoData) => {
  try {
    const response = await apiClient.post("/todos", todoData);

    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Create Todo Error:", error);
    throw error;
  }
};

export const getTodosService = async () => {
  try {
    const response = await apiClient.get("/todos");

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Get Todos Error:", error);
    throw error;
  }
};

export const getTodosByDateService = async (date) => {
  try {
    const response = await apiClient.get(`/todos/${date}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Get Todos By Date Error:", error);
    throw error;
  }
};

export const updateTodoService = async (id, updateData) => {
  try {
    const response = await apiClient.put(`/todos/${id}`, updateData);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Update Todo Error:", error);
    throw error;
  }
};

export const deleteTodoService = async (id) => {
  try {
    const response = await apiClient.delete(`/todos/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Delete Todo Error:", error);
    throw error;
  }
};
