import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import FlightDetail from '../../components/admin/FlightDetail';

export default function AdminFlightDetailPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin/flights');
  };

  if (!flightId) {
    navigate('/admin/flights');
    return null;
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Vuelos
      </Button>
      <FlightDetail flightId={flightId} />
    </div>
  );
}
