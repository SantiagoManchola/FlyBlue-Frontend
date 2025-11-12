// src/api/config/axiosInstance.ts

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://flyblue-api-server-dev-g0a8bsfaethdehe0.canadacentral-01.azurewebsites.net"}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token; // Ya incluye "bearer"
  }
  return config;
});

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Errores de autenticación
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      
      // Errores de autorización
      if (error.response.status === 403) {
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/"; // Redirigir a home si intenta acceder a rutas de admin
        }
      }

      // Error personalizado para recursos no encontrados
      if (error.response.status === 404) {
        const errorDetail = error.response.data?.detail || "Recurso no encontrado";
        error.message = errorDetail;
      }

      // Error de validación
      if (error.response.status === 422) {
        const validationErrors = error.response.data?.detail || "Error de validación";
        error.message = validationErrors;
      }

      // Errores de negocio (400)
      if (error.response.status === 400) {
        const businessError = error.response.data?.detail || "Error en la operación";
        error.message = businessError;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
