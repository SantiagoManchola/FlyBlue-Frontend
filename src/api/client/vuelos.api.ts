import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { VueloResponse, VueloBusquedaResponse, AsientosResponse, CiudadResponse } from "../types";

export const obtenerCiudades = async (): Promise<CiudadResponse[]> => {
  try {
    console.log('🏙️ GET /ciudades - Obteniendo ciudades...');
    const res = await api.get(ENDPOINTS.PUBLIC.GET_CIUDADES);
    console.log('✅ GET /ciudades - Ciudades obtenidas:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /ciudades - Error:', error);
    throw error;
  }
};

export const obtenerVueloPorId = async (id_vuelo: number): Promise<VueloResponse> => {
  console.log('🔍 GET /vuelos/:id - ID solicitado:', id_vuelo);
  const endpoint = ENDPOINTS.PUBLIC.GET_VUELO_BY_ID(id_vuelo);
  console.log('🔍 GET /vuelos/:id - Endpoint completo:', endpoint);
  
  try {
    const res = await api.get(endpoint);
    console.log('✅ GET /vuelos/:id - Respuesta exitosa:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /vuelos/:id - Error:', error);
    throw error;
  }
};

export const buscarVuelos = async (
  origen: number,
  destino: number,
  fecha: string
): Promise<VueloBusquedaResponse[]> => {
  try {
    console.log('🔍 buscarVuelos - Parámetros:', { origen, destino, fecha });
    const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS, {
      params: { origen, destino, fecha }
    });
    console.log('✅ buscarVuelos - Resultados:', res.data.length);
    return res.data;
  } catch (error: any) {
    console.error('❌ buscarVuelos - Error:', error);
    throw error;
  }
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
  
  try {
    const res = await api.get(ENDPOINTS.PUBLIC.GET_VUELOS, { params });
    console.log('✅ buscarVuelosConFiltros - Resultados:', res.data.length);
    return res.data;
  } catch (error: any) {
    console.error('❌ buscarVuelosConFiltros - Error:', error);
    throw error;
  }
};

export const obtenerAsientosVuelo = async (id_vuelo: number): Promise<AsientosResponse> => {
  console.log('🪑 GET /vuelos/:id/asientos - ID vuelo:', id_vuelo);
  const endpoint = ENDPOINTS.PUBLIC.GET_ASIENTOS_BY_VUELO(id_vuelo);
  
  try {
    const res = await api.get(endpoint);
    console.log('✅ GET /vuelos/:id/asientos - Respuesta:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /vuelos/:id/asientos - Error:', error);
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