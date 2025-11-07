import { useState } from 'react';
import { Plane } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
};

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-sky-500 text-3xl">Flyblue</h1>
            </div>
            <p className="text-gray-600">Tu aerolínea de confianza</p>
          </div>
          {currentView === 'login' ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />
          ) : (
            <Register onRegister={handleLogin} onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {user.role === 'admin' ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <ClientDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
