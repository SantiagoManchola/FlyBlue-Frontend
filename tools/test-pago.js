require('dotenv').config();

const email = process.argv[2];
const nombre = process.argv[3] || 'Usuario Prueba';

if (!email) {
  console.error('❌ USO: node tools/test-pago.js tu@email.com "Tu Nombre"');
  process.exit(1);
}

async function testPago() {
  try {
    console.log('💳 Probando correos de PAGO...');
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const codigoReserva = `BK-${Date.now().toString().slice(-6)}`;
    const vuelo = 'SL101';
    const origen = 'Madrid (MAD)';
    const destino = 'Barcelona (BCN)';
    const fecha = '15 Feb 2024';
    const hora = '08:00';
    const asiento = '12A';
    const precioVuelo = 49.99;
    const total = 49.99;
    const transaccion = `TRX-${Date.now().toString().slice(-8)}`;

    // 1. Correo detallado al cliente
    console.log(`📤 Enviando confirmación de pago completa a: ${email}`);
    
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `🎉 Pago Confirmado - Vuelo ${vuelo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💳 ¡Pago Confirmado!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu vuelo está listo</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">¡Gracias ${nombre}! ✈️</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                Tu pago ha sido procesado exitosamente. Tu vuelo está confirmado y listo para el viaje.
              </p>
              
              <!-- Detalles del Vuelo -->
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">✈️ Detalles del Vuelo</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Reserva:</strong>
                    <span style="color: #333; font-weight: bold;">${codigoReserva}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Vuelo:</strong>
                    <span style="color: #333;">${vuelo}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Ruta:</strong>
                    <span style="color: #333;">${origen} → ${destino}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Fecha:</strong>
                    <span style="color: #333;">${fecha} - ${hora}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Pasajero:</strong>
                    <span style="color: #333;">${nombre}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #666;">Asiento:</strong>
                    <span style="color: #333; font-weight: bold;">${asiento}</span>
                  </div>
                </div>
              </div>
              
              <!-- Detalles del Pago -->
              <div style="background: #e8f5e8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
                <h3 style="color: #28a745; margin-top: 0; margin-bottom: 20px;">💰 Resumen del Pago</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span style="color: #666;">Precio del vuelo:</span>
                    <span style="color: #333;">€${precioVuelo}</span>
                  </div>
                  <div style="border-top: 2px solid #28a745; padding-top: 12px; margin-top: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                      <strong style="color: #28a745; font-size: 18px;">Total Pagado:</strong>
                      <strong style="color: #28a745; font-size: 20px;">€${total}</strong>
                    </div>
                  </div>
                  <div style="margin-top: 15px; padding: 12px; background: white; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                      <span style="color: #666;">Transacción:</span>
                      <span style="color: #333; font-family: monospace;">${transaccion}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-top: 8px;">
                      <span style="color: #666;">Fecha de pago:</span>
                      <span style="color: #333;">${new Date().toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p style="color: #666; line-height: 1.6; text-align: center; margin-top: 30px;">
                ¡Que tengas un excelente viaje! ✈️<br>
                <strong>Equipo FlyBlue</strong>
              </p>
            </div>
            
          </div>
        </div>
      `
    });

    // 2. Notificación al admin
    console.log('📤 Enviando notificación de pago al admin...');
    
    await sgMail.send({
      to: 'flyblue2025@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `💰 Nuevo pago procesado - €${total}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💰 Nuevo Pago</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Pago procesado exitosamente</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Pago de €${total}</h2>
              <div style="background: #e8f5e8; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="color: #28a745; margin-top: 0;">💳 Detalles del pago:</h3>
                <ul style="line-height: 1.8; color: #666;">
                  <li><strong>Reserva:</strong> ${codigoReserva}</li>
                  <li><strong>Cliente:</strong> ${nombre}</li>
                  <li><strong>Monto:</strong> <span style="color: #28a745; font-weight: bold; font-size: 18px;">€${total}</span></li>
                  <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  <li><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">Procesado</span></li>
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

    console.log('✅ Correos de PAGO enviados exitosamente!');
    console.log(`📬 Cliente (${email}): Confirmación completa de pago`);
    console.log('📬 Admin: Notificación de nuevo pago');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPago();