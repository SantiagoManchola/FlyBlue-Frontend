import { useState } from 'react';
import { Plane } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import bgLogin from '/images/bg-login.png'

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
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className='absolute -z-10 w-full h-full'>
          <img src={bgLogin} className='object-cover w-full h-full' />
        </div>
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <Plane className="w-7 h-7 text-sky-500" />
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
