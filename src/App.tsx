import { useState, useMemo, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { createAppRouter } from './router';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al cargar la app
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          id: userData.id.toString(),
          name: userData.nombre,
          email: userData.correo,
          role: userData.rol === 'admin' ? 'admin' : 'client',
        });
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const router = useMemo(
    () => createAppRouter({ user, onLogin: handleLogin, onLogout: handleLogout }),
    [user]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
