import { useState, useEffect } from 'react';
import { Plane, MapPin, Clock, DollarSign, Users, Calendar, Briefcase, Grid3X3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { adminService } from '../../services/adminService';
import { obtenerAsientosVuelo } from '../../api/admin/vuelos.api';
import { VueloResponse, Asiento } from '../../api/types';
import { toast } from 'sonner';

type FlightDetailProps = {
  flightId: string;
};

export default function FlightDetail({ flightId }: FlightDetailProps) {
  const [flight, setFlight] = useState<VueloResponse | null>(null);
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlightData();
  }, [flightId]);

  const loadFlightData = async () => {
    try {
      console.log('🔄 FlightDetail - Cargando datos para vuelo ID:', flightId);
      setIsLoading(true);
      
      // Intentar cargar datos del vuelo
      const flightData = await adminService.obtenerVueloPorId(parseInt(flightId));
      console.log('✅ FlightDetail - Datos del vuelo:', flightData);
      setFlight(flightData);
      
      // Intentar cargar asientos (puede fallar si no hay asientos creados)
      try {
        const asientosData = await obtenerAsientosVuelo(parseInt(flightId));
        console.log('✅ FlightDetail - Asientos:', asientosData);
        setAsientos(asientosData.asientos || []);
      } catch (asientosError) {
        console.warn('⚠️ No se pudieron cargar los asientos:', asientosError);
        setAsientos([]);
      }
    } catch (error: any) {
      console.error('❌ FlightDetail - Error al cargar datos del vuelo:', error);
      console.error('❌ FlightDetail - Status:', error?.response?.status);
      console.error('❌ FlightDetail - Data:', error?.response?.data);
      
      let errorMsg = 'Error al cargar la información del vuelo';
      
      if (error?.response?.status === 500) {
        errorMsg = `El backend tiene un error al obtener el vuelo con ID ${flightId}. El endpoint GET /vuelos/${flightId} devuelve Error 500. Este es un problema del servidor que necesita ser corregido.`;
        console.error('💡 Solución: El backend debe corregir el endpoint GET /vuelos/{id_vuelo}');
      } else if (error?.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      
      toast.error(errorMsg, { duration: 6000 });
      setFlight(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">✈️</div>
        <p className="text-gray-700 font-semibold">No se pudo cargar el vuelo</p>
        <p className="text-gray-500 text-sm">El backend tiene un error al obtener los detalles del vuelo.</p>
        <p className="text-gray-400 text-xs">ID solicitado: {flightId}</p>
      </div>
    );
  }

  const departureDate = new Date(flight.fecha_salida);
  const arrivalDate = new Date(flight.fecha_llegada);
  const duration = Math.round((arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60));
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;

  const rows = 20;
  const seatsPerRow = ['A', 'B', 'C', 'D', 'E'];
  const occupiedSeats = asientos
    .filter(a => !a.disponible)
    .map(a => `${a.fila}${a.columna}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sky-600">Detalle del Vuelo {flight.codigo}</h2>
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
              <span className="text-gray-800">{flight.codigo}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aeronave:</span>
              <span className="text-gray-800">Airbus A320</span>
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
                {flight.ciudad_salida}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500 mb-1">Destino</p>
              <p className="text-gray-800">
                {flight.ciudad_llegada}
              </p>
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
                {departureDate.toLocaleDateString('es-ES', {
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
              <span className="text-gray-800">{departureDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Llegada:</span>
              <span className="text-gray-800">{arrivalDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duración:</span>
              <span className="text-gray-800">{durationHours}h {durationMinutes}m</span>
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
              <span className="text-gray-800">{flight.asientos_totales}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Disponibles:</span>
              <span className="text-green-600">{flight.asientos_disponibles}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ocupados:</span>
              <span className="text-red-600">{flight.asientos_totales - flight.asientos_disponibles}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Ocupación:</span>
              <span className="text-sky-600">
                {Math.round(((flight.asientos_totales - flight.asientos_disponibles) / flight.asientos_totales) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <span className="text-2xl text-sky-600">€{flight.precio_base}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ingresos Estimados:</span>
            <span className="text-gray-800">
              €{((flight.asientos_totales - flight.asientos_disponibles) * flight.precio_base).toFixed(2)}
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
