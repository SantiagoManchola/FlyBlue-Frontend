import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, User, Shield, Loader } from 'lucide-react';
import { authService } from '@/services/authService';
import { UsuarioResponse } from '@/api/types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'client'>('client');

  useEffect(() => {
    // Obtener rol del usuario almacenado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserRole(userData.rol === 'admin' ? 'admin' : 'client');
      } catch (error) {
        console.error('Error al obtener rol:', error);
      }
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await authService.obtenerPerfil();
        console.log('✅ Perfil obtenido:', data);
        setUserData(data);
      } catch (err: any) {
        console.error('❌ Error al obtener perfil:', err);
        setError(err.response?.data?.detail || err.message || 'Error al cargar perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const bannerColor = userRole === 'admin' 
    ? 'from-purple-500 to-purple-600' 
    : 'from-sky-500 to-sky-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${userRole === 'admin' ? 'from-purple-50 via-white to-purple-50' : 'from-sky-50 via-white to-sky-50'} p-8`}>
      {/* Header con botón de volver */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 px-4 py-2 ${userRole === 'admin' ? 'text-purple-600 hover:bg-purple-100' : 'text-sky-600 hover:bg-sky-100'} rounded-lg transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {userData && (
        <div className="max-w-2xl mx-auto">
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Banner decorativo */}
            <div className={`h-32 bg-gradient-to-r ${bannerColor}`}></div>

            {/* Contenido */}
            <div className="px-8 pb-8">
              {/* Avatar y nombre */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-8 mb-8">
                <div className={`w-32 h-32 rounded-2xl ${userRole === 'admin' ? 'bg-gradient-to-br from-purple-100 to-purple-200' : 'bg-gradient-to-br from-sky-100 to-sky-200'} border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0`}>
                  <User className={`w-16 h-16 ${userRole === 'admin' ? 'text-purple-600' : 'text-sky-600'}`} />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {userData.nombre}
                  </h1>
                  <p className={`text-lg ${userRole === 'admin' ? 'text-purple-600' : 'text-gray-500'}`}>
                    {userRole === 'admin' ? 'Cuenta de administrador' : 'Cuenta de cliente'}
                  </p>
                </div>
              </div>

              {/* Grid de información */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Email */}
                <div className={`bg-gradient-to-br ${userRole === 'admin' ? 'from-purple-50 to-purple-100 border-purple-200' : 'from-sky-50 to-sky-100 border-sky-200'} rounded-xl p-6 border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className={`w-5 h-5 ${userRole === 'admin' ? 'text-purple-600' : 'text-sky-600'}`} />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Correo Electrónico
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 break-all">
                    {userData.correo}
                  </p>
                </div>

                {/* ID Usuario */}
                <div className={`bg-gradient-to-br ${userRole === 'admin' ? 'from-indigo-50 to-indigo-100 border-indigo-200' : 'from-purple-50 to-purple-100 border-purple-200'} rounded-xl p-6 border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className={`w-5 h-5 ${userRole === 'admin' ? 'text-indigo-600' : 'text-purple-600'}`} />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      ID de Usuario
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">
                    #{userData.id_usuario}
                  </p>
                </div>
              </div>

              {/* Sección adicional */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Estado de Cuenta
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className="font-semibold text-green-600">✓ Activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota de seguridad */}
          <div className={`mt-8 p-4 ${userRole === 'admin' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
            <p className={`text-sm ${userRole === 'admin' ? 'text-purple-700' : 'text-blue-700'}`}>
              <span className="font-semibold">💡 Tip:</span> Asegúrate de mantener tu información de cuenta segura y actualizada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}