import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../App';
import { authService } from '../services/authService';

type LoginProps = {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
};

const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Iiwicm9sIjoiYWRtaW4ifQ.9nTE9P9Yu3JZl5egMhPKrI3LqLUxQL_NsDZh1TDMH-U";

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        correo: email,
        contraseña: password,
      });

      // Validar si el token es exactamente igual al token de admin
      const storedToken = localStorage.getItem('token');
      const isAdmin = storedToken === ADMIN_TOKEN;

      // Mapear correctamente la respuesta
      const user: User = {
        id: response.id_usuario.toString(),
        name: response.nombre,
        email: response.correo,
        role: isAdmin ? "admin" : "client",
      };

      onLogin(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-sky-500 hover:bg-sky-600 cursor-pointer active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              disabled={isLoading}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
