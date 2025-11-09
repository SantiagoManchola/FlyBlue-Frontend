import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { RegistroRequest, RegistroResponse, LoginRequest, LoginResponse, UsuarioResponse } from "../types";

export const registrarUsuario = async (data: RegistroRequest): Promise<RegistroResponse> => {
  const res = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  return res.data;
};

export const loginUsuario = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post(ENDPOINTS.AUTH.LOGIN, data);
  return res.data;
};

export const obtenerPerfil = async (): Promise<UsuarioResponse> => {
  const res = await api.get(ENDPOINTS.AUTH.PROFILE);
  return res.data;
};
