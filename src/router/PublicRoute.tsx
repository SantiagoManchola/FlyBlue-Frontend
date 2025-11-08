import { Navigate } from 'react-router';
import { User } from '../App';

type PublicRouteProps = {
  user: User | null;
  children: React.ReactNode;
};

export default function PublicRoute({ user, children }: PublicRouteProps) {
  if (user) {
    // Redirigir al dashboard correspondiente según el rol
    return <Navigate to={user.role === 'admin' ? '/admin/flights' : '/client/flights'} replace />;
  }

  return <>{children}</>;
}
