require('dotenv').config();

const email = process.argv[2];
const nombre = process.argv[3] || 'Usuario Prueba';

if (!email) {
  console.error('❌ USO: node tools/test-all.js tu@email.com "Tu Nombre"');
  console.log('\n📧 Este script probará TODOS los correos:');
  console.log('   1. Correo de bienvenida (registro)');
  console.log('   2. Confirmación de reserva + notificación admin');
  console.log('   3. Confirmación de pago + notificación admin');
  console.log('   4. Notificación de vuelo creado (solo admin)');
  process.exit(1);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAll() {
  try {
    console.log('🚀 Iniciando prueba COMPLETA del sistema de correos...');
    console.log(`📧 Email del cliente: ${email}`);
    console.log(`👤 Nombre: ${nombre}`);
    console.log('⏱️  Enviando correos con intervalos de 3 segundos...\n');

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // 1. REGISTRO
    console.log('1️⃣ Enviando correo de REGISTRO...');
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: '¡Bienvenido a FlyBlue! ✈️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">✈️ ¡Bienvenido a FlyBlue!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>Hola ${nombre}! 👋</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Ya puedes comenzar a reservar tus vuelos con nosotros.</p>
            <p>¡Gracias por elegir FlyBlue!</p>
          </div>
        </div>
      `
    });
    console.log('   ✅ Correo de bienvenida enviado');
    await sleep(3000);

    // 2. RESERVA
    console.log('\n2️⃣ Enviando correos de RESERVA...');
    const codigoReserva = `BK-${Date.now().toString().slice(-6)}`;
    
    // Cliente
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
            <p>Hola <strong>${nombre}</strong>, tu reserva ${codigoReserva} está confirmada.</p>
          </div>
        </div>
      `
    });
    
    // Admin
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
                  <li><strong>Vuelo:</strong> Madrid → Barcelona</li>
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
    
    console.log('   ✅ Confirmación al cliente enviada');
    console.log('   ✅ Notificación al admin enviada');
    await sleep(3000);

    // 3. PAGO
    console.log('\n3️⃣ Enviando correos de PAGO...');
    const total = 49.99;
    
    // Cliente (correo completo)
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `🎉 Pago Confirmado - €${total}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">💳 ¡Pago Confirmado!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2>¡Gracias ${nombre}! ✈️</h2>
            <p>Tu pago de €${total} ha sido procesado exitosamente.</p>
            <p><strong>Reserva:</strong> ${codigoReserva}</p>
            <p><strong>Vuelo:</strong> Madrid → Barcelona</p>
            <p><strong>Asiento:</strong> 12A</p>
          </div>
        </div>
      `
    });
    
    // Admin
    await sgMail.send({
      to: 'flyblue2025@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `💰 Nuevo pago - €${total}`,
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
    
    console.log('   ✅ Confirmación completa al cliente enviada');
    console.log('   ✅ Notificación de pago al admin enviada');
    await sleep(3000);

    // 4. VUELO CREADO
    console.log('\n4️⃣ Enviando correo de VUELO CREADO...');
    const codigoVuelo = `SL${Date.now().toString().slice(-3)}`;
    
    await sgMail.send({
      to: 'flyblue2025@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `✈️ Nuevo vuelo - ${codigoVuelo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #0057ff, #4285f4); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✈️ Nuevo Vuelo</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Vuelo creado exitosamente</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">Vuelo ${codigoVuelo}</h2>
              <div style="background: #f0f8ff; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0057ff;">
                <h3 style="color: #0057ff; margin-top: 0;">⚙️ Detalles del vuelo:</h3>
                <ul style="line-height: 1.8; color: #666;">
                  <li><strong>Código:</strong> <span style="color: #0057ff; font-weight: bold; font-family: monospace;">${codigoVuelo}</span></li>
                  <li><strong>Precio base:</strong> <span style="color: #28a745; font-weight: bold;">€89.99</span></li>
                  <li><strong>Fecha de creación:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  <li><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">Activo</span></li>
                  <li><strong>Asientos:</strong> 180 disponibles</li>
                </ul>
              </div>
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  📝 <strong>Recordatorio:</strong> El vuelo ya está disponible para reservas en el sistema.
                </p>
              </div>
              <p style="color: #666; text-align: center; margin-top: 30px;">
                <strong>Panel de Administración FlyBlue</strong>
              </p>
            </div>
          </div>
        </div>
      `
    });
    
    console.log('   ✅ Notificación de vuelo al admin enviada');

    console.log('\n🎉 ¡PRUEBA COMPLETA FINALIZADA!');
    console.log('\n📬 Revisa estos correos:');
    console.log(`   • ${email}: 3 correos (bienvenida, reserva, pago)`);
    console.log('   • flyblue2025@gmail.com: 3 correos (reserva, pago, vuelo)');
    console.log('\n💡 Total: 6 correos enviados');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAll();