require('dotenv').config();

const email = process.argv[2];
const nombre = process.argv[3] || 'Usuario Prueba';

if (!email) {
  console.error('❌ USO: node tools/test-reserva.js tu@email.com "Tu Nombre"');
  process.exit(1);
}

async function testReserva() {
  try {
    console.log('🎫 Probando correos de RESERVA...');
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const codigoReserva = `BK-${Date.now().toString().slice(-6)}`;
    const vuelo = 'Madrid → Barcelona';
    const fecha = new Date().toLocaleDateString('es-ES');
    const asientos = ['12A'];

    // 1. Correo al cliente
    console.log(`📤 Enviando confirmación de reserva a: ${email}`);
    
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Confirmación de Reserva - ${codigoReserva}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">✈️ FlyBlue</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>¡Reserva Confirmada! 🎉</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu reserva ha sido confirmada exitosamente.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 Detalles de tu reserva:</h3>
              <ul style="line-height: 1.8;">
                <li><strong>Código:</strong> ${codigoReserva}</li>
                <li><strong>Vuelo:</strong> ${vuelo}</li>
                <li><strong>Fecha:</strong> ${fecha}</li>
                <li><strong>Asientos:</strong> ${asientos.join(', ')}</li>
              </ul>
            </div>
            
            <p>¡Buen viaje! ✈️</p>
          </div>
        </div>
      `
    });

    // 2. Notificación al admin
    console.log('📤 Enviando notificación al admin...');
    
    await sgMail.send({
      to: 'flyblue2025@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `🎆 Nueva reserva - ${codigoReserva}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #17a2b8, #20c997); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎆 Nueva Reserva</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Notificación administrativa</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Reserva ${codigoReserva}</h2>
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">📋 Detalles:</h3>
                <ul style="line-height: 1.8; color: #666;">
                  <li><strong>Cliente:</strong> ${nombre}</li>
                  <li><strong>Vuelo:</strong> ${vuelo}</li>
                  <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  <li><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">Confirmada</span></li>
                </ul>
              </div>
              <p style="color: #666; text-align: center; margin-top: 30px;">
                <strong>Panel de Administración FlyBlue</strong>
              </p>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ Correos de RESERVA enviados exitosamente!');
    console.log(`📬 Cliente (${email}): Confirmación de reserva`);
    console.log('📬 Admin: Notificación de nueva reserva');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testReserva();