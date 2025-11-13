// src/api/config/axiosInstance.ts

import axios from "axios";

const axiosInstance = axios.create({
  // En desarrollo usa /v1 (proxy de vite)
  // En producción usa la URL completa
  baseURL: import.meta.env.DEV ? "/v1" : `${import.meta.env.VITE_API_URL || "https://flyblue-api-server-dev-g0a8bsfaethdehe0.canadacentral-01.azurewebsites.net"}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor para agregar el token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Token agregado al header");
  }
  return config;
});

// ✅ Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en request:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
