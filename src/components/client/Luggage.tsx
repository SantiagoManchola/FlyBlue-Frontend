import { useState } from 'react';
import { Briefcase, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

type LuggageType = {
  id: string;
  name: string;
  description: string;
  maxWeight: number;
  dimensions: string;
  price: number;
  features: string[];
  recommended?: boolean;
};

export default function Luggage() {
  const [luggageTypes] = useState<LuggageType[]>([
    {
      id: '1',
      name: 'Equipaje de Mano',
      description: 'Perfecto para viajes cortos',
      maxWeight: 10,
      dimensions: '55 x 40 x 23 cm',
      price: 0,
      features: [
        'Incluido en el precio del billete',
        'Debe caber en el compartimento superior',
        'Acceso durante el vuelo',
        'Sin cargo adicional',
      ],
    },
    {
      id: '2',
      name: 'Equipaje Facturado',
      description: 'La opción estándar para la mayoría de viajes',
      maxWeight: 23,
      dimensions: '80 x 120 x 120 cm (suma total)',
      price: 25,
      recommended: true,
      features: [
        'Maleta estándar',
        'Recogida en cinta de equipaje',
        'Ideal para viajes de 7-14 días',
        'Protección adicional',
      ],
    },
    {
      id: '3',
      name: 'Equipaje Extra',
      description: 'Para quienes necesitan llevar más',
      maxWeight: 23,
      dimensions: '80 x 120 x 120 cm (suma total)',
      price: 45,
      features: [
        'Segunda maleta facturada',
        'Mismo peso que equipaje facturado',
        'Perfecto para viajes largos',
        'Compras adicionales',
      ],
    },
    {
      id: '4',
      name: 'Equipaje Especial',
      description: 'Equipos deportivos y artículos especiales',
      maxWeight: 32,
      dimensions: 'Dimensiones variables',
      price: 75,
      features: [
        'Equipos deportivos (esquís, golf, surf)',
        'Instrumentos musicales',
        'Mayor peso permitido',
        'Manejo especializado',
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sky-600">Opciones de Equipaje</h2>
        <p className="text-gray-600">Elige la opción que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {luggageTypes.map((luggage) => (
          <Card
            key={luggage.id}
            className={`hover:shadow-lg transition-shadow ${
              luggage.recommended ? 'border-sky-500 border-2' : ''
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
                      {luggage.name}
                      {luggage.recommended && (
                        <Badge className="bg-sky-500 text-white">Recomendado</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{luggage.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peso máximo:</span>
                  <span className="text-gray-800">{luggage.maxWeight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dimensiones:</span>
                  <span className="text-gray-800 text-sm">{luggage.dimensions}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Características:</p>
                <ul className="space-y-2">
                  {luggage.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Precio</p>
                    <p className="text-2xl text-sky-600">
                      {luggage.price === 0 ? 'Gratis' : `€${luggage.price}`}
                    </p>
                  </div>
                  {luggage.price > 0 && (
                    <p className="text-xs text-gray-500">por trayecto</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
