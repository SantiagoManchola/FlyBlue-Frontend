require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'flyblue2025@gmail.com';
const fromName = process.env.SENDGRID_FROM_NAME || 'FlyBlue';
const to = process.argv[2];

if (!apiKey) {
  console.error('ERROR: No SendGrid API key found. Create a .env with SENDGRID_API_KEY.');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function sendTest() {
  try {
    const msg = {
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: 'Prueba de envío - FlyBlue con SendGrid',
      html: `<h2>Prueba de envío desde FlyBlue</h2>`
    };

    const resp = await sgMail.send(msg);
    console.log('Envío OK:', resp[0].statusCode);
  } catch (err) {
    console.error('Error al enviar:', err.message);
  }
}

sendTest();
