import { useNavigate } from 'react-router';
import Login from '../components/Login';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

// ✅ Función para decodificar JWT
const decodeToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decodedPayload;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    // ✅ PASO 1: Obtener el token del localStorage (ya está guardado por authService.login)
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      // ✅ PASO 2: Decodificar el token para obtener el rol
      const decoded = decodeToken(storedToken);
      const rol = decoded?.rol || 'client';
      
      // ✅ PASO 3: Actualizar el usuario con el rol correcto
      const userWithRole: User = {
        ...user,
        role: rol === 'admin' ? 'admin' : 'client',
      };
      
      // ✅ PASO 4: Llamar onLogin con el usuario actualizado
      onLogin(userWithRole);
      
      // ✅ PASO 5: Redirigir según el rol
      if (rol === 'admin') {
        navigate('/admin/flights');
      } else {
        navigate('/client/flights');
      }
    } else {
      console.error('No se encontró token');
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}
