import { useNavigate } from 'react-router';
import Login from '../components/Login';
import { User } from '../App';

type LoginPageProps = {
  onLogin: (user: User) => void;
};

const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Iiwicm9sIjoiYWRtaW4ifQ.9nTE9P9Yu3JZl5egMhPKrI3LqLUxQL_NsDZh1TDMH-U";

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    onLogin(user);
    const storedToken = localStorage.getItem('token');
    
    if (storedToken == ADMIN_TOKEN) {
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
