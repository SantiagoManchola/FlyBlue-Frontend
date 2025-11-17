import { useState, useEffect } from 'react';
import { Briefcase, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { obtenerEquipajes } from '../../api/admin/equipajes.api';
import type { EquipajeResponse } from '../../api/types';



export default function Luggage() {
  const [equipajes, setEquipajes] = useState<EquipajeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEquipajes = async () => {
      try {
        const data = await obtenerEquipajes();
        setEquipajes(data);
      } catch (error) {
        console.error('Error al cargar equipajes:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarEquipajes();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sky-600">Opciones de Equipaje</h2>
          <p className="text-gray-600">Cargando opciones de equipaje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Opciones de Equipaje</h2>
        <p className="text-gray-600">Elige la opción que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipajes.map((equipaje, index) => (
          <Card
            key={equipaje.id_equipaje}
            className={`hover:shadow-lg transition-shadow ${
              index === 1 ? 'border-sky-500 border-2' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {equipaje.tipo}
                      {index === 1 && (
                        <Badge className="bg-sky-500 text-white">Recomendado</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{equipaje.descripcion}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peso máximo:</span>
                  <span className="text-gray-800">{equipaje.peso_maximo} kg</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Precio</p>
                    <p className="text-2xl text-sky-600">
                      {equipaje.precio === 0 ? 'Gratis' : `€${equipaje.precio}`}
                    </p>
                  </div>
                  {equipaje.precio > 0 && (
                    <p className="text-xs text-gray-500">por trayecto</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      </div>

      {!loading && equipajes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No hay opciones de equipaje disponibles</h3>
            <p className="text-gray-600">
              Por favor, inténtalo de nuevo más tarde
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-sky-50 border-sky-200">
        <CardContent className="p-6">
          <h3 className="text-sky-900 mb-2">💡 Consejos Importantes</h3>
          <ul className="space-y-2 text-sm text-sky-800">
            <li>• Puedes añadir equipaje durante la reserva o hasta 4 horas antes del vuelo</li>
            <li>• Los precios son más económicos si añades equipaje durante la reserva</li>
            <li>• Verifica las restricciones de artículos prohibidos antes de viajar</li>
            <li>• Etiqueta tu equipaje con tus datos de contacto</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
