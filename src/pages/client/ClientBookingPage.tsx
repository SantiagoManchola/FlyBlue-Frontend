import { useParams, useNavigate } from 'react-router';
import CreateBooking from '../../components/client/CreateBooking';
import { useUser } from '../../hooks/useUser'; // ✅ Importar hook

type ClientBookingPageProps = {
  userId: string;
};

export default function ClientBookingPage({ userId }: ClientBookingPageProps) {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const user = useUser(); // ✅ Usar hook

  const handleProceedToPayment = (bookingData: any) => {
    sessionStorage.setItem('bookingData', JSON.stringify({
      ...bookingData,
      userId,
      userEmail: user?.email || '',
      timestamp: new Date().toISOString(),
    }));

    navigate(`/client/payment/${bookingData.flightId}`);
  };

  if (!flightId) {
    navigate('/client/flights');
    return null;
  }

  return (
    <CreateBooking 
      flightId={parseInt(flightId)} 
      userId={parseInt(userId)} 
      userName={user?.name || 'Cliente'} // ✅ Usar nombre del hook
      onProceedToPayment={handleProceedToPayment} 
    />
  );
}
