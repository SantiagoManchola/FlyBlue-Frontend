// src/api/config/endpoints.ts

export const ENDPOINTS = {
  // ---------- AUTH ----------
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/auth/me",
  },

  // ---------- ADMIN ----------
  ADMIN: {
    CREATE_CIUDAD: "/admin/ciudades",
    CREATE_EQUIPAJE: "/admin/equipajes",
    CREATE_VUELO: "/admin/vuelos",
  },

  // ---------- CLIENTE ----------
  CLIENT: {
    CREATE_RESERVA: "/cliente/reservas",
    GET_RESERVAS_BY_USER: (id_usuario: number | string) => `/cliente/reservas/${id_usuario}`,
    PAGAR_RESERVA: (reserva_id: number | string) => `/cliente/reservas/${reserva_id}/pago`,
  },

  // ---------- DEFAULT / PÚBLICOS ----------
  PUBLIC: {
    GET_VUELO_BY_ID: (id_vuelo: number | string) => `/vuelos/${id_vuelo}`,
    GET_ASIENTOS_BY_VUELO: (id_vuelo: number | string) => `/vuelos/${id_vuelo}/asientos`, 
    GET_EQUIPAJES: "/equipajes",
    GET_CIUDADES: "/ciudades",
    GET_VUELOS: "/vuelos",
  },
};

