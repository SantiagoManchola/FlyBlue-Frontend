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
  console.log('🔍 GET /vuelos/:id - Endpoint completo:', endpoint);
  console.log('🔍 GET /vuelos/:id - Base URL:', api.defaults.baseURL);
  console.log('🔍 GET /vuelos/:id - URL final:', `${api.defaults.baseURL}${endpoint}`);
  
  try {
    const res = await api.get(endpoint);
    console.log('✅ GET /vuelos/:id - Respuesta exitosa:', res.data);
    console.log('✅ GET /vuelos/:id - Status:', res.status);
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /vuelos/:id - Error:', error);
    console.error('❌ GET /vuelos/:id - Status:', error.response?.status);
    console.error('❌ GET /vuelos/:id - Response data:', error.response?.data);
    console.error('❌ GET /vuelos/:id - Request URL:', error.config?.url);
    throw error;
  }
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

export const buscarVuelosConFiltros = async (
  filtros: { origen?: number; destino?: number; fecha?: string }
): Promise<VueloBusquedaResponse[]> => {
  console.log('🔍 buscarVuelosConFiltros - Filtros recibidos:', filtros);
  
  const params: any = {};
  if (filtros.origen) params.origen = filtros.origen;
  if (filtros.destino) params.destino = filtros.destino;
  if (filtros.fecha) params.fecha = filtros.fecha;
  
  console.log('🔍 buscarVuelosConFiltros - Params enviados:', params);
  
  const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS, { params });
  console.log('✅ buscarVuelosConFiltros - Resultados:', res.data.length);
  return res.data;
};

export const obtenerAsientosVuelo = async (id_vuelo: number): Promise<AsientosResponse> => {
  console.log('🪑 GET /vuelos/:id/asientos - ID vuelo:', id_vuelo);
  const endpoint = ENDPOINTS.PUBLIC.GET_ASIENTOS_BY_VUELO(id_vuelo);
  console.log('🪑 GET /vuelos/:id/asientos - Endpoint:', endpoint);
  console.log('🪑 GET /vuelos/:id/asientos - URL completa:', `${api.defaults.baseURL}${endpoint}`);
  
  try {
    const res = await api.get(endpoint);
    console.log('✅ GET /vuelos/:id/asientos - Respuesta completa:', res);
    console.log('✅ GET /vuelos/:id/asientos - res.data:', res.data);
    console.log('✅ GET /vuelos/:id/asientos - Tipo de res.data:', typeof res.data);
    console.log('✅ GET /vuelos/:id/asientos - Es array?:', Array.isArray(res.data));
    console.log('✅ GET /vuelos/:id/asientos - Keys de res.data:', Object.keys(res.data || {}));
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /vuelos/:id/asientos - Error:', error);
    console.error('❌ GET /vuelos/:id/asientos - Status:', error.response?.status);
    console.error('❌ GET /vuelos/:id/asientos - Response:', error.response?.data);
    throw error;
  }
};

export const obtenerTodosLosVuelos = async (): Promise<VueloResponse[]> => {
  try {
    console.log('📋 GET /vuelos - Obteniendo todos los vuelos sin filtros...');
    const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS);
    console.log('✅ GET /vuelos - Vuelos obtenidos (raw):', res.data);
    console.log('✅ GET /vuelos - Tipo de datos:', typeof res.data, Array.isArray(res.data));
    
    // Si el backend devuelve un objeto en lugar de un array, convertirlo
    let vuelos = res.data;
    if (!Array.isArray(res.data) && typeof res.data === 'object') {
      console.log('⚠️ GET /vuelos - Backend devolvió objeto, convirtiendo a array...');
      vuelos = Object.values(res.data);
      console.log('✅ GET /vuelos - Array convertido:', vuelos);
    }
    
    console.log('✅ GET /vuelos - Total de vuelos:', vuelos.length);
    return vuelos;
  } catch (error: any) {
    console.error('❌ GET /vuelos - Error al obtener vuelos:', error);
    console.error('❌ GET /vuelos - Status:', error.response?.status);
    console.error('❌ GET /vuelos - Detalle:', error.response?.data);
    return [];
  }
};
