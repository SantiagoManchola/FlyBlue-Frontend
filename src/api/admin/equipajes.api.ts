import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { EquipajeRequest, EquipajeCreateResponse, EquipajeResponse } from "../types";

export const crearEquipaje = async (data: EquipajeRequest): Promise<EquipajeCreateResponse> => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_EQUIPAJE, data);
  return res.data;
};

export const obtenerEquipajes = async (): Promise<EquipajeResponse[]> => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_EQUIPAJES);
  return res.data;
};
