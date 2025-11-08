import { Navigate } from 'react-router';
import { User } from '../App';

type ProtectedRouteProps = {
  user: User | null;
  allowedRoles?: ('admin' | 'client')[];
  children: React.ReactNode;
};

export default function ProtectedRoute({ user, allowedRoles, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigir al dashboard correspondiente según el rol
    return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  }

  return <>{children}</>;
}
