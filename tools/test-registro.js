require('dotenv').config();
const { emailService } = require('../src/services/emailService');

const email = process.argv[2];
const nombre = process.argv[3] || 'Usuario Prueba';

if (!email) {
  console.error('❌ USO: node tools/test-registro.js tu@email.com "Tu Nombre"');
  process.exit(1);
}

async function testRegistro() {
  try {
    console.log('📝 Probando correo de REGISTRO...');
    console.log(`📤 Enviando correo de bienvenida a: ${email}`);
    
    // Simular el correo de bienvenida del registro
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    console.log('✅ Correo de REGISTRO enviado exitosamente!');
    console.log('📬 Revisa tu bandeja de entrada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRegistro();