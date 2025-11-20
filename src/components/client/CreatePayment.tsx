// src/components/client/CreatePayment.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { obtenerVueloPorId } from '../../api/admin/vuelos.api';
import { obtenerEquipajes } from '../../api/admin/equipajes.api';
import { toast } from 'sonner';
import type { VueloResponse, EquipajeResponse } from '../../api/types';
import { obtenerTRM } from '../../api/client/trm.api'; // 👈 tu API de TRM

const PAYPAL_BUSINESS_EMAIL = 'tesoreria@flyblue.com';
const PAYPAL_SANDBOX_URL = 'https://www.sandbox.paypal.com';

// 👉 Helper para formatear COP con puntos de miles
function formatCurrencyCOP(value: number) {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

type CreatePaymentProps = {
  bookingId: string;
};

export default function CreatePayment({ bookingId }: CreatePaymentProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [vueloData, setVueloData] = useState<VueloResponse | null>(null);
  const [equipajeData, setEquipajeData] = useState<EquipajeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [trm, setTrm] = useState<number | null>(null); // 💱 TRM dinámica
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Obtener datos de la reserva y la TRM al cargar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = sessionStorage.getItem('bookingData');
        if (data) {
          const parsedData = JSON.parse(data);
          
          // ✅ Generar bookingNumber una sola vez y guardarlo
          if (!parsedData.bookingNumber) {
            parsedData.bookingNumber = `BK-${Date.now()}`;
            sessionStorage.setItem('bookingData', JSON.stringify(parsedData));
          }
          
          setBookingData(parsedData);

          // ✅ Obtener datos reales del vuelo
          const vuelo = await obtenerVueloPorId(parsedData.flightId);
          setVueloData(vuelo);

          // ✅ Obtener datos del equipaje
          const equipajes = await obtenerEquipajes();
          const equipaje = equipajes.find(e => e.id_equipaje === parsedData.selectedLuggage);
          setEquipajeData(equipaje || null);
        } else {
          navigate('/client/flights');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        navigate('/client/flights');
      } finally {
        setLoading(false);
      }
    };

    const cargarTRM = async () => {
      try {
        const tasa = await obtenerTRM(); // 👈 tu función que llama a la API de TRM
        setTrm(tasa);
      } catch (e) {
        console.error('❌ Error obteniendo TRM:', e);
        // Fallback si tu API falla
        setTrm(4500);
      }
    };

    cargarDatos();
    cargarTRM();
  }, [navigate]);

  // Construir datos del booking con información real
  const booking = bookingData && vueloData ? {
    bookingNumber: bookingData.bookingNumber, // ✅ Ya está guardado, no regenerar
    flightNumber: vueloData.codigo || 'N/A',
    origin: vueloData.ciudad_salida || 'N/A',
    destination: vueloData.ciudad_llegada || 'N/A',
    departureDate: new Date(vueloData.fecha_salida).toLocaleDateString('es-ES', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    departureTime: new Date(vueloData.fecha_salida).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    passengerName: bookingData.userName || 'Cliente',
    seat: bookingData.selectedSeat || 'N/A',
    flightPrice: vueloData.precio_base || 0,        // en COP
    luggagePrice: equipajeData?.precio || 0,        // en COP
    totalPrice: bookingData.totalPrice || 0,        // en COP
  } : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!booking || !bookingData) {
      toast.error('Información de reserva incompleta');
      return;
    }

    if (!trm) {
      toast.error('No se pudo obtener la TRM actual');
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Guardar datos temporales (solo referencia)
      sessionStorage.setItem('paymentData', JSON.stringify({
        cardName: formData.cardName,
        amountCOP: booking.totalPrice,
        trm,
        amountEUR: booking.totalPrice / trm,
        timestamp: new Date().toISOString(),
      }));

      // 💱 Convertir COP → EUR para PayPal
      const amountInEur = booking.totalPrice / trm;

      // Enviar a PayPal sin crear la reserva aún
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', PAYPAL_SANDBOX_URL);

      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        form.appendChild(input);
      };

      addField('cmd', '_xclick');
      addField('business', PAYPAL_BUSINESS_EMAIL);
      addField(
        'item_name',
        `Reserva Vuelo - ${booking.flightNumber}`
      );

      // 🧾 Monto que recibe PayPal en EUR (dos decimales)
      addField('amount', amountInEur.toFixed(2));
      addField('currency_code', 'EUR');

      const baseUrl = window.location.origin;
      addField('return', `${baseUrl}/payment-success`);
      addField('cancel_return', `${baseUrl}/payment-cancel`);
      addField('custom', bookingData.flightId.toString());

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Error al procesar el pago.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto mb-3" />
          <p className="text-gray-600">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Error al cargar la información de pago.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-sky-600">Procesar Pago</h2>
        <p className="text-gray-600">
          Completa los datos de tu tarjeta para confirmar tu reserva
        </p>
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
                      const value = e.target.value
                        .replace(/\s/g, '')
                        .replace(/(\d{4})/g, '$1 ')
                        .trim();
                      setFormData({ ...formData, cardNumber: value });
                    }}
                    maxLength={19}
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    placeholder="JUAN PEREZ"
                    value={formData.cardName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardName: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    disabled={isProcessing}
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
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cvv: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      maxLength={3}
                      required
                      disabled={isProcessing}
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
                    {trm && (
                      <p className="text-xs text-sky-700 mt-1">
                        TRM usada: 1 EUR ≈ COP {formatCurrencyCOP(trm)}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessing
                    ? 'Procesando pago...'
                    : `Pagar COP ${formatCurrencyCOP(booking.totalPrice)}`}
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
                  <span className="text-gray-800">
                    COP {formatCurrencyCOP(booking.flightPrice)}
                  </span>
                </div>
                {booking.luggagePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipaje:</span>
                    <span className="text-gray-800">
                      COP {formatCurrencyCOP(booking.luggagePrice)}
                    </span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Total:</span>
                <span className="text-2xl text-sky-600">
                  COP {formatCurrencyCOP(booking.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
