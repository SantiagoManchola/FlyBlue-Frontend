// src/pages/client/PaymentSuccessPage.tsx

import { Check } from "lucide-react";
// AJUSTA ESTOS IMPORTS SEGÚN TU ESTRUCTURA
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

// Por ahora usamos un booking "mock" igual al de CreatePayment.
// Si luego recibes estos datos por props, contexto o query params, los reemplazas.
const booking = {
  bookingNumber: "BK-123456",
  flightNumber: "SL101",
  origin: "Madrid (MAD)",
  destination: "Barcelona (BCN)",
  departureDate: "15 Feb 2024",
  departureTime: "08:00",
  passengerName: "Juan Pérez",
  seat: "12A",
  flightPrice: 49.99,
  luggagePrice: 0,
  totalPrice: 49.99,
};

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-green-200">
        <CardContent className="p-12 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-green-600 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Tu pago ha sido procesado correctamente en PayPal Sandbox. Tu vuelo
            está confirmado.
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Número de Transacción</p>
            <p className="text-2xl text-green-600">
              TRX-{Date.now().toString().slice(-8)}
            </p>
          </div>

          <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Reserva:</span>
              <span className="text-gray-800">{booking.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vuelo:</span>
              <span className="text-gray-800">{booking.flightNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pasajero:</span>
              <span className="text-gray-800">{booking.passengerName}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Total Pagado:</span>
              <span className="text-green-600">€{booking.totalPrice}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Hemos enviado tu tarjeta de embarque por correo electrónico
            (simulado).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
