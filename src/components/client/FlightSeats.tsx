import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { obtenerAsientosVuelo } from '../../api/admin/vuelos.api';
import type { Asiento } from '../../api/types';

type SeatWithStatus = Asiento & {
  status: 'available' | 'occupied' | 'selected';
  type: 'economy' | 'premium';
  price: number;
};

type FlightSeatsProps = {
  flightId: number;
};

export default function FlightSeats({ flightId }: FlightSeatsProps) {
  const [seats, setSeats] = useState<SeatWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAsientos = async () => {
      try {
        const data = await obtenerAsientosVuelo(flightId);
        const seatsWithStatus: SeatWithStatus[] = data.asientos.map(asiento => ({
          ...asiento,
          status: asiento.disponible ? 'available' : 'occupied',
          type: asiento.fila <= 3 ? 'premium' : 'economy',
          price: asiento.fila <= 3 ? 15 : asiento.fila <= 10 ? 8 : 0
        }));
        setSeats(seatsWithStatus);
      } catch (error) {
        console.error('Error al cargar asientos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarAsientos();
  }, [flightId]);

  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleSeatClick = (seatId: number) => {
    const seat = seats.find((s) => s.id_asiento === seatId);
    if (seat?.status === 'available') {
      setSeats(
        seats.map((s) =>
          s.id_asiento === seatId
            ? { ...s, status: 'selected' as const }
            : s.status === 'selected'
            ? { ...s, status: 'available' as const }
            : s
        )
      );
      setSelectedSeat(seatId);
    }
  };

  const getSeatColor = (seat: SeatWithStatus) => {
    if (seat.status === 'occupied') return 'bg-gray-300 cursor-not-allowed';
    if (seat.status === 'selected') return 'bg-sky-500 text-white cursor-pointer hover:bg-sky-600';
    if (seat.type === 'premium') return 'bg-purple-200 hover:bg-purple-300 text-purple-800 cursor-pointer';
    if (seat.price > 0) return 'bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer';
    return 'bg-blue-200 hover:bg-blue-300 text-blue-800 cursor-pointer';
  };

  const stats = {
    total: seats.length,
    available: seats.filter((s) => s.status === 'available').length,
    occupied: seats.filter((s) => s.status === 'occupied').length,
    premium: seats.filter((s) => s.type === 'premium' && s.status === 'available').length,
  };

  const selectedSeatData = seats.find((s) => s.id_asiento === selectedSeat);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sky-600">Selección de Asientos - Vuelo {flightId}</h2>
          <p className="text-gray-600">Cargando asientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Selección de Asientos - Vuelo {flightId}</h2>
        <p className="text-gray-600">Elige tu asiento preferido</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
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
              <p className="text-2xl text-gray-600">{stats.occupied}</p>
              <p className="text-sm text-gray-600">Ocupados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl text-purple-600">{stats.premium}</p>
              <p className="text-sm text-gray-600">Premium</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Asientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 mb-6 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-200 rounded"></div>
                  <span className="text-gray-600">Estándar (Gratis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-200 rounded"></div>
                  <span className="text-gray-600">Preferente (€8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-200 rounded"></div>
                  <span className="text-gray-600">Premium (€15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">Ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-sky-500 rounded"></div>
                  <span className="text-gray-600">Seleccionado</span>
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
                    {Array.from(new Set(seats.map(s => s.fila))).sort((a, b) => a - b).map((row) => (
                      <div key={row} className="flex items-center justify-center gap-2">
                        <span className="w-8 text-sm text-gray-500 text-right">{row}</span>
                        {['A', 'B', 'C'].map((col) => {
                          const seat = seats.find((s) => s.fila === row && s.columna === col);
                          return seat ? (
                            <button
                              key={seat.id_asiento}
                              onClick={() => handleSeatClick(seat.id_asiento)}
                              disabled={seat.status === 'occupied'}
                              className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                              title={`${seat.fila}${seat.columna} - ${seat.status} ${seat.price > 0 ? `(€${seat.price})` : ''}`}
                            >
                              {seat.columna}
                            </button>
                          ) : (
                            <div key={`${row}${col}`} className="w-10 h-10"></div>
                          );
                        })}
                        <div className="w-6"></div>
                        {['D', 'E', 'F'].map((col) => {
                          const seat = seats.find((s) => s.fila === row && s.columna === col);
                          return seat ? (
                            <button
                              key={seat.id_asiento}
                              onClick={() => handleSeatClick(seat.id_asiento)}
                              disabled={seat.status === 'occupied'}
                              className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                              title={`${seat.fila}${seat.columna} - ${seat.status} ${seat.price > 0 ? `(€${seat.price})` : ''}`}
                            >
                              {seat.columna}
                            </button>
                          ) : (
                            <div key={`${row}${col}`} className="w-10 h-10"></div>
                          );
                        })}
                        <span className="w-8 text-sm text-gray-500">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Asiento Seleccionado</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSeatData ? (
                <div className="space-y-4">
                  <div className="bg-sky-50 p-6 rounded-lg text-center">
                    <p className="text-4xl text-sky-600 mb-2">
                      {selectedSeatData.fila}
                      {selectedSeatData.columna}
                    </p>
                    <Badge
                      className={
                        selectedSeatData.type === 'premium'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {selectedSeatData.type === 'premium' ? 'Premium' : 'Economy'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fila:</span>
                      <span className="text-gray-800">{selectedSeatData.fila}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Columna:</span>
                      <span className="text-gray-800">{selectedSeatData.columna}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posición:</span>
                      <span className="text-gray-800">
                        {['A', 'F'].includes(selectedSeatData.columna)
                          ? 'Ventana'
                          : ['C', 'D'].includes(selectedSeatData.columna)
                          ? 'Pasillo'
                          : 'Centro'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Precio:</span>
                      <span className="text-sky-600">
                        {selectedSeatData.price === 0 ? 'Gratis' : `€${selectedSeatData.price}`}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-sky-500 hover:bg-sky-600">
                    Confirmar Selección
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Ningún asiento seleccionado</p>
                  <p className="text-sm text-gray-400">
                    Haz clic en un asiento disponible para seleccionarlo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
