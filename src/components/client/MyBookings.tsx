import { useState, useEffect } from 'react';
import { Ticket, Plane, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { obtenerReservas } from '../../api/client/reservas.api';
import type { ReservaResponse } from '../../api/types';



type MyBookingsProps = {
  userId: number;
};

function formatCurrencyCOP(value: number) {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function MyBookings({ userId }: MyBookingsProps) {
  const [bookings, setBookings] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await obtenerReservas(userId);
        setBookings(data);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarReservas();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sky-600">Mis Reservas</h2>
          <p className="text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Mis Reservas</h2>
        <p className="text-gray-600">Administra tus reservas y pagos</p>
      </div>

      <div>
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id_reserva} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <Ticket className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Reserva</p>
                          <p className="text-gray-800">#{booking.id_reserva}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Confirmada</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Vuelo</p>
                            <p className="text-gray-800">{booking.vuelo}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Fecha de Salida</p>
                            <p className="text-gray-800">
                              {new Date(booking.fecha_salida).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end md:border-l md:pl-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl text-green-600">${formatCurrencyCOP(booking.total)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      {!loading && bookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No tienes reservas</h3>
            <p className="text-gray-600">
              Explora nuestros vuelos y haz tu primera reserva
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
