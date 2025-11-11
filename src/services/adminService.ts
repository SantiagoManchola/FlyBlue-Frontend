import {
  crearCiudad,
  obtenerCiudades,
} from "../api/admin/ciudades.api";
import {
  crearVuelo,
  obtenerVueloPorId,
  buscarVuelos,
} from "../api/admin/vuelos.api";
import {
  crearEquipaje,
  obtenerEquipajes,
} from "../api/admin/equipajes.api";
import {
  CiudadRequest,
  EquipajeRequest,
  VueloRequest,
  VueloBusquedaResponse,
} from "../api/types";

export const adminService = {
  crearCiudad: async (data: CiudadRequest) => {
    try {
      return await crearCiudad(data);
    } catch (error) {
      console.error("Error al crear ciudad:", error);
      throw error;
    }
  },

  obtenerCiudades: async () => {
    try {
      return await obtenerCiudades();
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
      throw error;
    }
  },

  crearVuelo: async (data: VueloRequest) => {
    try {
      return await crearVuelo(data);
    } catch (error) {
      console.error("Error al crear vuelo:", error);
      throw error;
    }
  },

  obtenerVueloPorId: async (id_vuelo: number) => {
    try {
      return await obtenerVueloPorId(id_vuelo);
    } catch (error) {
      console.error("Error al obtener vuelo:", error);
      throw error;
    }
  },

  buscarVuelos: async (
    origen: number,
    destino: number,
    fecha: string
  ): Promise<VueloBusquedaResponse[]> => {
    try {
      return await buscarVuelos(origen, destino, fecha);
    } catch (error) {
      console.error("Error al buscar vuelos:", error);
      throw error;
    }
  },

  crearEquipaje: async (data: EquipajeRequest) => {
    try {
      return await crearEquipaje(data);
    } catch (error) {
      console.error("Error al crear equipaje:", error);
      throw error;
    }
  },

  obtenerEquipajes: async () => {
    try {
      return await obtenerEquipajes();
    } catch (error) {
      console.error("Error al obtener equipajes:", error);
      throw error;
    }
  },
};
