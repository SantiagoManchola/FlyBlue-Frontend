import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return res.status(500).json({ 
      error: 'SendGrid not configured. Add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.' 
    });
  }

  try {
    sgMail.setApiKey(apiKey);

    const msg = {
      to,
      from: fromEmail,
      subject,
      html,
    };

    await sgMail.send(msg);

    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message || 'Unknown error'
    });
  }
}