import { useParams, useNavigate } from 'react-router';
import CreatePayment from '../../components/client/CreatePayment';

export default function ClientPaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  if (!bookingId) {
    navigate('/client/flights');
    return null;
  }

  return <CreatePayment bookingId={bookingId} />;
}
