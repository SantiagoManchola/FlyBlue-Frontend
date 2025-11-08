import { Outlet } from 'react-router';
import { Plane } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className='absolute -z-10 w-full h-full'>
        <img src="/images/bg-login.png" className='object-cover w-full h-full' alt="Background" />
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
        <Outlet />
      </div>
    </div>
  );
}
