import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../App';

type LoginProps = {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
};

export default function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app this would call an API
    const mockUser: User = {
      id: '1',
      name: email.includes('admin') ? 'Admin User' : 'Client User',
      email: email,
      role: email.includes('admin') ? 'admin' : 'client',
    };
    onLogin(mockUser);
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            />
          </div>
          <Button type="submit" className="w-full h-11 bg-sky-500 hover:bg-sky-600 cursor-pointer active:scale-95">
            Ingresar
          </Button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
