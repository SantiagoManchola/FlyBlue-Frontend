import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';
import { obtenerAsientosVuelo } from '../../api/admin/vuelos.api';
import { Asiento } from '../../api/types';
import { toast } from 'sonner';

type FlightSeatsProps = {
  flightId: string;
};

export default function FlightSeats({ flightId }: FlightSeatsProps) {
  const [seats, setSeats] = useState<Asiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, [flightId]);

  const loadSeats = async () => {
    try {
      setIsLoading(true);
      const data = await obtenerAsientosVuelo(parseInt(flightId));
      setSeats(data.asientos);
    } catch (error) {
      console.error('Error al cargar asientos:', error);
      toast.error('Error al cargar los asientos');
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

  const getSeatColor = (seat: Asiento) => {
    if (!seat.disponible) return 'bg-red-500 text-white';
    return 'bg-green-200 hover:bg-green-300 text-green-800';
  };

  const stats = {
    total: seats.length,
    available: seats.filter((s) => s.disponible).length,
    occupied: seats.filter((s) => !s.disponible).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Mapa de Asientos - Vuelo {flightId}</h2>
        <p className="text-gray-600">Vista general de los asientos del vuelo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl text-green-600">{stats.available}</p>
              <p className="text-sm text-gray-600">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl text-red-600">{stats.occupied}</p>
              <p className="text-sm text-gray-600">Ocupados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Asientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-200 rounded"></div>
              <span className="text-sm text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Ocupado</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex justify-center mb-4">
                <div className="bg-sky-100 px-6 py-2 rounded-t-lg">
                  <p className="text-sm text-sky-700">Cabina</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="w-8 text-sm text-gray-500 text-right">{row}</span>
                    {['A', 'B'].map((col) => {
                      const seat = seats.find((s) => s.fila === row && s.columna === col);
                      return seat ? (
                        <button
                          key={seat.id_asiento}
                          className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                          title={`${seat.fila}${seat.columna} - ${seat.disponible ? 'Disponible' : 'Ocupado'}`}
                        >
                          {seat.columna}
                        </button>
                      ) : (
                        <div key={col} className="w-10 h-10"></div>
                      );
                    })}
                    <div className="w-6"></div>
                    {['C', 'D', 'E'].map((col) => {
                      const seat = seats.find((s) => s.fila === row && s.columna === col);
                      return seat ? (
                        <button
                          key={seat.id_asiento}
                          className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                          title={`${seat.fila}${seat.columna} - ${seat.disponible ? 'Disponible' : 'Ocupado'}`}
                        >
                          {seat.columna}
                        </button>
                      ) : (
                        <div key={col} className="w-10 h-10"></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
