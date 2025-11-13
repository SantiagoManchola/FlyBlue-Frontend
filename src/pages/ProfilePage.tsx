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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 p-8">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
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
            <div className="h-32 bg-gradient-to-r from-sky-500 to-sky-600"></div>

            {/* Contenido */}
            <div className="px-8 pb-8">
              {/* Avatar y nombre (superpuesto) */}
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-16 h-16 text-sky-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {userData.nombre}
                  </h1>
                  <p className="text-gray-500 text-lg">Cuenta de usuario</p>
                </div>
              </div>

              {/* Grid de información */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Email */}
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Correo Electrónico
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 break-all">
                    {userData.correo}
                  </p>
                </div>

                {/* ID Usuario */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-purple-600" />
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
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">💡 Tip:</span> Asegúrate de mantener tu información de cuenta segura y actualizada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}