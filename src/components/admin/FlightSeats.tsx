import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

type Seat = {
  id: string;
  row: number;
  column: string;
  type: 'economy' | 'premium';
  status: 'available' | 'occupied' | 'reserved';
  passengerName?: string;
};

type FlightSeatsProps = {
  flightId: string;
};

export default function FlightSeats({ flightId }: FlightSeatsProps) {
  const [seats] = useState<Seat[]>(() => {
    const generatedSeats: Seat[] = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    const statuses: Seat['status'][] = ['available', 'occupied', 'reserved'];
    
    for (let row = 1; row <= 30; row++) {
      for (const column of columns) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        generatedSeats.push({
          id: `${row}${column}`,
          row,
          column,
          type: row <= 3 ? 'premium' : 'economy',
          status: randomStatus,
          passengerName: randomStatus === 'occupied' ? `Pasajero ${row}${column}` : undefined,
        });
      }
    }
    return generatedSeats;
  });

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'occupied') return 'bg-red-500 text-white';
    if (seat.status === 'reserved') return 'bg-yellow-500 text-white';
    if (seat.type === 'premium') return 'bg-sky-200 hover:bg-sky-300 text-sky-800';
    return 'bg-green-200 hover:bg-green-300 text-green-800';
  };

  const stats = {
    total: seats.length,
    available: seats.filter((s) => s.status === 'available').length,
    occupied: seats.filter((s) => s.status === 'occupied').length,
    reserved: seats.filter((s) => s.status === 'reserved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Mapa de Asientos - Vuelo {flightId}</h2>
        <p className="text-gray-600">Vista general de los asientos del vuelo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl text-yellow-600">{stats.reserved}</p>
              <p className="text-sm text-gray-600">Reservados</p>
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
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-sky-200 rounded"></div>
              <span className="text-sm text-gray-600">Premium</span>
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
                {Array.from({ length: 30 }, (_, i) => i + 1).map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="w-8 text-sm text-gray-500 text-right">{row}</span>
                    {['A', 'B', 'C'].map((col) => {
                      const seat = seats.find((s) => s.row === row && s.column === col);
                      return seat ? (
                        <button
                          key={seat.id}
                          className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                          title={seat.passengerName || `${seat.row}${seat.column} - ${seat.status}`}
                        >
                          {seat.column}
                        </button>
                      ) : null;
                    })}
                    <div className="w-6"></div>
                    {['D', 'E', 'F'].map((col) => {
                      const seat = seats.find((s) => s.row === row && s.column === col);
                      return seat ? (
                        <button
                          key={seat.id}
                          className={`w-10 h-10 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                          title={seat.passengerName || `${seat.row}${seat.column} - ${seat.status}`}
                        >
                          {seat.column}
                        </button>
                      ) : null;
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
