import { useNavigate } from 'react-router';
import Login from '../components/Login';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

// Función para decodificar JWT
const decodeToken = (token: string): { sub: string; rol: string } | null => {
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
    onLogin(user);
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded?.rol === "admin") {
        navigate('/admin/flights'); 
      } else {
        navigate('/client/flights');
      }
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}
