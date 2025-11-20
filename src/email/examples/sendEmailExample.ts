import sgMail from '@sendgrid/mail';
import { emailConfig } from '../config';

sgMail.setApiKey(emailConfig.apiKey!);

interface EmailData {
  to: string;
  subject: string;
  customerName: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
}

const createFlightConfirmationTemplate = (data: EmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmación de Vuelo - FlyBlue</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f3f3;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
    
    <div style="background: linear-gradient(135deg, #0057ff, #0041cc); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">FlyBlue</h1>
      <p style="color: #e6f0ff; margin: 10px 0 0 0;">Tu vuelo está confirmado</p>
    </div>

    <div style="padding: 30px 20px;">
      <h2 style="color: #333333; margin: 0 0 20px 0;">¡Hola ${data.customerName}!</h2>
      
      <p style="color: #666666; font-size: 16px; margin: 0 0 25px 0;">
        Tu reserva ha sido confirmada exitosamente. Aquí tienes los detalles:
      </p>

      <div style="background-color: #f8f9ff; border: 2px solid #0057ff; border-radius: 8px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #0057ff; margin: 0 0 20px 0;">Vuelo ${data.flightNumber}</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>Origen:</strong> ${data.departure}<br>
          <strong>Destino:</strong> ${data.arrival}<br>
          <strong>Fecha:</strong> ${data.date}<br>
          <strong>Hora:</strong> ${data.time}
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background-color: #0057ff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Ver mi reserva</a>
      </div>
    </div>

    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
      <p style="color: #666666; margin: 0; font-size: 14px;">
        © 2024 FlyBlue. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const sendFlightConfirmationEmail = async (emailData: EmailData) => {
  try {
    const msg = {
      to: emailData.to,
      from: {
        email: emailConfig.fromEmail!,
        name: emailConfig.fromName!,
      },
      subject: emailData.subject,
      html: createFlightConfirmationTemplate(emailData),
    };

    const response = await sgMail.send(msg);
    console.log('✅ Email enviado:', response[0].statusCode);
    return { success: true, statusCode: response[0].statusCode };
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
};

export const exampleUsage = async () => {
  const emailData: EmailData = {
    to: 'cliente@ejemplo.com',
    subject: 'Confirmación de vuelo - FlyBlue FB123',
    customerName: 'Juan Pérez',
    flightNumber: 'FB123',
    departure: 'Madrid (MAD)',
    arrival: 'Barcelona (BCN)',
    date: '15 de Enero, 2024',
    time: '14:30'
  };

  return await sendFlightConfirmationEmail(emailData);
};