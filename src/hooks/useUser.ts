import { useState, useEffect } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
};

export const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          id: userData.id.toString(),
          name: userData.nombre,
          email: userData.correo,
          role: userData.rol === 'admin' ? 'admin' : 'client',
        });
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        setUser(null);
      }
    }
  }, []);

  return user;
};