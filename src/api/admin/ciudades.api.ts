import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { CiudadRequest } from "../types";

export const crearCiudad = async (data: CiudadRequest) => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_CIUDAD, data);
  return res.data;
};

export const obtenerCiudades = async () => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_CIUDADES);
  return res.data;
};
