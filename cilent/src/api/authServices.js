import apiClient from "./apiClient";

export const loginService = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerService = async (name, email, password) => {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
