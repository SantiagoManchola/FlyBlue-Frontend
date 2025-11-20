require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.error('❌ USO: node tools/test-pago-confirmacion.js tu@email.com');
  process.exit(1);
}

async function testConfirmacionPago() {
  try {
    console.log('💳 Probando correo de confirmación de pago...');
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const codigoReserva = `RES-${Date.now().toString().slice(-6)}`;
    const monto = 149.99;

    console.log(`📤 Enviando confirmación de pago a: ${email}`);
    
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
          
          <p style="text-align: center; margin-top: 30px;">
            ¡Gracias por elegir FlyBlue! ✈️<br>
            <strong>Equipo FlyBlue</strong>
          </p>
        </div>
      </div>
    `;

    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Confirmación de Pago - ${codigoReserva}`,
      html
    });

    console.log('✅ Correo de confirmación de pago enviado exitosamente!');
    console.log(`📬 Destinatario: ${email}`);
    console.log(`📋 Reserva: ${codigoReserva}`);
    console.log(`💰 Monto: €${monto}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConfirmacionPago();