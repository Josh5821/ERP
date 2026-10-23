
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Do not send an old token during login
  if (config.url?.includes("/auth/login")) {
    return config;
  }

  const token = localStorage.getItem("token");
  console.log("Token:", localStorage.getItem("token"));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
