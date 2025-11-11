import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { CiudadRequest, CiudadCreateResponse, CiudadResponse } from "../types";

export const crearCiudad = async (data: CiudadRequest): Promise<CiudadCreateResponse> => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_CIUDAD, data);
  return res.data;
};

export const obtenerCiudades = async (): Promise<CiudadResponse[]> => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_CIUDADES);
  return res.data;
};
