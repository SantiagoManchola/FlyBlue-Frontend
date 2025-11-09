import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";

export const procesarPago = async (reservaId: number, data: any) => {
  const res = await api.post(ENDPOINTS.CLIENT.PAGAR_RESERVA(reservaId), data);
  return res.data;
};
