import type { PaymentEmailProps } from "./services/resendService";

export interface SendEmailRequest {
  to: string;
  template: "payment_success";
  data: PaymentEmailProps;
}

export async function sendEmail(request: SendEmailRequest) {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const url = base + "/api/email/send";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error(`Error sending email: ${res.status}`);

  return res.json();
}
