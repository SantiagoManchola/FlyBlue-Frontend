require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const to = process.argv[2];

if (!apiKey) {
  console.error('❌ ERROR: SENDGRID_API_KEY no configurado en .env');
  process.exit(1);
}

if (!to) {
  console.error('❌ USO: node tools/send-sendgrid-real.js destino@ejemplo.com');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function sendRealEmail() {
  try {
    console.log('📧 Configurando SendGrid...');
    console.log(`📤 Enviando correo de ${fromEmail} a ${to}...`);

    const msg = {
      to,
      from: fromEmail,
      subject: '🎉 Prueba de correo real - FlyBlue',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #0057ff, #4285f4); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✈️ FlyBlue</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu aerolínea de confianza</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">¡Correo enviado exitosamente! 🎉</h2>
              <p style="color: #666; line-height: 1.6;">
                Este es un <strong>correo de prueba real</strong> enviado desde FlyBlue usando SendGrid.
              </p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">📋 Detalles:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li><strong>Para:</strong> ${to}</li>
                  <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  <li><strong>Método:</strong> SendGrid API</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('🎉 ¡Correo enviado exitosamente con SendGrid!');
    console.log('📬 Revisa la bandeja de entrada de:', to);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('📄 Detalles:', error.response.body);
    }
  }
}

sendRealEmail();