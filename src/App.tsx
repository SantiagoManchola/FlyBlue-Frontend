import { useState, useMemo } from 'react';
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

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const router = useMemo(
    () => createAppRouter({ user, onLogin: handleLogin, onLogout: handleLogout }),
    [user]
  );

  return <RouterProvider router={router} />;
}
