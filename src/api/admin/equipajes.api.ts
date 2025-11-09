import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { EquipajeRequest } from "../types";

export const crearEquipaje = async (data: EquipajeRequest) => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_EQUIPAJE, data);
  return res.data;
};

export const obtenerEquipajes = async () => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_EQUIPAJES);
  return res.data;
};
