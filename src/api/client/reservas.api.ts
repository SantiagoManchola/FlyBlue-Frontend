import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { ReservaRequest, ReservaCreateResponse, ReservaResponse } from "../types";

export const crearReserva = async (data: ReservaRequest): Promise<ReservaCreateResponse> => {
  const res = await api.post(ENDPOINTS.CLIENT.CREATE_RESERVA, data);
  return res.data;
};

export const obtenerReservas = async (id_usuario: number): Promise<ReservaResponse[]> => {
  const res = await api.get(ENDPOINTS.CLIENT.GET_RESERVAS_BY_USER(id_usuario));
  return res.data;
};
