import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://10.226.166.130:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
