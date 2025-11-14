import { useNavigate } from 'react-router';
import Login from '../components/Login';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    onLogin(user);
    const storedToken = localStorage.getItem('token');
    
    if (storedToken === ADMIN_TOKEN) {
      navigate('/admin/flights'); 
    } else {
      navigate('/client/flights');
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />;
}
