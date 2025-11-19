import api from "../config/axiosInstance";
import { ENDPOINTS } from "../config/endpoints";
import type { EquipajeRequest, EquipajeCreateResponse, EquipajeResponse } from "../types";

export const crearEquipaje = async (data: EquipajeRequest): Promise<EquipajeCreateResponse> => {
  console.log('📦 POST /admin/equipajes - Datos enviados:', data);
  console.log('📦 POST /admin/equipajes - Endpoint:', ENDPOINTS.ADMIN.CREATE_EQUIPAJE);
  console.log('📦 POST /admin/equipajes - Base URL:', api.defaults.baseURL);
  try {
    const res = await api.post(ENDPOINTS.ADMIN.CREATE_EQUIPAJE, data);
    console.log('✅ POST /admin/equipajes - Respuesta exitosa:', res.data);
    console.log('✅ POST /admin/equipajes - Status:', res.status);
    return res.data;
  } catch (error: any) {
    console.error('❌ POST /admin/equipajes - Error:', error);
    console.error('❌ POST /admin/equipajes - Status:', error.response?.status);
    console.error('❌ POST /admin/equipajes - Data:', error.response?.data);
    console.error('❌ POST /admin/equipajes - Headers:', error.response?.headers);
    throw error;
  }
};

export const obtenerEquipajes = async (): Promise<EquipajeResponse[]> => {
  console.log('📦 GET /equipajes - Obteniendo equipajes...');
  console.log('📦 GET /equipajes - Endpoint:', ENDPOINTS.PUBLIC.GET_EQUIPAJES);
  console.log('📦 GET /equipajes - Base URL:', api.defaults.baseURL);
  try {
    const res = await api.get(ENDPOINTS.PUBLIC.GET_EQUIPAJES);
    console.log('✅ GET /equipajes - Respuesta exitosa:', res.data);
    console.log('✅ GET /equipajes - Cantidad:', res.data.length);
    console.log('✅ GET /equipajes - Status:', res.status);
    return res.data;
  } catch (error: any) {
    console.error('❌ GET /equipajes - Error:', error);
    console.error('❌ GET /equipajes - Status:', error.response?.status);
    console.error('❌ GET /equipajes - Data:', error.response?.data);
    throw error;
  }
};
