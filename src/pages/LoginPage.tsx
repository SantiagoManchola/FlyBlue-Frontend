import { useNavigate } from 'react-router';
import Login from '../components/Login';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    onLogin(user);
    // Redirigir según el rol
    navigate(user.role === 'admin' ? '/admin/flights' : '/client/flights');
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}
