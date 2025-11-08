import MyBookings from '../../components/client/MyBookings';

type ClientMyBookingsPageProps = {
  userId: string;
};

export default function ClientMyBookingsPage({ userId }: ClientMyBookingsPageProps) {
  return <MyBookings userId={userId} />;
}
