import {
    crearReserva,
    obtenerReservas,
} from "../api/client/reservas.api";
import {
    procesarPago,
} from "../api/client/pagos.api";
import {
    ReservaRequest,
} from "../api/types";


export const clientService = {
    crearReserva: async (data: ReservaRequest) => {
        try {
            return await crearReserva(data);
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

    procesarPago: async (reservaId: number, data: any) => {
        try {
            return await procesarPago(reservaId, data);
        } catch (error) {
            console.error("Error al procesar pago:", error);
            throw error;
        }
    },
};
