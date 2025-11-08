import { useState } from 'react';
import { Plane, MapPin, Briefcase, Calendar, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { User } from '../App';
import Cities from './admin/Cities';
import Luggage from './admin/Luggage';
import Flights from './admin/Flights';
import FlightDetail from './admin/FlightDetail';

type AdminDashboardProps = {
  user: User;
  onLogout: () => void;
};

type AdminView = 'cities' | 'luggage' | 'flights';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('flights');
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const handleViewFlightDetail = (flightId: string) => {
    setSelectedFlightId(flightId);
  };

  const handleBackToFlights = () => {
    setSelectedFlightId(null);
  };

  const sidebarItems = [
    { id: 'flights', icon: Calendar, label: 'Vuelos' },
    { id: 'cities', icon: MapPin, label: 'Ciudades' },
    { id: 'luggage', icon: Briefcase, label: 'Equipajes' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-gray-50 flex flex-col items-center py-6 m-5 rounded-full">
        <div className="mb-8">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`p-3 rounded-lg transition-colors group relative cursor-pointer ${
                  isActive ? 'bg-sky-500 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="relative group p-3 rounded-lg cursor-pointer"
            title="Cerrar Sesión"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-sky-100 text-sky-600">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sky-500 text-2xl font-bold">Flyblue Admin</h1>
            <div className="text-sm text-gray-600">
              Bienvenido, {user.name}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {currentView === 'cities' && <Cities />}
          {currentView === 'luggage' && <Luggage />}
          {currentView === 'flights' && !selectedFlightId && (
            <Flights onViewDetail={handleViewFlightDetail} />
          )}
          {currentView === 'flights' && selectedFlightId && (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleBackToFlights}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Vuelos
              </Button>
              <FlightDetail flightId={selectedFlightId} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
