import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { ReservaRequest } from "../types";

export const crearReserva = async (data: ReservaRequest) => {
  const res = await api.post(ENDPOINTS.CLIENT.CREATE_RESERVA, data);
  return res.data;
};

export const obtenerReservas = async (id_usuario: number) => {
  const res = await api.get(ENDPOINTS.CLIENT.GET_RESERVAS_BY_USER(id_usuario));
  return res.data;
};
