require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;
const to = process.argv[2];

if (!user || !pass) {
  console.error('❌ ERROR: Configura GMAIL_USER y GMAIL_APP_PASSWORD en .env');
  console.log('\n📝 Pasos para configurar Gmail:');
  console.log('1. Ve a https://myaccount.google.com/security');
  console.log('2. Activa la verificación en 2 pasos');
  console.log('3. Genera una contraseña de aplicación');
  console.log('4. Usa esa contraseña en GMAIL_APP_PASSWORD');
  process.exit(1);
}

if (!to) {
  console.error('❌ USO: node tools/send-real-email.js destino@ejemplo.com');
  process.exit(1);
}

async function sendRealEmail() {
  try {
    console.log('📧 Configurando transporter Gmail...');
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    console.log('✅ Transporter configurado');
    console.log(`📤 Enviando correo de ${user} a ${to}...`);

    const info = await transporter.sendMail({
      from: `"FlyBlue ✈️" <${user}>`,
      to,
      subject: '🎉 Prueba de correo real - FlyBlue',
      text: 'Este es un correo de prueba enviado desde FlyBlue usando Gmail SMTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0057ff, #4285f4); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✈️ FlyBlue</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu aerolínea de confianza</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h2 style="color: #333; margin-top: 0;">¡Correo enviado exitosamente! 🎉</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Este es un <strong>correo de prueba real</strong> enviado desde la aplicación FlyBlue 
                usando Gmail SMTP.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">📋 Detalles del envío:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li><strong>Desde:</strong> ${user}</li>
                  <li><strong>Para:</strong> ${to}</li>
                  <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
                  <li><strong>Método:</strong> Gmail SMTP</li>
                </ul>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Si recibes este mensaje, significa que el sistema de correos está 
                <span style="color: #28a745; font-weight: bold;">funcionando perfectamente</span> ✅
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; margin: 0; font-size: 14px;">
                © 2025 FlyBlue - Sistema de correos electrónicos
              </p>
            </div>
            
          </div>
        </div>
      `
    });

    console.log('🎉 ¡Correo enviado exitosamente!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Revisa la bandeja de entrada de:', to);
    
  } catch (err) {
    console.error('❌ Error enviando correo:', err.message);
    
    if (err.code === 'EAUTH') {
      console.log('\n🔐 Error de autenticación. Verifica:');
      console.log('1. GMAIL_USER está correcto');
      console.log('2. GMAIL_APP_PASSWORD es una contraseña de aplicación válida');
      console.log('3. La verificación en 2 pasos está activada en Gmail');
    }
    
    process.exit(1);
  }
}

sendRealEmail();