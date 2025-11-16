import { useState } from 'react';
import { CreditCard, Lock, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { sendPaymentConfirmationEmail } from '../../api/client/emailClient';

type CreatePaymentProps = {
  bookingId: string;
};

export default function CreatePayment({ bookingId }: CreatePaymentProps) {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    // Simulate payment processing with sandbox behavior
    // Card ending in "0000" will fail, others succeed
    setTimeout(async () => {
      const lastFourDigits = formData.cardNumber.replace(/\s/g, '').slice(-4);
      
      if (lastFourDigits === '0000') {
        setPaymentFailed(true);
        setIsProcessing(false);
      } else {
        // Pago exitoso: enviar email de confirmación
        try {
          const userEmail = localStorage.getItem('userEmail') || 'cliente@ejemplo.com';
          await sendPaymentConfirmationEmail({
            to: userEmail,
            nombre: booking.passengerName,
            vuelo: booking.flightNumber,
            fecha: booking.departureDate,
            total: booking.totalPrice,
          });
          console.log('Email de confirmación enviado');
        } catch (emailError) {
          console.warn('No se pudo enviar email, pero el pago se confirmó:', emailError);
        }
        
        setPaymentComplete(true);
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleRetryPayment = () => {
    setPaymentFailed(false);
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    });
  };

  if (paymentFailed) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200">
          <CardContent className="p-12 text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-red-600 mb-2">Pago Rechazado</h2>
            <p className="text-gray-600 mb-6">
              Tu pago no pudo ser procesado. La reserva ha sido cancelada.
            </p>
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Código de Error</p>
              <p className="text-2xl text-red-600">ERR-{Date.now().toString().slice(-8)}</p>
            </div>
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                La tarjeta ha sido rechazada. Por favor, verifica los datos o intenta con otra tarjeta.
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
            <Button 
              onClick={handleRetryPayment}
              className="w-full bg-sky-500 hover:bg-sky-600"
            >
              Intentar Nuevamente
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Sandbox: Usa una tarjeta que NO termine en 0000 para simular un pago exitoso
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200">
          <CardContent className="p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-green-600 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente. Tu vuelo está confirmado.
            </p>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Número de Transacción</p>
              <p className="text-2xl text-green-600">TRX-{Date.now().toString().slice(-8)}</p>
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
              Hemos enviado tu tarjeta de embarque por correo electrónico.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

                <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar €{booking.totalPrice}
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
