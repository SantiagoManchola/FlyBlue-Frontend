// src/pages/client/PaymentSuccessPage.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { clientService } from "../../services/clientService";
import { obtenerVueloPorId } from "../../api/admin/vuelos.api";
import { obtenerEquipajes } from "../../api/admin/equipajes.api";
import { toast } from "sonner";
import type { VueloResponse, EquipajeResponse } from "../../api/types";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reserva, setReserva] = useState<any>(null);
  const [vueloData, setVueloData] = useState<VueloResponse | null>(null);
  const [equipajeData, setEquipajeData] = useState<EquipajeResponse | null>(null);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const crearReservaPostPago = async () => {
      try {
        console.log('🔄 Recuperando datos de sessionStorage...');
        
        // Obtener datos guardados
        const bookingDataStr = sessionStorage.getItem('bookingData');
        const payerID = searchParams.get('PayerID');

        if (!bookingDataStr || !payerID) {
          throw new Error('Datos incompletos. PayerID o bookingData no encontrados');
        }

        const bookingData = JSON.parse(bookingDataStr);

        console.log('✅ Datos recuperados:', { bookingData, payerID });

        // ✅ Guardar info de la reserva ANTES de limpiar sessionStorage
        setBookingInfo({
          selectedSeat: bookingData.selectedSeat, // ✅ Guardar código para mostrar (2B)
          selectedLuggage: bookingData.selectedLuggage,
          totalPrice: bookingData.totalPrice,
        });

        // ✅ PASO 1: Crear reserva DESPUÉS de confirmar pago con PayerID
        console.log('📦 Creando reserva con datos:', {
          id_usuario: bookingData.userId,
          id_vuelo: bookingData.flightId,
          id_asiento: bookingData.seat, // ✅ Cambiar a bookingData.seat (es el ID numérico)
          id_equipaje: bookingData.selectedLuggage,
        });

        const reservaResponse = await clientService.crearReserva({
          id_usuario: bookingData.userId,
          id_vuelo: bookingData.flightId,
          id_asiento: bookingData.seat, // ✅ Usar el ID del asiento (número)
          id_equipaje: bookingData.selectedLuggage,
          total: bookingData.totalPrice,
        });

        console.log('✅ Reserva creada exitosamente:', reservaResponse);
        setReserva(reservaResponse);
        toast.success('¡Reserva confirmada exitosamente!');

        // ✅ PASO 2: Obtener datos del vuelo
        const vuelo = await obtenerVueloPorId(bookingData.flightId);
        console.log('✅ Vuelo obtenido:', vuelo);
        setVueloData(vuelo);

        // ✅ PASO 3: Obtener datos del equipaje
        const equipajes = await obtenerEquipajes();
        const equipaje = equipajes.find(e => e.id_equipaje === bookingData.selectedLuggage);
        console.log('✅ Equipaje obtenido:', equipaje);
        setEquipajeData(equipaje || null);

        // ✅ PASO 4: Limpiar sessionStorage DESPUÉS de guardar los datos
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('paymentData');
      } catch (err: any) {
        console.error('❌ Error al crear reserva:', err);
        setError(err.message || 'Error al procesar tu reserva');
        toast.error('Error al crear la reserva');
      } finally {
        setLoading(false);
      }
    };

    crearReservaPostPago();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Confirmando tu reserva...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-red-200">
          <CardContent className="p-12 text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-red-600 mb-2">Error en la Reserva</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/client/flights')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded"
            >
              Volver a Vuelos
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formatear fechas
  const fechaSalida = vueloData ? new Date(vueloData.fecha_salida) : null;
  const fechaLlegada = vueloData ? new Date(vueloData.fecha_llegada) : null;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="border-green-200">
        <CardContent className="p-12">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl text-green-600 mb-2">¡Pago y Reserva Confirmados!</h2>
            <p className="text-gray-600">
              Tu pago ha sido procesado correctamente en PayPal. Tu vuelo está confirmado.
            </p>
          </div>

          {/* Número de Reserva */}
          <div className="bg-green-50 p-6 rounded-lg mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Número de Reserva</p>
            <p className="text-3xl text-green-600 font-bold">
              RES-{reserva?.id_reserva}
            </p>
          </div>

          {/* Detalles de la Reserva */}
          <div className="space-y-2 text-sm text-left bg-gray-50 p-6 rounded-lg mb-6">
            {/* Vuelo */}
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Vuelo:</span>
              <span className="text-gray-800">{vueloData?.codigo || 'N/A'}</span>
            </div>
            <Separator />

            {/* Ruta */}
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Ruta:</span>
              <span className="text-gray-800">
                {vueloData?.ciudad_salida} → {vueloData?.ciudad_llegada}
              </span>
            </div>
            <Separator />

            {/* Fecha y Hora */}
            {fechaSalida && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Salida:</span>
                  <span className="text-gray-800">
                    {fechaSalida.toLocaleDateString('es-ES', { 
                      weekday: 'short',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })} a las {fechaSalida.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <Separator />
              </>
            )}

            {fechaLlegada && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Llegada:</span>
                  <span className="text-gray-800">
                    {fechaLlegada.toLocaleDateString('es-ES', { 
                      weekday: 'short',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })} a las {fechaLlegada.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <Separator />
              </>
            )}

            {/* Asiento */}
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Asiento:</span>
              <span className="text-gray-800">{bookingInfo?.selectedSeat || 'N/A'}</span>
            </div>
            <Separator />

            {/* Equipaje */}
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Equipaje:</span>
              <span className="text-gray-800">
                {equipajeData?.tipo || (bookingInfo?.selectedLuggage === 0 ? 'Sin equipaje adicional' : 'N/A')}
              </span>
            </div>
            <Separator />

            {/* Precio */}
            <div className="flex justify-between pt-2">
              <span className="text-gray-800 font-bold">Total Pagado:</span>
              <span className="text-green-600 font-bold">€{bookingInfo?.totalPrice || '0'}</span>
            </div>
          </div>

          {/* Mensaje */}
          <p className="text-sm text-gray-600 text-center mb-6">
            Hemos enviado tu tarjeta de embarque y los detalles de tu reserva a tu correo electrónico.
          </p>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/client/my-bookings')}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded font-medium transition-colors"
            >
              Ver mis Reservas
            </button>
            <button
              onClick={() => navigate('/client/flights')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded font-medium transition-colors"
            >
              Buscar otro Vuelo
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
