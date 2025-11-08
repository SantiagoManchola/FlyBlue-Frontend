import { useState } from 'react';
import { Plus, Plane, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  onViewDetail?: (flightId: string) => void;
};

// Mock cities data
const cities = [
  { code: 'MAD', name: 'Madrid' },
  { code: 'BCN', name: 'Barcelona' },
  { code: 'CDG', name: 'París' },
  { code: 'LHR', name: 'Londres' },
  { code: 'FCO', name: 'Roma' },
];

export default function Flights({ onViewDetail }: FlightsProps = {}) {
  const [flights, setFlights] = useState<Flight[]>([
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
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    flightCode: '',
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const originCity = cities.find(c => c.code === formData.origin)?.name || '';
    const destinationCity = cities.find(c => c.code === formData.destination)?.name || '';
    
    const newFlight: Flight = {
      id: Date.now().toString(),
      flightCode: formData.flightCode,
      origin: formData.origin,
      originCity,
      destination: formData.destination,
      destinationCity,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: parseFloat(formData.price),
    };
    setFlights([...flights, newFlight]);
    setFormData({
      flightCode: '',
      origin: '',
      destination: '',
      departureDate: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800">Gestión de Vuelos</h2>
          <p className="text-gray-600 text-sm">Administra los vuelos disponibles - 100 asientos por vuelo</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600 rounded-4xl">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Vuelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Vuelo</DialogTitle>
              <DialogDescription>Completa los datos del vuelo (100 asientos por defecto)</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flightCode">Código de Vuelo</Label>
                <Input
                  id="flightCode"
                  value={formData.flightCode}
                  onChange={(e) => setFormData({ ...formData, flightCode: e.target.value.toUpperCase() })}
                  placeholder="FB101"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen</Label>
                  <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name} ({city.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name} ({city.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Fecha</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Hora Salida</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Hora Llegada</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="49.99"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                Agregar Vuelo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {flights.map((flight) => (
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
                      <span className="text-xs text-gray-500">100 asientos</span>
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
                    <p className="text-xs text-gray-500 mb-1">Precio</p>
                    <p className="text-3xl text-sky-500">€{flight.price}</p>
                  </div>
                  {onViewDetail && (
                    <Button
                      className="bg-sky-500 hover:bg-sky-600 w-full min-w-[180px] rounded-4xl"
                      onClick={() => onViewDetail(flight.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
