import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type City = {
  id: string;
  name: string;
  code: string;
};

export default function Cities() {
  const [cities, setCities] = useState<City[]>([
    { id: '1', name: 'Madrid', code: 'MAD' },
    { id: '2', name: 'Barcelona', code: 'BCN' },
    { id: '3', name: 'París', code: 'CDG' },
    { id: '4', name: 'Londres', code: 'LHR' },
    { id: '5', name: 'Roma', code: 'FCO' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCity: City = {
      id: Date.now().toString(),
      ...formData,
    };
    setCities([...cities, newCity]);
    setFormData({ name: '', code: '' });
    setIsDialogOpen(false);
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Madrid"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Código IATA</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="MAD"
                  maxLength={3}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                Agregar Ciudad
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Card key={city.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-500" />
                  <span className="text-lg">{city.name}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="inline-block bg-sky-100 text-sky-700 px-3 py-1 rounded text-sm">
                {city.code}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
