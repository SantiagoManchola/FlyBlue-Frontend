import { Outlet, useNavigate, useLocation } from 'react-router';
import { Plane, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User } from '../App';

type ClientDashboardLayoutProps = {
  user: User;
  onLogout: () => void;
};

export default function ClientDashboardLayout({ user, onLogout }: ClientDashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'flights', icon: Plane, label: 'Reservar Vuelos', path: '/client/flights' },
    { id: 'my-bookings', icon: CheckCircle, label: 'Mis Reservas', path: '/client/my-bookings' },
  ];

  const isActive = (path: string) => {
    if (path === '/client/flights') {
      return location.pathname === path || 
             location.pathname.startsWith('/client/booking/') ||
             location.pathname.startsWith('/client/payment/');
    }
    return location.pathname === path;
  };

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
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`p-3 rounded-lg transition-colors group relative cursor-pointer ${
                  active ? 'bg-sky-500 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
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
            onClick={handleLogoutClick}
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
            <h1 className="text-sky-500 text-2xl font-bold">Flyblue</h1>
            <div className="text-sm text-gray-600">
              Bienvenido, {user.name}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
