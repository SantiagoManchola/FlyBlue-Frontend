import { useNavigate } from 'react-router';
import Flights from '../../components/admin/Flights';

export default function AdminFlightsPage() {
  const navigate = useNavigate();

  const handleViewDetail = (flightId: string) => {
    navigate(`/admin/flights/${flightId}`);
  };

  return <Flights onViewDetail={handleViewDetail} />;
}
