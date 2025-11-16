require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;
const to = process.argv[2];

if (!user || !pass) {
  console.error('ERROR: faltan variables en .env. Añade GMAIL_USER y GMAIL_APP_PASSWORD');
  process.exit(1);
}

if (!to) {
  console.error('USO: node tools/send-gmail.js destino@ejemplo.com');
  process.exit(1);
}

async function send() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `${user}`,
      to,
      subject: 'Prueba Gmail SMTP - FlyBlue',
      text: 'Este es un correo de prueba enviado desde tu cuenta Gmail mediante nodemailer SMTP',
      html: `<p>Hola — este es un <strong>envío de prueba</strong> desde <em>${user}</em> a <em>${to}</em>.</p>`,
    });

    console.log('Envío OK, messageId:', info.messageId);
  } catch (err) {
    console.error('Error enviando con Gmail SMTP:', err);
    process.exit(1);
  }
}

send();
