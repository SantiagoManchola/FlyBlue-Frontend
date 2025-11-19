import { useState } from 'react';
import { CreditCard, Lock, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { emailService } from '../../services/emailService';

const PAYPAL_BUSINESS_EMAIL = 'tesoreria@flyblue.com';
const PAYPAL_SANDBOX_URL = 'https://www.sandbox.paypal.com';

declare global {
  interface Window {
    paypal: any;
  }
}

type CreatePaymentProps = {
  bookingId: string;
};

export default function CreatePayment({ bookingId }: CreatePaymentProps) {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Mock booking data
  const booking = {
    bookingNumber: 'BK-123456',
    flightNumber: 'SL101',
    origin: 'Madrid (MAD)',
    destination: 'Barcelona (BCN)',
    departureDate: '15 Feb 2024',
    departureTime: '08:00',
    passengerName: 'Juan Pérez',
    seat: '12A',
    flightPrice: 49.99,
    luggagePrice: 0,
    totalPrice: 49.99,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentFailed(false);

    try {

      // 2. Crear un formulario HTML oculto que apunta a PayPal Sandbox
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', PAYPAL_SANDBOX_URL);

      // Función auxiliar para añadir campos al formulario
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        form.appendChild(input);
      };

      // 3. Campos mínimos para un pago simple (_xclick)
      addField('cmd', '_xclick'); // tipo de operación
      addField('business', PAYPAL_BUSINESS_EMAIL); // a quién se le paga
      addField(
        'item_name',
        `Reserva ${booking.bookingNumber} - Vuelo ${booking.flightNumber}`
      ); // descripción
      addField('amount', booking.totalPrice.toFixed(2)); // monto
      addField('currency_code', 'EUR'); // moneda

      // 4. URLs a donde PayPal redirige después de pagar o cancelar
      const baseUrl = window.location.origin; // ej: http://localhost:5173

      addField('return', `${baseUrl}/payment-success`);

      addField(
        "cancel_return",
        `${baseUrl}/payment-cancel?paymentId=ERR-${Date.now()}`
      );;

      // 5. Campo opcional para que tú sepas qué reserva era (no se usa en este demo)
      addField('custom', bookingId);

      // 6. Añadir el formulario al DOM y enviarlo
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error al redirigir a PayPal:', error);
      setPaymentFailed(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-sky-600">Procesar Pago</h2>
        <p className="text-gray-600">Completa los datos de tu tarjeta para confirmar tu reserva</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-500" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setFormData({ ...formData, cardNumber: value });
                    }}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    placeholder="JUAN PEREZ"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setFormData({ ...formData, expiryDate: value });
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <div className="bg-sky-50 p-4 rounded-lg flex items-start gap-3">
                  <Lock className="w-5 h-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-sky-900">Pago Seguro</p>
                    <p className="text-xs text-sky-700">
                      Tus datos están protegidos con cifrado SSL de 256 bits
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isProcessing || sendingEmail}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Procesando pago...' : sendingEmail ? 'Enviando confirmación...' : `Pagar €${booking.totalPrice}`}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Al hacer clic en "Pagar", aceptas nuestros términos y condiciones
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Número de Reserva</p>
                <p className="text-gray-800">{booking.bookingNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Vuelo</p>
                <p className="text-gray-800">{booking.flightNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Ruta</p>
                <p className="text-gray-800">{booking.origin}</p>
                <p className="text-gray-800">→ {booking.destination}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="text-gray-800">{booking.departureDate}</p>
                <p className="text-gray-800">{booking.departureTime}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Pasajero</p>
                <p className="text-gray-800">{booking.passengerName}</p>
                <p className="text-sm text-gray-600">Asiento: {booking.seat}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vuelo:</span>
                  <span className="text-gray-800">€{booking.flightPrice}</span>
                </div>
                {booking.luggagePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipaje:</span>
                    <span className="text-gray-800">€{booking.luggagePrice}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Total:</span>
                <span className="text-2xl text-sky-600">€{booking.totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}