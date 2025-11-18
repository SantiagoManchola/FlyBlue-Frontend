import { useState, useEffect } from 'react';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { adminService } from '../../services/adminService';
import { CiudadResponse } from '../../api/types';
import { toast } from 'sonner';

export default function Cities() {
  const [cities, setCities] = useState<CiudadResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', codigo: '' });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.obtenerCiudades();
      setCities(data);
    } catch (error) {
      console.error('Error al cargar ciudades:', error);
      toast.error('Error al cargar las ciudades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await adminService.crearCiudad({
        nombre: formData.nombre,
        codigo: formData.codigo
      });
      toast.success(`Ciudad ${response.nombre} creada exitosamente`);
      setFormData({ nombre: '', codigo: '' });
      setIsDialogOpen(false);
      await loadCities();
    } catch (error: any) {
      console.error('Error al crear ciudad:', error);
      toast.error(error.response?.data?.detail || 'Error al crear la ciudad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800">Gestión de Ciudades</h2>
          <p className="text-gray-600 text-sm">Administra las ciudades disponibles para vuelos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Ciudad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Ciudad</DialogTitle>
              <DialogDescription>
                Completa los datos de la ciudad que deseas agregar
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Ciudad</Label>
                <Input
                  id="name"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Madrid"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Código IATA</Label>
                <Input
                  id="code"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                  placeholder="MAD"
                  maxLength={3}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  'Agregar Ciudad'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && cities.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Card key={city.id_ciudad} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-500" />
                    <span className="text-lg">{city.nombre}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded text-sm">
                  {city.codigo}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
