import { useParams, useNavigate } from 'react-router';
import CreateBooking from '../../components/client/CreateBooking';

type ClientBookingPageProps = {
  userId: string;
};

export default function ClientBookingPage({ userId }: ClientBookingPageProps) {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();

  const handleProceedToPayment = (bookingData: { 
    flightId: string; 
    seat: string; 
    luggage: string; 
    totalPrice: number 
  }) => {
    // Navegar a la página de pago
    navigate(`/client/payment/${bookingData.flightId}`);
  };

  if (!flightId) {
    navigate('/client/flights');
    return null;
  }

  return (
    <CreateBooking 
      flightId={flightId} 
      userId={userId} 
      onProceedToPayment={handleProceedToPayment} 
    />
  );
}
