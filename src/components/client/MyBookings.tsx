import { useState } from 'react';
import { Ticket, Plane, Calendar, CreditCard, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type Booking = {
  id: string;
  bookingNumber: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  passengerName: string;
  seat: string;
  luggage: string;
  price: number;
};

type MyBookingsProps = {
  userId: string;
};

export default function MyBookings({ userId }: MyBookingsProps) {
  const [bookings] = useState<Booking[]>([
    {
      id: '2',
      bookingNumber: 'BK-123457',
      flightNumber: 'SL202',
      origin: 'Barcelona (BCN)',
      destination: 'París (CDG)',
      departureDate: '2024-02-20',
      departureTime: '14:30',
      passengerName: 'Juan Pérez',
      seat: '15C',
      luggage: 'Equipaje Facturado',
      price: 104.99,
    },
    {
      id: '3',
      bookingNumber: 'BK-123458',
      flightNumber: 'SL303',
      origin: 'Madrid (MAD)',
      destination: 'Londres (LHR)',
      departureDate: '2024-03-05',
      departureTime: '10:00',
      passengerName: 'Juan Pérez',
      seat: '8B',
      luggage: 'Equipaje Facturado',
      price: 114.99,
    },
    {
      id: '4',
      bookingNumber: 'BK-123459',
      flightNumber: 'SL404',
      origin: 'Madrid (MAD)',
      destination: 'Roma (FCO)',
      departureDate: '2024-01-15',
      departureTime: '16:00',
      passengerName: 'Juan Pérez',
      seat: '10C',
      luggage: 'Equipaje de Mano',
      price: 69.99,
    },
  ]);

  const upcomingBookings = bookings;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Mis Reservas</h2>
        <p className="text-gray-600">Administra tus reservas y pagos</p>
      </div>

      <div>
        <div className="grid gap-4">
          {upcomingBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
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
                          <p className="text-gray-800">{booking.bookingNumber}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Pagada</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Vuelo</p>
                            <p className="text-gray-800">{booking.flightNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Ruta</p>
                            <p className="text-gray-800">{booking.origin} → {booking.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Fecha y Hora</p>
                            <p className="text-gray-800">
                              {new Date(booking.departureDate).toLocaleDateString('es-ES')} - {booking.departureTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-sky-500" />
                          <div>
                            <p className="text-sm text-gray-500">Asiento / Equipaje</p>
                            <p className="text-gray-800">{booking.seat} / {booking.luggage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end md:border-l md:pl-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Pagado</p>
                      <p className="text-2xl text-green-600">€{booking.price}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      {bookings.length === 0 && (
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
