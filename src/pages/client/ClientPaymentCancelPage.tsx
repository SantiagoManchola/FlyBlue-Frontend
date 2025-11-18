// src/pages/client/PaymentCancelPage.tsx

import { X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

// Mock de booking
const booking = {
  bookingNumber: "BK-123456",
  flightNumber: "SL101",
  passengerName: "Juan Pérez",
  totalPrice: 49.99,
};

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate("/client/my-bookings");
  };

  const handleGoHome = () => {
    navigate("/client"); // Puedes cambiarlo a "/" o a la ruta que quieras
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-red-200">
        <CardContent className="p-12 text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-red-600 mb-2">Pago Rechazado</h2>
          <p className="text-gray-600 mb-6">
            Tu pago no pudo ser procesado o fue cancelado en PayPal Sandbox. La
            reserva no ha sido cobrada.
          </p>

          <div className="bg-red-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Código de Error</p>
            <p className="text-2xl text-red-600">
              ERR-{Date.now().toString().slice(-8)}
            </p>
          </div>

          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              El pago no se completó. Puedes revisar tus datos e intentar de
              nuevo.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Reserva:</span>
              <span className="text-gray-800">{booking.bookingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vuelo:</span>
              <span className="text-gray-800">{booking.flightNumber}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="text-gray-800">€{booking.totalPrice}</span>
            </div>
          </div>

          {/* Botón de volver a intentar */}
          <Button
            onClick={handleRetryPayment}
            className="w-full bg-sky-500 hover:bg-sky-600 mb-4"
          >
            Intentar Nuevamente
          </Button>

          {/* Botón adicional de volver al inicio */}
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="w-full"
          >
            Volver al inicio
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Sandbox: Para simular un pago exitoso, completa el flujo de pago en
            PayPal en lugar de cancelarlo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
