import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User } from '../App';

type RegisterProps = {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
};

export default function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register - in real app this would call an API
    const newUser: User = {
      id: Math.random().toString(),
      name,
      email,
      role,
    };
    onRegister(newUser);
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>Regístrate para comenzar a volar con Flyblue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Nombre Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              required
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-700">Tipo de Usuario</Label>
            <Select value={role} onValueChange={(value: 'admin' | 'client') => setRole(value)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full h-11 bg-sky-500 hover:bg-sky-600">
            Registrarse
          </Button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
