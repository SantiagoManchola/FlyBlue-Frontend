import {
  crearCiudad,
  obtenerCiudades,
} from "../api/admin/ciudades.api";
import {
  crearVuelo,
  obtenerVueloPorId,
  buscarVuelos,
  obtenerTodosLosVuelos,
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
import { emailService } from "./emailService";

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
      const vuelo = await crearVuelo(data);
      
      // Notificar por correo la creación del vuelo
      try {
        await emailService.enviarCorreo({
          to: 'flyblue2025@gmail.com',
          subject: `✈️ Nuevo vuelo creado - ${vuelo.codigo}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">✈️ Nuevo Vuelo Creado</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2>Vuelo ${vuelo.codigo} creado exitosamente</h2>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                  <ul style="line-height: 1.8;">
                    <li><strong>Código:</strong> ${vuelo.codigo}</li>
                    <li><strong>Precio base:</strong> €${vuelo.precio_base}</li>
                    <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.warn('Error enviando notificación de vuelo:', emailError);
      }
      
      return vuelo;
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

  obtenerTodosLosVuelos: async () => {
    try {
      return await obtenerTodosLosVuelos();
    } catch (error) {
      console.error("Error al obtener todos los vuelos:", error);
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
