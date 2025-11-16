require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'flyblue2025@gmail.com';
const fromName = process.env.SENDGRID_FROM_NAME || 'FlyBlue';
const toEmail = process.argv[2] || 'test@ejemplo.com';

if (!apiKey) {
  console.error('ERROR: Falta SENDGRID_API_KEY en .env');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

const createEmailTemplate = (customerName, flightNumber, departure, arrival, date, time) => `
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
      <h2 style="color: #333333; margin: 0 0 20px 0;">¡Hola ${customerName}!</h2>
      
      <p style="color: #666666; font-size: 16px; margin: 0 0 25px 0;">
        Tu reserva ha sido confirmada exitosamente. Aquí tienes los detalles:
      </p>

      <div style="background-color: #f8f9ff; border: 2px solid #0057ff; border-radius: 8px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #0057ff; margin: 0 0 20px 0;">Vuelo ${flightNumber}</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>Origen:</strong> ${departure}<br>
          <strong>Destino:</strong> ${arrival}<br>
          <strong>Fecha:</strong> ${date}<br>
          <strong>Hora:</strong> ${time}
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

async function sendExample() {
  try {
    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: 'Confirmación de vuelo - FlyBlue FB123',
      html: createEmailTemplate(
        'Juan Pérez',
        'FB123', 
        'Madrid (MAD)',
        'Barcelona (BCN)',
        '15 de Enero, 2024',
        '14:30'
      )
    };

    const response = await sgMail.send(msg);
    console.log('✅ Email enviado exitosamente a:', toEmail);
    console.log('📊 Status:', response[0].statusCode);
  } catch (error) {
    console.error('❌ Error al enviar:', error.message);
  }
}

console.log('📧 Enviando email de ejemplo a:', toEmail);
sendExample();