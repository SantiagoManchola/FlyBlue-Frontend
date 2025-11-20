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
      const response = await fetch('http://localhost:3001/api/email/send', {
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
              <li><strong>Monto:</strong> €${monto.toLocaleString()}</li>
              <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    return emailService.enviarCorreo({
      to: correo,
      subject: `Confirmación de Pago - ${codigoReserva}`,
      html
    });
  }
};