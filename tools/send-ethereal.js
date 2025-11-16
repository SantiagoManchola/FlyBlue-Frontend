const nodemailer = require('nodemailer');

async function sendTest() {
  // Create a test account (Ethereal) — no signup required
  const testAccount = await nodemailer.createTestAccount();

  // Create transporter using the test account SMTP
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"FlyBlue Test" <noreply@flyblue.com>',
    to: 'julianrondon14@gmail.com',
    subject: 'Prueba Ethereal - FlyBlue',
    text: 'Este es un correo de prueba enviado mediante Ethereal y nodemailer.',
    html: '<h3>Prueba Ethereal - FlyBlue</h3><p>Si ves esto, el envío funcionó.</p>',
  });

  console.log('Mensaje enviado: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  console.log('\nCredenciales Ethereal (útiles si quieres ver el inbox):');
  console.log('  User:', testAccount.user);
  console.log('  Pass:', testAccount.pass);
}

sendTest().catch(err => {
  console.error('Error enviando correo de prueba:', err);
  process.exit(1);
});
