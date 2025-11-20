import { useState, useEffect } from 'react';
import { Plane, Briefcase, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { obtenerVueloPorId, obtenerAsientosVuelo } from '../../api/admin/vuelos.api';
import { obtenerEquipajes } from '../../api/admin/equipajes.api';
import { crearReserva } from '../../api/client/reservas.api';
import type { VueloResponse, Asiento, EquipajeResponse } from '../../api/types';
import { toast } from 'sonner'; // Agregar esta importación

type CreateBookingProps = {
  flightId: number;
  userId: number;
  userName: string; // ✅ Agregar nombre del usuario
  onProceedToPayment: (bookingData: {
    flightId: number;
    seat: number;
    luggage: number;
    totalPrice: number;
    selectedSeat: string; // ✅ Cambiar a string (código del asiento)
    selectedLuggage: number;
    userName: string; // ✅ Agregar nombre
  }) => void;
};

function formatCurrencyCOP(value: number) {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function CreateBooking({ flightId, userId, userName, onProceedToPayment }: CreateBookingProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [selectedLuggage, setSelectedLuggage] = useState<number | null>(null);
  const [flight, setFlight] = useState<VueloResponse | null>(null);
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [equipajes, setEquipajes] = useState<EquipajeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('🔄 CreateBooking - Cargando datos para vuelo:', flightId);

        const flightData = await obtenerVueloPorId(flightId);
        console.log('✅ CreateBooking - Vuelo cargado:', flightData);
        setFlight(flightData);

        const asientosData = await obtenerAsientosVuelo(flightId);
        console.log('✅ CreateBooking - Respuesta asientos RAW:', asientosData);
        console.log('✅ CreateBooking - asientosData.asientos:', asientosData.asientos);
        console.log('✅ CreateBooking - Cantidad:', asientosData.asientos?.length);

        if (asientosData && asientosData.asientos) {
          console.log('✅ CreateBooking - Asignando asientos al estado:', asientosData.asientos);
          setAsientos(asientosData.asientos);
        } else {
          console.warn('⚠️ CreateBooking - No se encontró la propiedad asientos');
          setAsientos([]);
        }

        const equipajesData = await obtenerEquipajes();
        console.log('✅ CreateBooking - Equipajes cargados:', equipajesData);
        setEquipajes(equipajesData);

      } catch (error) {
        console.error('❌ CreateBooking - Error al cargar datos:', error);
        setAsientos([]);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [flightId]);

  const selectedLuggageOption = equipajes.find((l) => l.id_equipaje === selectedLuggage);
  const totalPrice = (flight?.precio_base || 0) + (selectedLuggageOption?.precio || 0);

  const handleProceedToPayment = () => {
    if (!selectedSeat || selectedLuggage === null) {
      toast.error('Por favor selecciona asiento y equipaje');
      return;
    }

    // ✅ Obtener el código del asiento (fila + columna)
    const seatCode = asientos.find(a => a.id_asiento === selectedSeat);
    const seatCodeString = seatCode ? `${seatCode.fila}${seatCode.columna}` : '';

    // ✅ Solo pasar datos, NO crear reserva
    const bookingData = {
      flightId,
      seat: selectedSeat,
      luggage: selectedLuggage,
      totalPrice,
      selectedSeat: seatCodeString, // ✅ Ahora es "2B" en lugar de 807
      selectedLuggage,
      userName, // ✅ Agregar nombre
    };

    onProceedToPayment(bookingData);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-gray-800">Nueva Reserva</h2>
          <p className="text-gray-600">Cargando información del vuelo...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-gray-800">Error</h2>
          <p className="text-gray-600">No se pudo cargar la información del vuelo.</p>
        </div>
      </div>
    );
  }

  console.log('🎨 CreateBooking RENDER - Estado de asientos:', asientos);
  console.log('🎨 CreateBooking RENDER - Cantidad de asientos en render:', asientos.length);
  console.log('🎨 CreateBooking RENDER - Primer asiento:', asientos[0]);

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
              {asientos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No hay asientos disponibles</p>
                  <p className="text-sm mt-2">Los asientos para este vuelo aún no han sido configurados</p>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  {/* Cockpit */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-b from-sky-400 to-sky-300 rounded-t-full h-12 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {Array.from(new Set(asientos.map(a => a.fila))).sort((a, b) => a - b).map((rowNumber) => {
                      return (
                        <div key={rowNumber} className="flex items-center gap-2 justify-center">
                          <span className="text-xs text-gray-500 w-6 text-center">{rowNumber}</span>

                          {/* Left side seats (A, B) */}
                          <div className="flex gap-1">
                            {['A', 'B'].map((letter) => {
                              const asiento = asientos.find(a => a.fila === rowNumber && a.columna === letter);
                              if (!asiento) return <div key={`${rowNumber}${letter}`} className="w-7 h-7"></div>;

                              const isOccupied = !asiento.disponible;
                              const isSelected = selectedSeat === asiento.id_asiento;

                              return (
                                <button
                                  key={asiento.id_asiento}
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(asiento.id_asiento)}
                                  className={`w-7 h-7 rounded text-xs transition-all ${isOccupied
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
                            {['C', 'D', 'E'].map((letter) => {
                              const asiento = asientos.find(a => a.fila === rowNumber && a.columna === letter);
                              if (!asiento) return <div key={`${rowNumber}${letter}`} className="w-7 h-7"></div>;

                              const isOccupied = !asiento.disponible;
                              const isSelected = selectedSeat === asiento.id_asiento;

                              return (
                                <button
                                  key={asiento.id_asiento}
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(asiento.id_asiento)}
                                  className={`w-7 h-7 rounded text-xs transition-all ${isOccupied
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
              )}
            </CardContent>
          </Card>

          {/* Luggage Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona tu Equipaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {equipajes.map((equipaje) => (
                  <button
                    key={equipaje.id_equipaje}
                    onClick={() => setSelectedLuggage(equipaje.id_equipaje)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${selectedLuggage === equipaje.id_equipaje
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-sky-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <Briefcase className={`w-5 h-5 mt-1 ${selectedLuggage === equipaje.id_equipaje ? 'text-sky-500' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-gray-800">{equipaje.tipo}</p>
                          <Badge className={selectedLuggage === equipaje.id_equipaje ? 'bg-sky-500' : 'bg-gray-500'}>
                            {equipaje.precio === 0
                              ? 'Gratis'
                              : `COP ${formatCurrencyCOP(equipaje.precio)}`}
                          </Badge>

                        </div>
                        <p className="text-xs text-gray-600">{equipaje.descripcion}</p>
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
                <p className="text-gray-800">{flight.codigo}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Ruta</p>
                <p className="text-gray-800">{flight.ciudad_salida}</p>
                <p className="text-gray-800">→ {flight.ciudad_llegada}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="text-gray-800">{new Date(flight.fecha_salida).toLocaleDateString('es-ES')}</p>
                <p className="text-gray-800">
                  {new Date(flight.fecha_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} -
                  {new Date(flight.fecha_llegada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <Separator />
              {selectedSeat && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Asiento Seleccionado</p>
                    <p className="text-gray-800">
                      {asientos.find(a => a.id_asiento === selectedSeat)?.fila}
                      {asientos.find(a => a.id_asiento === selectedSeat)?.columna}
                    </p>
                  </div>
                  <Separator />
                </>
              )}
              {selectedLuggageOption && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Equipaje</p>
                    <p className="text-gray-800">{selectedLuggageOption.tipo}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Vuelo:</span>
                  <span className="text-gray-800">
                    COP {formatCurrencyCOP(flight.precio_base)}
                  </span>
                </div>
                {selectedLuggageOption && selectedLuggageOption.precio > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Equipaje:</span>
                    <span className="text-gray-800">
                      COP {formatCurrencyCOP(selectedLuggageOption.precio)}
                    </span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Total:</span>
                <span className="text-2xl text-sky-600">
                  COP {formatCurrencyCOP(totalPrice)}
                </span>
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
