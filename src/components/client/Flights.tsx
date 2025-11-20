import { useState, useEffect } from 'react';
import { Plane, Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { clientService } from '../../services/clientService';
import type { CiudadResponse } from '../../api/types';

function formatCurrencyCOP(value: number) {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}


type FlightsProps = {
  onBookFlight: (flightId: number) => void;
};

export default function Flights({ onBookFlight }: FlightsProps) {
  const [flights, setFlights] = useState<any[]>([]);
  const [allFlights, setAllFlights] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<CiudadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchOrigin, setSearchOrigin] = useState<string>('');
  const [searchDestination, setSearchDestination] = useState<string>('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    loadCities();
    loadAllFlights();
  }, []);

  const loadCities = async () => {
    try {
      const data = await clientService.obtenerCiudades();
      setCiudades(data);
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
    }
  };

  const loadAllFlights = async () => {
    try {
      console.log('🔄 Client Flights - Cargando todos los vuelos...');
      setLoading(true);
      const data = await clientService.obtenerTodosLosVuelos();
      console.log('✅ Client Flights - Vuelos cargados:', data.length);
      setAllFlights(data);
      setFlights(data);
    } catch (error) {
      console.error('❌ Client Flights - Error al cargar vuelos:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarVuelosHandler = async () => {
    // ✅ Validar que al menos UN filtro esté seleccionado
    if (!searchOrigin && !searchDestination && !searchDate) {
      return;
    }

    try {
      setIsSearching(true);
      console.log('🔍 Buscando vuelos con:', {
        origen: searchOrigin ? parseInt(searchOrigin) : undefined,
        destino: searchDestination ? parseInt(searchDestination) : undefined,
        fecha: searchDate || undefined
      });

      // ✅ Construir filtros solo con los campos que tienen valor
      const filtros: { origen?: number; destino?: number; fecha?: string } = {};
      if (searchOrigin) filtros.origen = parseInt(searchOrigin);
      if (searchDestination) filtros.destino = parseInt(searchDestination);
      if (searchDate) filtros.fecha = searchDate;

      const data = await clientService.buscarVuelosConFiltros(filtros);

      console.log(`✅ Se encontraron ${data.length} vuelos`);
      setFlights(data);
    } catch (error) {
      console.error('❌ Error al buscar vuelos:', error);
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    console.log('🔄 Limpiando filtros...');
    setSearchOrigin('');
    setSearchDestination('');
    setSearchDate('');
    setFlights(allFlights);
  };

  const hasActiveFilters = !!searchOrigin || !!searchDestination || !!searchDate;
  const canSearch = !!searchOrigin || !!searchDestination || !!searchDate;

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
                  <Label htmlFor="origin" className="text-gray-700">Desde (Opcional)</Label>
                  <Select value={searchOrigin} onValueChange={setSearchOrigin} disabled={isSearching}>
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
                  <Label htmlFor="destination" className="text-gray-700">Hacia (Opcional)</Label>
                  <Select value={searchDestination} onValueChange={setSearchDestination} disabled={isSearching}>
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
                  <Label htmlFor="date" className="text-gray-700">Fecha (Opcional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    disabled={isSearching}
                    className="flex h-11 w-full rounded-full border border-sky-100 bg-white px-3 py-2 text-sm shadow-sm hover:border-sky-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    onClick={buscarVuelosHandler}
                    disabled={!canSearch || isSearching || loading}
                    className="bg-sky-500 hover:bg-sky-600 flex-1"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      disabled={isSearching}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resultados */}
      {(loading || isSearching) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
          <p className="text-gray-600">{isSearching ? 'Buscando vuelos...' : 'Cargando vuelos...'}</p>
        </div>
      ) : flights.length > 0 ? (
        <div>
          <h3 className="text-gray-800 mb-4">
            {flights.length} vuelos disponibles
          </h3>
          <div className="grid gap-4">
            {flights.map((flight) => {
              const salidaDate = new Date(flight.fecha_salida);
              const llegadaDate = new Date(flight.fecha_llegada);
              const codigoParts = flight.codigo?.split('-') || [];
              const ciudadOrigen = flight.ciudad_salida || codigoParts[0] || 'N/A';
              const ciudadDestino = flight.ciudad_llegada || codigoParts[1] || 'N/A';

              return (
                <Card key={flight.id_vuelo || flight.id} className="hover:shadow-md transition-all bg-white border border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs text-gray-500">{flight.codigo}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {salidaDate.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-2xl text-gray-900 mb-1">
                              {salidaDate.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-gray-600 mb-0.5">{ciudadOrigen}</p>
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
                              {llegadaDate.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-gray-600 mb-0.5">{ciudadDestino}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4 md:pl-6 md:border-l">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Desde</p>
                          <p className="text-3xl text-sky-500">
                            COP {formatCurrencyCOP(flight.precio_base)}
                          </p>
                        </div>

                        <Button
                          className="bg-sky-500 hover:bg-sky-600 w-full min-w-[200px] rounded-4xl"
                          onClick={() => onBookFlight(flight.id_vuelo || flight.id)}
                        >
                          Reservar Ahora
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No se encontraron vuelos</p>
          <p className="text-sm mt-2">Intenta con otros criterios de búsqueda</p>
        </div>
      )}
    </div>
  );
}
