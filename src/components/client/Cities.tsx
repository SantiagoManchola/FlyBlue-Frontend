import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

type City = {
  id: string;
  name: string;
  country: string;
  code: string;
  description: string;
  flightsCount: number;
};

export default function Cities() {
  const [cities] = useState<City[]>([
    {
      id: '1',
      name: 'Madrid',
      country: 'España',
      code: 'MAD',
      description: 'Capital de España, centro cultural y económico',
      flightsCount: 24,
    },
    {
      id: '2',
      name: 'Barcelona',
      country: 'España',
      code: 'BCN',
      description: 'Ciudad cosmopolita en la costa mediterránea',
      flightsCount: 18,
    },
    {
      id: '3',
      name: 'París',
      country: 'Francia',
      code: 'CDG',
      description: 'La ciudad de la luz, capital de Francia',
      flightsCount: 15,
    },
    {
      id: '4',
      name: 'Londres',
      country: 'Reino Unido',
      code: 'LHR',
      description: 'Vibrante metrópoli llena de historia y cultura',
      flightsCount: 20,
    },
    {
      id: '5',
      name: 'Roma',
      country: 'Italia',
      code: 'FCO',
      description: 'La ciudad eterna, cuna de la civilización occidental',
      flightsCount: 12,
    },
    {
      id: '6',
      name: 'Berlín',
      country: 'Alemania',
      code: 'BER',
      description: 'Capital alemana, centro de arte y cultura',
      flightsCount: 16,
    },
    {
      id: '7',
      name: 'Ámsterdam',
      country: 'Países Bajos',
      code: 'AMS',
      description: 'Ciudad de canales y cultura diversa',
      flightsCount: 14,
    },
    {
      id: '8',
      name: 'Lisboa',
      country: 'Portugal',
      code: 'LIS',
      description: 'Encantadora capital portuguesa con vistas al Atlántico',
      flightsCount: 10,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Nuestros Destinos</h2>
        <p className="text-gray-600">Explora las ciudades donde volamos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar ciudad, país o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city) => (
          <Card key={city.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 p-3 rounded-lg group-hover:bg-sky-200 transition-colors">
                    <MapPin className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800">{city.name}</h3>
                    <p className="text-sm text-gray-600">{city.country}</p>
                  </div>
                </div>
                <Badge className="bg-sky-100 text-sky-700">{city.code}</Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{city.description}</p>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-gray-500">{city.flightsCount} vuelos disponibles</span>
                <span className="text-sm text-sky-600 group-hover:underline">Ver vuelos →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No se encontraron ciudades</h3>
            <p className="text-gray-600">Intenta con otro término de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
