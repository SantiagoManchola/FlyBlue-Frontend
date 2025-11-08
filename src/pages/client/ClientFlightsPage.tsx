import { useNavigate } from 'react-router';
import Flights from '../../components/client/Flights';

export default function ClientFlightsPage() {
  const navigate = useNavigate();

  const handleBookFlight = (flightId: string) => {
    navigate(`/client/booking/${flightId}`);
  };

  return <Flights onBookFlight={handleBookFlight} />;
}
