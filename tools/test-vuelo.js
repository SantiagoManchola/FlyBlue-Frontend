require('dotenv').config();

async function testVuelo() {
  try {
    console.log('✈️ Probando correo de VUELO CREADO...');
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const codigoVuelo = `SL${Date.now().toString().slice(-3)}`;
    const precioBase = 89.99;

    console.log('📤 Enviando notificación de vuelo creado al admin...');
    
    await sgMail.send({
      to: 'flyblue2025@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `✈️ Nuevo vuelo creado - ${codigoVuelo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">✈️ Nuevo Vuelo Creado</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>Vuelo ${codigoVuelo} creado exitosamente</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <ul style="line-height: 1.8;">
                <li><strong>Código:</strong> ${codigoVuelo}</li>
                <li><strong>Precio base:</strong> €${precioBase}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
              </ul>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ Correo de VUELO CREADO enviado exitosamente!');
    console.log('📬 Admin: Notificación de nuevo vuelo');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testVuelo();