import { useState } from 'react';
import { Plane, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User } from '../App';
import CreateBooking from './client/CreateBooking';
import MyBookings from './client/MyBookings';
import CreatePayment from './client/CreatePayment';
import Flights from './client/Flights';

type ClientDashboardProps = {
  user: User;
  onLogout: () => void;
};

type ClientView = 'flights' | 'create-booking' | 'my-bookings' | 'payment';

export default function ClientDashboard({ user, onLogout }: ClientDashboardProps) {
  const [currentView, setCurrentView] = useState<ClientView>('flights');
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleBookFlight = (flightId: string) => {
    setSelectedFlightId(flightId);
    setCurrentView('create-booking');
  };

  const handleProceedToPayment = (bookingData: { flightId: string; seat: string; luggage: string; totalPrice: number }) => {
    // Store booking data for payment
    setSelectedBookingId(bookingData.flightId);
    setCurrentView('payment');
  };

  const sidebarItems = [
    { id: 'flights', icon: Plane, label: 'Reservar Vuelos' },
    { id: 'my-bookings', icon: CheckCircle, label: 'Mis Reservas' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r flex flex-col items-center py-6">
        <div className="mb-8">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center gap-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || 
              (item.id === 'flights' && currentView === 'create-booking') ||
              (item.id === 'my-bookings' && currentView === 'payment');
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ClientView)}
                className={`p-3 rounded-lg transition-colors group relative ${
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
            className="relative group p-3 rounded-lg hover:bg-gray-100 transition-colors"
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
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sky-500">Flyblue</h1>
            <div className="text-sm text-gray-600">
              Bienvenido, {user.name}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {currentView === 'flights' && (
            <Flights
              onBookFlight={handleBookFlight}
            />
          )}
          {currentView === 'create-booking' && selectedFlightId && (
            <CreateBooking flightId={selectedFlightId} userId={user.id} onProceedToPayment={handleProceedToPayment} />
          )}
          {currentView === 'my-bookings' && (
            <MyBookings userId={user.id} />
          )}
          {currentView === 'payment' && selectedBookingId && (
            <CreatePayment bookingId={selectedBookingId} />
          )}
        </main>
      </div>
    </div>
  );
}
