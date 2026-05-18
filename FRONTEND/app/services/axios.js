import axios from "axios";

export const API_URL = "/api/";

// Crear instancia principal
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// ===== INTERCEPTOR DE REQUEST =====
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");

    if (user) {
      const userData = JSON.parse(user);
      const token = userData.token || userData.access;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===== INTERCEPTOR DE RESPUESTA =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
        window.location.replace("/auth/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
