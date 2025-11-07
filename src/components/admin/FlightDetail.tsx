import { Plane, MapPin, Clock, DollarSign, Users, Calendar, Briefcase, Grid3X3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type FlightDetailProps = {
  flightId: string;
};

export default function FlightDetail({ flightId }: FlightDetailProps) {
  // Mock data - in real app this would come from API
  const flight = {
    id: flightId,
    flightNumber: 'SL101',
    origin: { code: 'MAD', name: 'Madrid', country: 'España' },
    destination: { code: 'BCN', name: 'Barcelona', country: 'España' },
    departureDate: '2024-02-15',
    departureTime: '08:00',
    arrivalTime: '09:15',
    duration: '1h 15m',
    price: 49.99,
    aircraft: 'Airbus A320',
    status: 'scheduled',
    totalSeats: 180,
    availableSeats: 120,
    occupiedSeats: 45,
    reservedSeats: 15,
  };

  const bookings = [
    { id: '1', passenger: 'Juan Pérez', seat: '12A', luggage: 'Equipaje de Mano', status: 'confirmed' },
    { id: '2', passenger: 'María García', seat: '15C', luggage: 'Equipaje Facturado', status: 'confirmed' },
    { id: '3', passenger: 'Carlos López', seat: '8B', luggage: 'Equipaje de Mano', status: 'pending' },
  ];

  // Generate seats: 20 rows, 5 seats per row (A-E) for 100 seats total
  const rows = 20;
  const seatsPerRow = ['A', 'B', 'C', 'D', 'E'];
  const occupiedSeats = ['3A', '3B', '5C', '7D', '10A', '12A', '12E', '15B', '15C', '18C', '8B']; // Mock occupied seats from bookings

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sky-600">Detalle del Vuelo {flight.flightNumber}</h2>
          <p className="text-gray-600">Información completa del vuelo</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">Programado</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-500" />
              Información del Vuelo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Número de Vuelo:</span>
              <span className="text-gray-800">{flight.flightNumber}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aeronave:</span>
              <span className="text-gray-800">{flight.aircraft}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estado:</span>
              <Badge className="bg-blue-100 text-blue-700">Programado</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              Ruta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Origen</p>
              <p className="text-gray-800">
                {flight.origin.name} ({flight.origin.code})
              </p>
              <p className="text-sm text-gray-600">{flight.origin.country}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">Destino</p>
              <p className="text-gray-800">
                {flight.destination.name} ({flight.destination.code})
              </p>
              <p className="text-sm text-gray-600">{flight.destination.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              Horarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fecha:</span>
              <span className="text-gray-800">
                {new Date(flight.departureDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salida:</span>
              <span className="text-gray-800">{flight.departureTime}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Llegada:</span>
              <span className="text-gray-800">{flight.arrivalTime}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duración:</span>
              <span className="text-gray-800">{flight.duration}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-500" />
              Ocupación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Asientos:</span>
              <span className="text-gray-800">{flight.totalSeats}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Disponibles:</span>
              <span className="text-green-600">{flight.availableSeats}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ocupados:</span>
              <span className="text-red-600">{flight.occupiedSeats}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reservados:</span>
              <span className="text-yellow-600">{flight.reservedSeats}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Ocupación:</span>
              <span className="text-sky-600">
                {Math.round(((flight.occupiedSeats + flight.reservedSeats) / flight.totalSeats) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-500" />
            Reservas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-sky-100 p-2 rounded-full">
                    <Users className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">{booking.passenger}</p>
                    <p className="text-sm text-gray-500">Asiento: {booking.seat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{booking.luggage}</p>
                  </div>
                  <Badge
                    className={
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-500" />
            Información de Precio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Precio Base:</span>
            <span className="text-2xl text-sky-600">€{flight.price}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ingresos Estimados:</span>
            <span className="text-gray-800">
              €{((flight.occupiedSeats + flight.reservedSeats) * flight.price).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Seat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-sky-500" />
            Mapa de Asientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
              <span className="text-gray-600">Disponible ({100 - occupiedSeats.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded"></div>
              <span className="text-gray-600">Ocupado ({occupiedSeats.length})</span>
            </div>
          </div>

          {/* Airplane seats layout */}
          <div className="max-w-md mx-auto">
            {/* Cockpit */}
            <div className="mb-4">
              <div className="bg-gradient-to-b from-sky-400 to-sky-300 rounded-t-full h-12 flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Seats */}
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              {Array.from({ length: rows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1;
                return (
                  <div key={rowNumber} className="flex items-center gap-2 justify-center">
                    <span className="text-xs text-gray-500 w-6 text-center">{rowNumber}</span>
                    
                    {/* Left side seats (A, B) */}
                    <div className="flex gap-1">
                      {seatsPerRow.slice(0, 2).map((letter) => {
                        const seatId = `${rowNumber}${letter}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        
                        return (
                          <div
                            key={seatId}
                            className={`w-7 h-7 rounded text-xs flex items-center justify-center ${
                              isOccupied
                                ? 'bg-red-400 text-white'
                                : 'border-2 border-gray-300'
                            }`}
                            title={isOccupied ? `${seatId} - Ocupado` : `${seatId} - Disponible`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="w-4"></div>

                    {/* Right side seats (C, D, E) */}
                    <div className="flex gap-1">
                      {seatsPerRow.slice(2).map((letter) => {
                        const seatId = `${rowNumber}${letter}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        
                        return (
                          <div
                            key={seatId}
                            className={`w-7 h-7 rounded text-xs flex items-center justify-center ${
                              isOccupied
                                ? 'bg-red-400 text-white'
                                : 'border-2 border-gray-300'
                            }`}
                            title={isOccupied ? `${seatId} - Ocupado` : `${seatId} - Disponible`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>

                    <span className="text-xs text-gray-500 w-6 text-center">{rowNumber}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
