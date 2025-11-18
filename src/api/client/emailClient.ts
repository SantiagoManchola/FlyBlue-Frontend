// Función para enviar email de confirmación de pago
export async function sendPaymentConfirmationEmail(emailData: {
  to: string;
  nombre: string;
  vuelo: string;
  fecha: string;
  total: number;
}) {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.to,
        template: 'payment_success',
        data: {
          nombre: emailData.nombre,
          vuelo: emailData.vuelo,
          fecha: emailData.fecha,
          total: emailData.total,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email enviado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
}
