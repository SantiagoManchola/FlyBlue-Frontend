import { useState, useEffect } from 'react';
import { Plus, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { adminService } from '../../services/adminService';
import { EquipajeResponse } from '../../api/types';
import { toast } from 'sonner';

export default function Luggage() {
  const [luggageTypes, setLuggageTypes] = useState<EquipajeResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    peso_maximo: '',
    precio: '',
  });

  useEffect(() => {
    loadLuggage();
  }, []);

  const loadLuggage = async () => {
    try {
      console.log('🔄 Luggage - Iniciando carga de equipajes');
      setIsLoading(true);
      const data = await adminService.obtenerEquipajes();
      console.log('✅ Luggage - Equipajes cargados:', data);
      setLuggageTypes(data);
    } catch (error: any) {
      console.error('❌ Luggage - Error al cargar equipajes:', error);
      console.error('❌ Luggage - Detalles:', error.response?.data);
      const errorMsg = error.response?.data?.detail || 'Error al cargar los equipajes';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de campos
    if (!formData.tipo.trim()) {
      toast.error('El tipo de equipaje es requerido');
      return;
    }
    
    if (!formData.descripcion.trim()) {
      toast.error('La descripción es requerida');
      return;
    }
    
    if (formData.descripcion.length > 20) {
      toast.error('La descripción debe tener máximo 20 caracteres');
      return;
    }
    
    const pesoMaximo = parseFloat(formData.peso_maximo);
    const precio = parseFloat(formData.precio);
    
    if (isNaN(pesoMaximo) || pesoMaximo <= 0) {
      toast.error('El peso máximo debe ser un número mayor a 0');
      return;
    }
    
    if (isNaN(precio) || precio < 0) {
      toast.error('El precio debe ser un número válido');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const equipajeData = {
        tipo: formData.tipo.trim(),
        descripcion: formData.descripcion.trim(),
        peso_maximo: pesoMaximo,
        precio: precio
      };
      
      const response = await adminService.crearEquipaje(equipajeData);
      
      console.log('✅ Equipaje creado:', response);
      
      toast.success(`Equipaje ${response.tipo} creado exitosamente`);
      setFormData({ tipo: '', descripcion: '', peso_maximo: '', precio: '' });
      setIsDialogOpen(false);
      await loadLuggage();
    } catch (error: any) {
      console.error('❌ Luggage - Error completo al crear equipaje:', error);
      console.error('❌ Luggage - Respuesta del error:', error.response?.data);
      console.error('❌ Luggage - Status:', error.response?.status);
      console.error('❌ Luggage - Config enviado:', error.config?.data);
      
      let errorMessage = 'Error al crear el equipaje';
      
      if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor al crear el equipaje. El backend de Azure tiene un problema que necesita ser corregido. Por favor contacta al administrador del sistema.';
        console.error('💡 Solución sugerida: El backend en Azure necesita revisar los logs del endpoint POST /admin/equipajes');
      } else if (error.response?.status === 422) {
        errorMessage = 'Datos inválidos. Verifica que todos los campos tengan el formato correcto.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-800">Gestión de Equipajes</h2>
          <p className="text-gray-600 text-sm">Administra los tipos de equipaje disponibles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tipo de Equipaje
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Tipo de Equipaje</DialogTitle>
              <DialogDescription>
                Completa los datos del tipo de equipaje
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tipo</Label>
                <Input
                  id="name"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  placeholder="Equipaje de Mano"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Descripción 
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.descripcion.length}/20 caracteres)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.descripcion}
                  onChange={(e) => {
                    if (e.target.value.length <= 20) {
                      setFormData({ ...formData, descripcion: e.target.value });
                    }
                  }}
                  placeholder="Máx 20 caracteres"
                  disabled={isLoading}
                  maxLength={20}
                  required
                />
                {formData.descripcion.length >= 20 && (
                  <p className="text-xs text-orange-500">Has alcanzado el límite de 20 caracteres</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxWeight">Peso Máximo (kg)</Label>
                  <Input
                    id="maxWeight"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.peso_maximo}
                    onChange={(e) => setFormData({ ...formData, peso_maximo: e.target.value })}
                    placeholder="23.5"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="25.00"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  'Agregar Tipo de Equipaje'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && luggageTypes.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {luggageTypes.map((luggage) => (
            <Card key={luggage.id_equipaje} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sky-500" />
                    <span className="text-lg">{luggage.tipo}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2 text-sm">{luggage.descripcion}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">
                    Máx: {luggage.peso_maximo} kg
                  </span>
                  <span className="text-sky-600">
                    {luggage.precio === 0 ? 'Gratis' : `€${luggage.precio}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
