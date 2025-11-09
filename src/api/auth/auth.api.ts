import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { RegistroRequest, LoginRequest } from "../types";

export const registrarUsuario = async (data: RegistroRequest) => {
  const res = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  return res.data;
};

export const loginUsuario = async (data: LoginRequest) => {
  const res = await api.post(ENDPOINTS.AUTH.LOGIN, data);
  return res.data;
};

export const obtenerPerfil = async () => {
  const res = await api.get(ENDPOINTS.AUTH.PROFILE);
  return res.data;
};
