import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { VueloRequest } from "../types";

export const crearVuelo = async (data: VueloRequest) => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_VUELO, data);
  return res.data;
};

export const obtenerVueloPorId = async (id_vuelo: number) => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELO_BY_ID(id_vuelo));
  return res.data;
};

export const buscarVuelos = async () => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS);
  return res.data;
};
