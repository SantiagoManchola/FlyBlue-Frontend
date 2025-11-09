import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { VueloRequest, VueloCreateResponse, VueloResponse, VueloBusquedaResponse, AsientosResponse } from "../types";

export const crearVuelo = async (data: VueloRequest): Promise<VueloCreateResponse> => {
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_VUELO, data);
  return res.data;
};

export const obtenerVueloPorId = async (id_vuelo: number): Promise<VueloResponse> => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELO_BY_ID(id_vuelo));
  return res.data;
};

export const buscarVuelos = async (
  origen: number,
  destino: number,
  fecha: string
): Promise<VueloBusquedaResponse[]> => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS, {
    params: { origen, destino, fecha }
  });
  return res.data;
};

export const obtenerAsientosVuelo = async (id_vuelo: number): Promise<AsientosResponse> => {
  const res = await api.get(ENDPOINTS.PUBLIC.GET_ASIENTOS_BY_VUELO(id_vuelo));
  return res.data;
};
