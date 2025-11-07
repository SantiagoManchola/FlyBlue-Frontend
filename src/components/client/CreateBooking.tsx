import { useState } from 'react';
import { Plane, Briefcase, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

type CreateBookingProps = {
  flightId: string;
  userId: string;
  onProceedToPayment: (bookingData: {
    flightId: string;
    seat: string;
    luggage: string;
    totalPrice: number;
  }) => void;
};

export default function CreateBooking({ flightId, userId, onProceedToPayment }: CreateBookingProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedLuggage, setSelectedLuggage] = useState<string | null>(null);

  // Mock flight data
  const flight = {
    flightCode: 'FB101',
    origin: 'Madrid (MAD)',
    destination: 'Barcelona (BCN)',
    departureDate: '15 Feb 2024',
    departureTime: '08:00',
    arrivalTime: '09:15',
    price: 49.99,
  };

  const luggageOptions = [
    { id: '1', name: 'Equipaje de Mano', description: 'Bolso pequeño o mochila (10kg)', price: 0 },
    { id: '2', name: 'Equipaje Facturado', description: 'Maleta estándar (23kg)', price: 25 },
    { id: '3', name: 'Equipaje Extra', description: 'Segunda maleta (23kg)', price: 45 },
    { id: '4', name: 'Equipaje Especial', description: 'Equipos deportivos (32kg)', price: 75 },
  ];

  // Generate seats: 20 rows, 5 seats per row (A-E)
  const rows = 20;
  const seatsPerRow = ['A', 'B', 'C', 'D', 'E'];
  const occupiedSeats = ['3A', '3B', '5C', '7D', '10A', '12E', '15B', '18C']; // Mock occupied seats

  const selectedLuggageOption = luggageOptions.find((l) => l.id === selectedLuggage);
  const totalPrice = flight.price + (selectedLuggageOption?.price || 0);

  const handleProceedToPayment = () => {
    if (!selectedSeat || !selectedLuggage) {
      alert('Por favor selecciona un asiento y tipo de equipaje');
      return;
    }
    onProceedToPayment({
      flightId,
      seat: selectedSeat,
      luggage: selectedLuggage,
      totalPrice,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-800">Nueva Reserva</h2>
        <p className="text-gray-600">Selecciona tu asiento y equipaje</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Seat Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona tu Asiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-sky-500 rounded"></div>
                  <span className="text-gray-600">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">Ocupado</span>
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
                            const isSelected = selectedSeat === seatId;
                            
                            return (
                              <button
                                key={seatId}
                                disabled={isOccupied}
                                onClick={() => setSelectedSeat(seatId)}
                                className={`w-7 h-7 rounded text-xs transition-all ${
                                  isOccupied
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-sky-500 text-white scale-110'
                                    : 'border-2 border-gray-300 hover:border-sky-400 hover:scale-105'
                                }`}
                              >
                                {!isOccupied && letter}
                              </button>
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
                            const isSelected = selectedSeat === seatId;
                            
                            return (
                              <button
                                key={seatId}
                                disabled={isOccupied}
                                onClick={() => setSelectedSeat(seatId)}
                                className={`w-7 h-7 rounded text-xs transition-all ${
                                  isOccupied
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-sky-500 text-white scale-110'
                                    : 'border-2 border-gray-300 hover:border-sky-400 hover:scale-105'
                                }`}
                              >
                                {!isOccupied && letter}
                              </button>
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

          {/* Luggage Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona tu Equipaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {luggageOptions.map((luggage) => (
                  <button
                    key={luggage.id}
                    onClick={() => setSelectedLuggage(luggage.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedLuggage === luggage.id
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Briefcase className={`w-5 h-5 mt-1 ${selectedLuggage === luggage.id ? 'text-sky-500' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-gray-800">{luggage.name}</p>
                          <Badge className={selectedLuggage === luggage.id ? 'bg-sky-500' : 'bg-gray-500'}>
                            {luggage.price === 0 ? 'Gratis' : `€${luggage.price}`}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{luggage.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-sky-500" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Vuelo</p>
                <p className="text-gray-800">{flight.flightCode}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Ruta</p>
                <p className="text-gray-800">{flight.origin}</p>
                <p className="text-gray-800">→ {flight.destination}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="text-gray-800">{flight.departureDate}</p>
                <p className="text-gray-800">{flight.departureTime} - {flight.arrivalTime}</p>
              </div>
              <Separator />
              {selectedSeat && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Asiento Seleccionado</p>
                    <p className="text-gray-800">{selectedSeat}</p>
                  </div>
                  <Separator />
                </>
              )}
              {selectedLuggageOption && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Equipaje</p>
                    <p className="text-gray-800">{selectedLuggageOption.name}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Vuelo:</span>
                  <span className="text-gray-800">€{flight.price}</span>
                </div>
                {selectedLuggageOption && selectedLuggageOption.price > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Equipaje:</span>
                    <span className="text-gray-800">€{selectedLuggageOption.price}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Total:</span>
                <span className="text-2xl text-sky-600">€{totalPrice.toFixed(2)}</span>
              </div>
              <Button 
                onClick={handleProceedToPayment} 
                className="w-full bg-sky-500 hover:bg-sky-600"
                disabled={!selectedSeat || !selectedLuggage}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Ir a Pagar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
