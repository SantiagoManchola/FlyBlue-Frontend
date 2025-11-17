import { useState, useEffect } from 'react';
import { Plane, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { obtenerCiudades } from '../../api/admin/ciudades.api';
import { buscarVuelos } from '../../api/admin/vuelos.api';
import type { CiudadResponse, VueloBusquedaResponse } from '../../api/types';



type FlightsProps = {
  onBookFlight: (flightId: number) => void;
};



export default function Flights({ onBookFlight }: FlightsProps) {
  const [flights, setFlights] = useState<VueloBusquedaResponse[]>([]);
  const [ciudades, setCiudades] = useState<CiudadResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchOrigin, setSearchOrigin] = useState<string>('');
  const [searchDestination, setSearchDestination] = useState<string>('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        const data = await obtenerCiudades();
        setCiudades(data);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
      }
    };
    cargarCiudades();
  }, []);

  const buscarVuelosHandler = async () => {
    if (!searchOrigin || !searchDestination || !searchDate) {
      return;
    }
    
    setLoading(true);
    try {
      const data = await buscarVuelos(
        parseInt(searchOrigin),
        parseInt(searchDestination),
        searchDate
      );
      setFlights(data);
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };



  const clearFilters = () => {
    setSearchOrigin('');
    setSearchDestination('');
    setSearchDate('');
    setFlights([]);
  };

  const hasActiveFilters = !!searchOrigin || !!searchDestination || !!searchDate;

  const getCiudadNombre = (id: string) => {
    const ciudad = ciudades.find(c => c.id_ciudad.toString() === id);
    return ciudad ? ciudad.nombre : id;
  };

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
                  <Select value={searchOrigin} onValueChange={setSearchOrigin}>
                    <SelectTrigger className="bg-white rounded-full h-11 border border-sky-100 shadow-sm hover:border-sky-400 transition-colors">
                      <SelectValue placeholder="Seleccionar origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad.id_ciudad} value={ciudad.id_ciudad.toString()}>
                          {ciudad.nombre} ({ciudad.codigo})
                        </SelectItem>
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
                  <Select value={searchDestination} onValueChange={setSearchDestination}>
                    <SelectTrigger className="bg-white rounded-full h-11 border border-sky-100 shadow-sm hover:border-sky-400 transition-colors">
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad.id_ciudad} value={ciudad.id_ciudad.toString()}>
                          {ciudad.nombre} ({ciudad.codigo})
                        </SelectItem>
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
                <div className="flex items-end gap-2">
                  <Button
                    onClick={buscarVuelosHandler}
                    disabled={!searchOrigin || !searchDestination || !searchDate || loading}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    {loading ? 'Buscando...' : 'Buscar Vuelos'}
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {flights.length > 0 && (
        <div>
          <h3 className="text-gray-800 mb-4">
            {flights.length} vuelos disponibles
          </h3>
          <div className="grid gap-4">
            {flights.map((flight) => (
              <Card key={flight.id_vuelo} className="hover:shadow-md transition-all bg-white border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-500">{flight.codigo}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(flight.fecha_salida).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl text-gray-900 mb-1">
                            {new Date(flight.fecha_salida).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-gray-600 mb-0.5">Origen</p>
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
                          <p className="text-2xl text-gray-900 mb-1">
                            {new Date(flight.fecha_llegada).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-gray-600 mb-0.5">Destino</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 md:pl-6 md:border-l">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Desde</p>
                        <p className="text-3xl text-sky-500">€{flight.precio_base}</p>
                      </div>

                      <div className="flex flex-col gap-2 w-full min-w-[200px]">
                        <Button
                          className="bg-sky-500 hover:bg-sky-600 w-full"
                          onClick={() => onBookFlight(flight.id_vuelo)}
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
      )}
    </div>
  );
}
