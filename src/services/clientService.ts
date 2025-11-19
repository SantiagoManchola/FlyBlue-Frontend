import {
    crearReserva,
    obtenerReservas,
} from "../api/client/reservas.api";
import {
    procesarPago,
} from "../api/client/pagos.api";
import {
    obtenerCiudades,
    obtenerTodosLosVuelos,
    buscarVuelosConFiltros,
} from "../api/client/vuelos.api";
import {
    ReservaRequest,
    PagoRequest
} from "../api/types";
import { emailService } from "./emailService";

export const clientService = {
    obtenerCiudades: async () => {
        try {
            return await obtenerCiudades();
        } catch (error) {
            console.error("Error al obtener ciudades:", error);
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

    buscarVuelosConFiltros: async (
        filtros: { origen?: number; destino?: number; fecha?: string }
    ) => {
        try {
            return await buscarVuelosConFiltros(filtros);
        } catch (error) {
            console.error("Error al buscar vuelos con filtros:", error);
            throw error;
        }
    },

    crearReserva: async (data: ReservaRequest) => {
        try {
            const reserva = await crearReserva(data);
            
            try {
                await emailService.enviarConfirmacionReserva({
                    nombre: data.nombre || 'Cliente',
                    correo: data.correo || '',
                    codigoReserva: reserva.codigo || 'N/A',
                    vuelo: `${data.origen} → ${data.destino}`,
                    fecha: data.fecha_vuelo || '',
                    asientos: data.asientos || []
                });
            } catch (emailError) {
                console.warn('Error enviando correos:', emailError);
            }
            
            return reserva;
        } catch (error) {
            console.error("Error al crear reserva:", error);
            throw error;
        }
    },

    obtenerReservas: async (id_usuario: number) => {
        try {
            return await obtenerReservas(id_usuario);
        } catch (error) {
            console.error("Error al obtener reservas:", error);
            throw error;
        }
    },

    procesarPago: async (reservaId: number, data: PagoRequest) => {
        try {
            const pago = await procesarPago(reservaId, data);
            
            try {
                await emailService.enviarConfirmacionPago(
                    data.correo || '',
                    `RES-${reservaId}`,
                    data.monto || 0
                );
            } catch (emailError) {
                console.warn('Error enviando correos:', emailError);
            }
            
            return pago;
        } catch (error) {
            console.error("Error al procesar pago:", error);
            throw error;
        }
    },
};
