import {
    crearReserva,
    obtenerReservas,
} from "../api/client/reservas.api";
import {
    procesarPago,
} from "../api/client/pagos.api";
import {
    ReservaRequest,
    PagoRequest
} from "../api/types";
import { emailService } from "./emailService";


export const clientService = {
    crearReserva: async (data: ReservaRequest) => {
        try {
            const reserva = await crearReserva(data);
            
            // Enviar correo de confirmación al cliente
            try {
                await emailService.enviarConfirmacionReserva({
                    nombre: data.nombre || 'Cliente',
                    correo: data.correo || '',
                    codigoReserva: reserva.codigo || 'N/A',
                    vuelo: `${data.origen} → ${data.destino}`,
                    fecha: data.fecha_vuelo || '',
                    asientos: data.asientos || []
                });
                
                // Notificar a administradores
                await emailService.notificarNuevaReserva('flyblue2025@gmail.com', {
                    codigo: reserva.codigo || 'N/A',
                    cliente: data.nombre || 'Cliente',
                    vuelo: `${data.origen} → ${data.destino}`
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
            
            // Enviar correo de confirmación de pago al cliente
            try {
                await emailService.enviarConfirmacionPago(
                    data.correo || '',
                    `RES-${reservaId}`,
                    data.monto || 0
                );
                
                // Notificar a administradores del nuevo pago
                await emailService.notificarNuevoPago('flyblue2025@gmail.com', {
                    reserva: `RES-${reservaId}`,
                    cliente: data.nombre_titular || 'Cliente',
                    monto: data.monto || 0
                });
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
