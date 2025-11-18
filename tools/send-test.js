require('dotenv').config();
const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
const from = process.env.VITE_EMAIL_FROM || 'noreply@flyblue.com';
const to = process.argv[2];

if (!apiKey) {
  console.error('ERROR: No Resend API key found. Create a .env with RESEND_API_KEY.');
  process.exit(1);
}

if (!to) {
  console.error('USO: node tools/send-test.js tu_email@ejemplo.com');
  process.exit(1);
}

const client = new Resend(apiKey);

async function sendTest() {
  try {
    const resp = await client.emails.send({
      from,
      to,
      subject: 'Prueba de envío - FlyBlue',
      html: `
        <html>
          <body>
            <h2>Prueba de envío desde FlyBlue</h2>
            <p>Si recibes esto, la API de Resend está funcionando correctamente.</p>
            <p>Fecha: ${new Date().toISOString()}</p>
          </body>
        </html>
      `,
    });

    console.log('Envío OK:', resp);
  } catch (err) {
    console.error('Error al enviar:', err);
    process.exit(1);
  }
}

sendTest();
