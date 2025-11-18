import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { VueloRequest, VueloCreateResponse, VueloResponse, VueloBusquedaResponse, AsientosResponse } from "../types";

export const crearVuelo = async (data: VueloRequest): Promise<VueloCreateResponse> => {
  console.log('🛫 POST /admin/vuelos - Datos enviados:', data);
  const res = await api.post(ENDPOINTS.ADMIN.CREATE_VUELO, data);
  console.log('✅ POST /admin/vuelos - Respuesta:', res.data);
  return res.data;
};

export const obtenerVueloPorId = async (id_vuelo: number): Promise<VueloResponse> => {
  console.log('🔍 GET /vuelos/:id - ID solicitado:', id_vuelo);
  const endpoint = ENDPOINTS.PUBLIC.GET_VUELO_BY_ID(id_vuelo);
  console.log('🔍 GET /vuelos/:id - Endpoint:', endpoint);
  const res = await api.get(endpoint);
  console.log('✅ GET /vuelos/:id - Respuesta:', res.data);
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

export const obtenerTodosLosVuelos = async (): Promise<VueloResponse[]> => {
  try {
    console.log('📋 GET /vuelos - Obteniendo todos los vuelos...');
    
    // NOTA: El backend requiere parámetros (origen, destino, fecha) pero no hay endpoint
    // para listar todos los vuelos sin filtros. Por ahora retornamos array vacío.
    // Los vuelos creados pueden verse individualmente por ID.
    console.warn('⚠️ El endpoint /vuelos requiere parámetros obligatorios. No se pueden listar todos los vuelos.');
    console.info('💡 Los vuelos se pueden ver individualmente usando su ID.');
    
    return [];
  } catch (error: any) {
    console.error('❌ Error al obtener vuelos:', error);
    console.error('❌ Error detallado:', error.response?.data);
    return [];
  }
};
