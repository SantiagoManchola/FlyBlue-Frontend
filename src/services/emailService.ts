interface EmailData {
  to: string;
  subject: string;
  html: string;
}

interface ReservaEmailData {
  nombre: string;
  correo: string;
  codigoReserva: string;
  vuelo: string;
  fecha: string;
  asientos: string[];
}

export const emailService = {
  enviarCorreo: async (data: EmailData) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw error;
    }
  },

  enviarConfirmacionReserva: async (data: ReservaEmailData) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">✈️ FlyBlue</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>¡Reserva Confirmada! 🎉</h2>
          <p>Hola <strong>${data.nombre}</strong>,</p>
          <p>Tu reserva ha sido confirmada exitosamente.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Detalles de tu reserva:</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Código:</strong> ${data.codigoReserva}</li>
              <li><strong>Vuelo:</strong> ${data.vuelo}</li>
              <li><strong>Fecha:</strong> ${data.fecha}</li>
              <li><strong>Asientos:</strong> ${data.asientos.join(', ')}</li>
            </ul>
          </div>
          
          <p>¡Buen viaje! ✈️</p>
        </div>
      </div>
    `;

    return this.enviarCorreo({
      to: data.correo,
      subject: `Confirmación de Reserva - ${data.codigoReserva}`,
      html
    });
  },

  enviarConfirmacionPago: async (correo: string, codigoReserva: string, monto: number) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">💳 Pago Confirmado</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2>¡Pago Procesado Exitosamente! ✅</h2>
          <p>Tu pago ha sido procesado correctamente.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <ul style="line-height: 1.8;">
              <li><strong>Reserva:</strong> ${codigoReserva}</li>
              <li><strong>Monto:</strong> $${monto.toLocaleString()}</li>
              <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    return this.enviarCorreo({
      to: correo,
      subject: `Confirmación de Pago - ${codigoReserva}`,
      html
    });
  },

  // Notificaciones administrativas
  notificarNuevaReserva: async (adminEmail: string, reservaData: any) => {
    return this.enviarCorreo({
      to: adminEmail,
      subject: `🎆 Nueva reserva - ${reservaData.codigo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #17a2b8; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🎆 Nueva Reserva</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>Reserva ${reservaData.codigo}</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <ul style="line-height: 1.8;">
                <li><strong>Cliente:</strong> ${reservaData.cliente}</li>
                <li><strong>Vuelo:</strong> ${reservaData.vuelo}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
              </ul>
            </div>
          </div>
        </div>
      `
    });
  },

  notificarNuevoPago: async (adminEmail: string, pagoData: any) => {
    return this.enviarCorreo({
      to: adminEmail,
      subject: `💰 Nuevo pago procesado - €${pagoData.monto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">💰 Nuevo Pago</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>Pago de €${pagoData.monto}</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <ul style="line-height: 1.8;">
                <li><strong>Reserva:</strong> ${pagoData.reserva}</li>
                <li><strong>Cliente:</strong> ${pagoData.cliente}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
              </ul>
            </div>
          </div>
        </div>
      `
    });
  }
};