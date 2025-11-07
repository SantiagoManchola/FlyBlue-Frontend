import { useState } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

type LuggageType = {
  id: string;
  name: string;
  description: string;
  maxWeight: number;
  price: number;
};

export default function Luggage() {
  const [luggageTypes, setLuggageTypes] = useState<LuggageType[]>([
    { id: '1', name: 'Equipaje de Mano', description: 'Bolso pequeño o mochila', maxWeight: 10, price: 0 },
    { id: '2', name: 'Equipaje Facturado', description: 'Maleta estándar', maxWeight: 23, price: 25 },
    { id: '3', name: 'Equipaje Extra', description: 'Segunda maleta', maxWeight: 23, price: 45 },
    { id: '4', name: 'Equipaje Especial', description: 'Equipos deportivos o sobrepeso', maxWeight: 32, price: 75 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxWeight: '',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLuggage: LuggageType = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      maxWeight: parseFloat(formData.maxWeight),
      price: parseFloat(formData.price),
    };
    setLuggageTypes([...luggageTypes, newLuggage]);
    setFormData({ name: '', description: '', maxWeight: '', price: '' });
    setIsDialogOpen(false);
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
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Equipaje de Mano"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Bolso pequeño o mochila"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxWeight">Peso Máximo (kg)</Label>
                  <Input
                    id="maxWeight"
                    type="number"
                    value={formData.maxWeight}
                    onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                    placeholder="23"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25.00"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                Agregar Tipo de Equipaje
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {luggageTypes.map((luggage) => (
          <Card key={luggage.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-500" />
                  <span className="text-lg">{luggage.name}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2 text-sm">{luggage.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">
                  Máx: {luggage.maxWeight} kg
                </span>
                <span className="text-sky-600">
                  {luggage.price === 0 ? 'Gratis' : `€${luggage.price}`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
