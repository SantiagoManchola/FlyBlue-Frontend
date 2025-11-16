import { useState } from 'react';
import { Plane, X, MapPin, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import bgHero from '/images/bg-client.png';

type Flight = {
  id: string;
  flightCode: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

type FlightsProps = {
  onBookFlight: (flightId: string) => void;
};

// Mock cities data
const cityGroups = [
  {
    country: 'España',
    cities: [
      { code: 'MAD', name: 'Madrid' },
      { code: 'BCN', name: 'Barcelona' },
    ],
  },
  {
    country: 'Francia',
    cities: [{ code: 'CDG', name: 'París' }],
  },
  {
    country: 'Reino Unido',
    cities: [{ code: 'LHR', name: 'Londres' }],
  },
  {
    country: 'Italia',
    cities: [{ code: 'FCO', name: 'Roma' }],
  },
];

export default function Flights({ onBookFlight }: FlightsProps) {
  const [flights] = useState<Flight[]>([
    {
      id: '1',
      flightCode: 'FB101',
      origin: 'MAD',
      originCity: 'Madrid',
      destination: 'BCN',
      destinationCity: 'Barcelona',
      departureDate: '2024-02-15',
      departureTime: '08:00',
      arrivalTime: '09:15',
      price: 49.99,
    },
    {
      id: '2',
      flightCode: 'FB202',
      origin: 'BCN',
      originCity: 'Barcelona',
      destination: 'CDG',
      destinationCity: 'París',
      departureDate: '2024-02-15',
      departureTime: '14:30',
      arrivalTime: '16:45',
      price: 79.99,
    },
    {
      id: '3',
      flightCode: 'FB303',
      origin: 'MAD',
      originCity: 'Madrid',
      destination: 'LHR',
      destinationCity: 'Londres',
      departureDate: '2024-02-16',
      departureTime: '10:00',
      arrivalTime: '11:30',
      price: 89.99,
    },
    {
      id: '4',
      flightCode: 'FB404',
      origin: 'BCN',
      originCity: 'Barcelona',
      destination: 'FCO',
      destinationCity: 'Roma',
      departureDate: '2024-02-16',
      departureTime: '12:00',
      arrivalTime: '14:15',
      price: 69.99,
    },
  ]);

  const [searchOrigin, setSearchOrigin] = useState<string>('all');
  const [searchDestination, setSearchDestination] = useState<string>('all');
  const [searchDate, setSearchDate] = useState('');

  const filteredFlights = flights.filter((flight) => {
    const matchOrigin =
      !searchOrigin || searchOrigin === 'all' || flight.origin === searchOrigin;
    const matchDestination =
      !searchDestination || searchDestination === 'all' || flight.destination === searchDestination;
    const matchDate = !searchDate || flight.departureDate === searchDate;
    return matchOrigin && matchDestination && matchDate;
  });

  const clearFilters = () => {
    setSearchOrigin('all');
    setSearchDestination('all');
    setSearchDate('');
  };

  const hasActiveFilters =
    searchOrigin !== 'all' ||
    searchDestination !== 'all' ||
    !!searchDate;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-300 to-blue-400 p-8 md:p-12"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(125, 211, 252, 0.9), rgba(96, 165, 250, 0.9)), url('https://images.unsplash.com/photo-1654632011689-0d8bb4a50a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYWlycGxhbmUlMjBza3l8ZW58MXx8fHwxNzYyNTQ4OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h2 className="text-white mb-2">Planifica Tu Viaje</h2>
          <p className="text-white/90 mb-8 max-w-xl">
            Descubre destinos increíbles al mejor precio
          </p>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="origin" className="text-gray-700">Desde</Label>
                    {searchOrigin !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSearchOrigin('all')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Limpiar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Select value={searchOrigin} onValueChange={(value) => setSearchOrigin(value)}>
                    <SelectTrigger className="bg-white rounded-full h-11 border border-sky-100 shadow-sm hover:border-sky-400 transition-colors">
                      <SelectValue placeholder="Origen" />
                    </SelectTrigger>

                    <SelectContent className="w-[280px]">
                      <SelectItem value="all" className="font-semibold">
                        Todas las ciudades
                      </SelectItem>

                      <div className="my-1 h-px bg-gray-100" />

                      {cityGroups.map((group) => (
                        <div
                          key={group.country}
                          className="grid grid-cols-[110px,1fr] gap-2 px-1 py-1"
                        >
                          {/* Columna país */}
                          <div className="text-sm font-semibold text-sky-700 bg-sky-50 rounded-md px-2 py-1 flex items-center">
                            {group.country}
                          </div>

                          {/* Columna ciudades */}
                          <div className="flex flex-col gap-1">
                            {group.cities.map((city) => (
                              <SelectItem
                                key={city.code}
                                value={city.code}
                                className="flex items-center justify-between"
                              >
                                <span>{city.name}</span>
                                <span className="text-xs text-gray-400">{city.code}</span>
                              </SelectItem>
                            ))}
                          </div>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="destination" className="text-gray-700">Hacia</Label>
                    {searchDestination !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSearchDestination('all')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Limpiar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Select value={searchDestination} onValueChange={(value) => setSearchDestination(value)}>
                    <SelectTrigger className="bg-white rounded-full h-11 border border-sky-100 shadow-sm hover:border-sky-400 transition-colors">
                      <SelectValue placeholder="Destino" />
                    </SelectTrigger>

                    <SelectContent className="w-[280px]">
                      <SelectItem value="all" className="font-semibold">
                        Todas las ciudades
                      </SelectItem>

                      <div className="my-1 h-px bg-gray-100" />

                      {cityGroups.map((group) => (
                        <div
                          key={group.country}
                          className="grid grid-cols-[110px,1fr] gap-2 px-1 py-1"
                        >
                          <div className="text-sm font-semibold text-sky-700 bg-sky-50 rounded-md px-2 py-1 flex items-center">
                            {group.country}
                          </div>
                          <div className="flex flex-col gap-1">
                            {group.cities.map((city) => (
                              <SelectItem
                                key={city.code}
                                value={city.code}
                                className="flex items-center justify-between"
                              >
                                <span>{city.name}</span>
                                <span className="text-xs text-gray-400">{city.code}</span>
                              </SelectItem>
                            ))}
                          </div>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="date" className="text-gray-700">Fecha</Label>
                    {searchDate && (
                      <button
                        onClick={() => setSearchDate('')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Limpiar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    id="date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-gray-800 mb-4">
          {filteredFlights.length} vuelos disponibles
        </h3>
        <div className="grid gap-4">
          {filteredFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-all bg-white border border-gray-100">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500">{flight.flightCode}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(flight.departureDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl text-gray-900 mb-1">{flight.departureTime}</p>
                        <p className="text-gray-600 mb-0.5">{flight.origin}</p>
                        <p className="text-xs text-gray-400">{flight.originCity}</p>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex items-center w-full">
                          <div className="h-px bg-gray-200 flex-1"></div>
                          <div className="px-3">
                            <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                          </div>
                          <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        <span className="text-xs text-gray-500">Directo</span>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl text-gray-900 mb-1">{flight.arrivalTime}</p>
                        <p className="text-gray-600 mb-0.5">{flight.destination}</p>
                        <p className="text-xs text-gray-400">{flight.destinationCity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 md:pl-6 md:border-l">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Desde</p>
                      <p className="text-3xl text-sky-500">€{flight.price}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full min-w-[200px]">
                      <Button
                        className="bg-sky-500 hover:bg-sky-600 w-full"
                        onClick={() => onBookFlight(flight.id)}
                      >
                        Reservar Ahora
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
