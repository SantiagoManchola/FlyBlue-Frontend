import { Outlet, useNavigate, useLocation } from 'react-router';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import { User } from '../App';
import LayoutDashboard from '../components/layout/LayoutDashboard';

type AdminDashboardLayoutProps = {
  user: User;
  onLogout: () => void;
};

export default function AdminDashboardLayout({ user, onLogout }: AdminDashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'flights', icon: Calendar, label: 'Vuelos', path: '/admin/flights' },
    { id: 'cities', icon: MapPin, label: 'Ciudades', path: '/admin/cities' },
    { id: 'luggage', icon: Briefcase, label: 'Equipajes', path: '/admin/luggage' },
  ];

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

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
  );
}
