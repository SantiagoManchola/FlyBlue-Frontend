// Email configuration for SendGrid
export const emailConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL || "flyblue2025@gmail.com",
  fromName: process.env.SENDGRID_FROM_NAME || "FlyBlue",
};

// Email styles
export const emailStyles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f3f3f3",
    padding: "20px",
  },
  container: {
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "600px",
  },
  header: {
    backgroundColor: "#0057ff",
    padding: "20px",
    textAlign: "center" as const,
    borderRadius: "8px 8px 0 0",
  },
  title: {
    color: "#ffffff",
    fontSize: "24px",
    margin: 0,
  },
  content: {
    padding: "20px",
  },
  message: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  detail: {
    fontSize: "15px",
    margin: "5px 0",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "14px",
    color: "#888888",
  },
};
