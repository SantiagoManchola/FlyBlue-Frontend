import sgMail from "@sendgrid/mail";
import { render } from "@react-email/render";
import PaymentSuccessEmail from "../templates/PaymentSuccessEmail";
import { emailConfig } from "../config";

const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export interface PaymentEmailProps {
  nombre: string;
  vuelo: string;
  fecha: string;
  total: number;
}

export async function sendPaymentSuccessEmail(
  to: string,
  props: PaymentEmailProps
): Promise<{
  ok: boolean;
  id?: string;
  error?: any;
}> {
  if (!apiKey) {
    return { ok: false, error: "Missing SendGrid API key (SENDGRID_API_KEY)" };
  }

  try {
    const html = await render(<PaymentSuccessEmail {...props} />);

    const msg = {
      to,
      from: {
        email: emailConfig.fromEmail,
        name: emailConfig.fromName,
      },
      subject: "Confirmación de pago - FlyBlue",
      html,
    };

    const resp = await sgMail.send(msg as any);

    // SendGrid returns array with response info
    const messageId = resp[0].headers["x-message-id"] || resp[0].statusCode;

    return { ok: true, id: messageId };
  } catch (error) {
    return { ok: false, error };
  }
}
