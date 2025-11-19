import { useState, useEffect } from 'react';
import { Plus, Plane, Eye, Loader2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminService } from '../../services/adminService';
import { VueloResponse, CiudadResponse } from '../../api/types';
import { toast } from 'sonner';

type FlightsProps = {
  onViewDetail?: (flightId: string) => void;
};

export default function Flights({ onViewDetail }: FlightsProps = {}) {
  const [flights, setFlights] = useState<any[]>([]);
  const [allFlights, setAllFlights] = useState<any[]>([]); // Guardar todos los vuelos
  const [cities, setCities] = useState<CiudadResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origen: '',
    destino: '',
    fecha: '',
  });
  const [formData, setFormData] = useState({
    id_origen: '',
    id_destino: '',
    fecha_salida: '',
    hora_salida: '',
    fecha_llegada: '',
    hora_llegada: '',
    precio_base: '',
  });

  useEffect(() => {
    loadCities();
    loadAllFlights();
  }, []);

  const loadCities = async () => {
    try {
      const data = await adminService.obtenerCiudades();
      setCities(data);
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
      toast.error('Error al cargar las ciudades');
    }
  };

  const loadAllFlights = async () => {
    try {
      console.log('🔄 Flights - Cargando todos los vuelos...');
      setIsLoading(true);
      const vuelos = await adminService.obtenerTodosLosVuelos();
      console.log('✅ Flights - Vuelos cargados:', vuelos.length);
      console.log('✅ Flights - Vuelos:', vuelos);
      
      // Usar los vuelos directamente como vienen del backend
      setAllFlights(vuelos);
      setFlights(vuelos);
    } catch (error) {
      console.error('❌ Flights - Error al cargar vuelos:', error);
      toast.error('Error al cargar los vuelos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchParams.origen && !searchParams.destino && !searchParams.fecha) {
      toast.info('Por favor selecciona al menos un criterio de búsqueda');
      return;
    }

    try {
      setIsSearching(true);
      console.log('🔍 Filtrando con:', searchParams);
      
      // Preparar filtros para enviar al backend
      const filtros: { origen?: number; destino?: number; fecha?: string } = {};
      
      if (searchParams.origen) {
        filtros.origen = parseInt(searchParams.origen);
      }
      if (searchParams.destino) {
        filtros.destino = parseInt(searchParams.destino);
      }
      if (searchParams.fecha) {
        filtros.fecha = searchParams.fecha;
      }
      
      console.log('🔍 Enviando filtros al backend:', filtros);
      
      // Llamar al backend con los filtros
      const vuelosFiltrados = await adminService.buscarVuelosConFiltros(filtros);
      
      console.log(`✅ Backend devolvió ${vuelosFiltrados.length} vuelos`);
      setFlights(vuelosFiltrados);
      
      if (vuelosFiltrados.length === 0) {
        toast.info('No se encontraron vuelos con esos criterios');
      } else {
        toast.success(`Se encontraron ${vuelosFiltrados.length} vuelo(s)`);
      }
    } catch (error: any) {
      console.error('❌ Error al filtrar vuelos:', error);
      toast.error('Error al filtrar vuelos');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    console.log('🔄 Flights - Limpiando filtros y mostrando todos los vuelos...');
    setSearchParams({
      origen: '',
      destino: '',
      fecha: ''
    });
    setFlights(allFlights); // Restaurar todos los vuelos
    toast.success('Mostrando todos los vuelos');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación manual de campos requeridos
    if (!formData.id_origen) {
      toast.error('Por favor selecciona una ciudad de origen');
      return;
    }
    
    if (!formData.id_destino) {
      toast.error('Por favor selecciona una ciudad de destino');
      return;
    }
    
    if (formData.id_origen === formData.id_destino) {
      toast.error('La ciudad de origen y destino deben ser diferentes');
      return;
    }
    
    if (!formData.fecha_salida || !formData.hora_salida) {
      toast.error('Por favor completa la fecha y hora de salida');
      return;
    }
    
    if (!formData.fecha_llegada || !formData.hora_llegada) {
      toast.error('Por favor completa la fecha y hora de llegada');
      return;
    }
    
    if (!formData.precio_base || parseFloat(formData.precio_base) <= 0) {
      toast.error('Por favor ingresa un precio válido mayor a 0');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const fecha_salida_completa = `${formData.fecha_salida}T${formData.hora_salida}:00`;
      const fecha_llegada_completa = `${formData.fecha_llegada}T${formData.hora_llegada}:00`;
      
      // Validar que la fecha de llegada sea posterior a la de salida
      const salida = new Date(fecha_salida_completa);
      const llegada = new Date(fecha_llegada_completa);
      
      if (llegada <= salida) {
        toast.error('La fecha de llegada debe ser posterior a la fecha de salida');
        setIsLoading(false);
        return;
      }
      
      console.log('📤 Enviando vuelo:', {
        id_origen: parseInt(formData.id_origen),
        id_destino: parseInt(formData.id_destino),
        fecha_salida: fecha_salida_completa,
        fecha_llegada: fecha_llegada_completa,
        precio_base: parseFloat(formData.precio_base)
      });
      
      const response = await adminService.crearVuelo({
        id_origen: parseInt(formData.id_origen),
        id_destino: parseInt(formData.id_destino),
        fecha_salida: fecha_salida_completa,
        fecha_llegada: fecha_llegada_completa,
        precio_base: parseFloat(formData.precio_base)
      });
      
      console.log('✅ Vuelo creado:', response);
      toast.success(`Vuelo ${response.codigo} creado exitosamente con ID: ${response.id_vuelo}`);
      console.info(`📌 Puedes ver el vuelo en: /admin/flights/${response.id_vuelo}`);
      
      // Limpiar formulario y cerrar diálogo
      setFormData({
        id_origen: '',
        id_destino: '',
        fecha_salida: '',
        hora_salida: '',
        fecha_llegada: '',
        hora_llegada: '',
        precio_base: '',
      });
      setIsDialogOpen(false);
      
      // Si hay parámetros de búsqueda, recargar resultados
      if (searchParams.origen && searchParams.destino && searchParams.fecha) {
        await handleSearch();
      }
    } catch (error: any) {
      console.error('Error al crear vuelo:', error);
      toast.error(error.response?.data?.detail || 'Error al crear el vuelo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800">Gestión de Vuelos</h2>
          <p className="text-gray-600 text-sm">Busca y administra los vuelos disponibles</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.id_origen} 
                    onValueChange={(value: string) => setFormData({ ...formData, id_origen: value })}
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id_ciudad} value={city.id_ciudad.toString()}>
                          {city.nombre} ({city.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.id_destino} 
                    onValueChange={(value: string) => setFormData({ ...formData, id_destino: value })}
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id_ciudad} value={city.id_ciudad.toString()}>
                          {city.nombre} ({city.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaSalida">Fecha Salida</Label>
                  <Input
                    id="fechaSalida"
                    type="date"
                    value={formData.fecha_salida}
                    onChange={(e) => setFormData({ ...formData, fecha_salida: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaSalida">Hora Salida</Label>
                  <Input
                    id="horaSalida"
                    type="time"
                    value={formData.hora_salida}
                    onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaLlegada">Fecha Llegada</Label>
                  <Input
                    id="fechaLlegada"
                    type="date"
                    value={formData.fecha_llegada}
                    onChange={(e) => setFormData({ ...formData, fecha_llegada: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaLlegada">Hora Llegada</Label>
                  <Input
                    id="horaLlegada"
                    type="time"
                    value={formData.hora_llegada}
                    onChange={(e) => setFormData({ ...formData, hora_llegada: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio Base (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.precio_base}
                  onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })}
                  placeholder="49.99"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando vuelo...
                  </>
                ) : (
                  'Agregar Vuelo'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Buscador de vuelos */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-semibold text-gray-800">Filtrar Vuelos</h3>
              <span className="text-sm text-gray-500">(Todos los campos son opcionales)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="searchOrigin">Origen</Label>
                <Select 
                  value={searchParams.origen} 
                  onValueChange={(value) => setSearchParams({ ...searchParams, origen: value })}
                  disabled={isSearching}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los orígenes" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id_ciudad} value={city.id_ciudad.toString()}>
                        {city.nombre} ({city.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchDestination">Destino</Label>
                <Select 
                  value={searchParams.destino} 
                  onValueChange={(value) => setSearchParams({ ...searchParams, destino: value })}
                  disabled={isSearching}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los destinos" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id_ciudad} value={city.id_ciudad.toString()}>
                        {city.nombre} ({city.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchDate">Fecha</Label>
                <Input
                  id="searchDate"
                  type="date"
                  value={searchParams.fecha}
                  onChange={(e) => setSearchParams({ ...searchParams, fecha: e.target.value })}
                  disabled={isSearching}
                  placeholder="Todas las fechas"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1 bg-sky-500 hover:bg-sky-600"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Filtrando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Filtrar
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="flex-1"
                  disabled={isSearching || isLoading}
                >
                  Ver Todos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isSearching || isLoading) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
          <p className="text-gray-600">{isSearching ? 'Buscando vuelos...' : 'Cargando vuelos...'}</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No se encontraron vuelos</p>
          <p className="text-sm mt-2">Usa el buscador arriba para encontrar vuelos o crea uno nuevo</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {flights.map((flight) => {
            const salidaDate = new Date(flight.fecha_salida);
            const llegadaDate = new Date(flight.fecha_llegada);
            const flightId = flight.id || flight.id_vuelo;
            
            // Extraer ciudades del código si no están disponibles
            const codigoParts = flight.codigo?.split('-') || [];
            const ciudadOrigen = flight.ciudad_salida || codigoParts[0] || 'N/A';
            const ciudadDestino = flight.ciudad_llegada || codigoParts[1] || 'N/A';
            
            return (
              <Card key={flightId} className="hover:shadow-md transition-all bg-white border border-gray-100">
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
                            {salidaDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
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
                          {flight.asientos_totales && (
                            <span className="text-xs text-gray-500">{flight.asientos_totales} asientos</span>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-2xl text-gray-900 mb-1">
                            {llegadaDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-gray-600 mb-0.5">{ciudadDestino}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 md:pl-6 md:border-l">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Precio</p>
                        <p className="text-3xl text-sky-500">€{flight.precio_base}</p>
                      </div>
                      {onViewDetail && (
                        <Button
                          className="bg-sky-500 hover:bg-sky-600 w-full min-w-[180px] rounded-4xl"
                          onClick={() => {
                            console.log('👁️ Ver Detalle clickeado - Flight ID:', flightId);
                            onViewDetail(flightId.toString());
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
