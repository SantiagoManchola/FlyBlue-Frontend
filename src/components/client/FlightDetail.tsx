import { Plane, MapPin, Clock, DollarSign, Users, Calendar, Briefcase, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

type FlightDetailProps = {
  flightId: string;
};

// 👉 Helper para formatear COP con puntos de miles
function formatCurrencyCOP(value: number) {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function FlightDetail({ flightId }: FlightDetailProps) {
  // Mock data - in real app this would come from API
  const flight = {
    id: flightId,
    flightNumber: 'SL101',
    origin: { code: 'MAD', name: 'Madrid', country: 'España', airport: 'Adolfo Suárez Madrid-Barajas' },
    destination: { code: 'BCN', name: 'Barcelona', country: 'España', airport: 'Barcelona-El Prat' },
    departureDate: '2024-02-15',
    departureTime: '08:00',
    arrivalTime: '09:15',
    duration: '1h 15m',
    price: 145000, // 👈 ahora en COP
    aircraft: 'Airbus A320',
    status: 'scheduled',
    totalSeats: 180,
    availableSeats: 120,
    services: [
      'WiFi a bordo (COP 5.000)',
      'Entretenimiento en pantalla',
      'Servicio de bebidas',
      'Snacks disponibles para compra',
    ],
    baggage: [
      { type: 'Equipaje de Mano', included: true, price: 0 },
      { type: 'Equipaje Facturado', included: false, price: 25000 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sky-600">Detalle del Vuelo {flight.flightNumber}</h2>
          <p className="text-gray-600">Información completa del vuelo</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">A tiempo</Badge>
      </div>

      {/* Main Flight Info */}
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center flex-1">
              {/* city -> name para que no truene con el mock */}
              <p className="text-sm text-gray-600 mb-1">{flight.origin.name}</p>
              <p className="text-4xl text-sky-600 mb-1">{flight.departureTime}</p>
              <p className="text-gray-800">{flight.origin.code}</p>
              <p className="text-xs text-gray-500 mt-2">{flight.origin.airport}</p>
            </div>

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px bg-sky-300 flex-1 max-w-[100px]"></div>
                <Plane className="w-6 h-6 text-sky-500 rotate-90" />
                <div className="h-px bg-sky-300 flex-1 max-w-[100px]"></div>
              </div>
              <p className="text-sm text-gray-600">{flight.duration}</p>
              <p className="text-xs text-gray-500">Vuelo directo</p>
            </div>

            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-1">{flight.destination.name}</p>
              <p className="text-4xl text-sky-600 mb-1">{flight.arrivalTime}</p>
              <p className="text-gray-800">{flight.destination.code}</p>
              <p className="text-xs text-gray-500 mt-2">{flight.destination.airport}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span className="text-gray-700">
                {new Date(flight.departureDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-600" />
              <span className="text-gray-700">{flight.aircraft}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span className="text-gray-700">{flight.availableSeats} asientos disponibles</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Origin Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              Aeropuerto de Origen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="text-gray-800">{flight.origin.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Aeropuerto</p>
              <p className="text-gray-800">{flight.origin.airport}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Código IATA</p>
              <p className="text-gray-800">{flight.origin.code}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">País</p>
              <p className="text-gray-800">{flight.origin.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Destination Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              Aeropuerto de Destino
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Ciudad</p>
              <p className="text-gray-800">{flight.destination.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Aeropuerto</p>
              <p className="text-gray-800">{flight.destination.airport}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Código IATA</p>
              <p className="text-gray-800">{flight.destination.code}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">País</p>
              <p className="text-gray-800">{flight.destination.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-sky-500" />
              Servicios a Bordo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {flight.services.map((service, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2"></div>
                  <span className="text-gray-700 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Baggage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-sky-500" />
              Equipaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flight.baggage.map((bag, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800">{bag.type}</p>
                    <p className="text-xs text-gray-500">
                      {bag.included ? 'Incluido en el precio' : 'No incluido'}
                    </p>
                  </div>
                  <Badge className={bag.included ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {bag.price === 0
                      ? 'Gratis'
                      : `COP ${formatCurrencyCOP(bag.price)}`}
                  </Badge>
                </div>
                {index < flight.baggage.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Price and Booking */}
      <Card className="bg-sky-50 border-sky-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-sky-600" />
              <div>
                <p className="text-sm text-gray-600">Precio desde</p>
                <p className="text-3xl text-sky-600">
                  COP {formatCurrencyCOP(flight.price)}
                </p>
                <p className="text-xs text-gray-500">por persona (solo ida)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                Ver Asientos
              </Button>
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600">
                <Calendar className="w-4 h-4 mr-2" />
                Reservar Ahora
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-500" />
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Llegada al aeropuerto recomendada 2 horas antes de la salida</li>
            <li>• Documento de identidad o pasaporte válido requerido</li>
            <li>• Check-in online disponible 24 horas antes del vuelo</li>
            <li>• Política de cambios y cancelaciones según tarifa seleccionada</li>
            <li>• Restricciones de equipaje según normativas de seguridad</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
