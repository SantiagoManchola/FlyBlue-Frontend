import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";
import { emailStyles } from "../config";

interface Props {
  nombre: string;
  vuelo: string;
  fecha: string;
  total: number;
}

export default function PaymentSuccessEmail({
  nombre,
  vuelo,
  fecha,
  total,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Confirmación de pago - FlyBlue</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={emailStyles.title}>✅ ¡Pago Confirmado!</Text>
          </Section>

          <Section style={emailStyles.content}>
            <Text style={emailStyles.message}>
              Hola <strong>{nombre}</strong>, tu pago se ha procesado exitosamente.
            </Text>

            <Text style={emailStyles.message}>Detalles de tu reserva:</Text>

            <Text style={emailStyles.detail}>✈️ Vuelo: {vuelo}</Text>
            <Text style={emailStyles.detail}>📅 Fecha: {fecha}</Text>
            <Text style={emailStyles.detail}>💳 Total: ${total}</Text>
          </Section>

          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              Gracias por usar FlyBlue. ¡Te deseamos un excelente viaje!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
