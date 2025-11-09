import { Outlet, useNavigate, useLocation } from 'react-router';
import { PlaneTakeoff, CheckCircle } from 'lucide-react';
import { User } from '../App';
import LayoutDashboard from '@/components/layout/LayoutDashboard';

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
    { id: 'flights', icon: PlaneTakeoff, label: 'Reservar Vuelos', path: '/client/flights' },
    { id: 'my-bookings', icon: CheckCircle, label: 'Mis Reservas', path: '/client/my-bookings' },
  ];

  return (
    <LayoutDashboard
      user={user}
      onLogout={handleLogoutClick}
      sidebarItems={sidebarItems}
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <Outlet />
    </LayoutDashboard> 
  )
}
