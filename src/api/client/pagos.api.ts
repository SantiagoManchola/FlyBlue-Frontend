import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { PagoRequest, PagoResponse } from "../types";

export const procesarPago = async (reservaId: number, data: PagoRequest): Promise<PagoResponse> => {
  const res = await api.post(ENDPOINTS.CLIENT.PAGAR_RESERVA(reservaId), data);
  return res.data;
};
