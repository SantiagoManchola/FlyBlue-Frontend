import { useNavigate } from 'react-router';
import Register from '../components/Register';
import { User } from '../App';

type RegisterPageProps = {
  onRegister: (user: User) => void;
};

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();

  const handleRegister = (user: User) => {
    onRegister(user);
    // Redirigir según el rol
    navigate(user.role === 'admin' ? '/admin/flights' : '/client/flights');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return <Register onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />;
}
