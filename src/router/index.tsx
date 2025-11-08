import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../pages/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminDashboardLayout from "../pages/AdminDashboardLayout";
import ClientDashboardLayout from "../pages/ClientDashboardLayout";
import AdminFlightsPage from "../pages/admin/AdminFlightsPage";
import AdminFlightDetailPage from "../pages/admin/AdminFlightDetailPage";
import AdminCitiesPage from "../pages/admin/AdminCitiesPage";
import AdminLuggagePage from "../pages/admin/AdminLuggagePage";
import ClientFlightsPage from "../pages/client/ClientFlightsPage";
import ClientBookingPage from "../pages/client/ClientBookingPage";
import ClientPaymentPage from "../pages/client/ClientPaymentPage";
import ClientMyBookingsPage from "../pages/client/ClientMyBookingsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { User } from "../App";

type RouterConfig = {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
};

export const createAppRouter = ({ user, onLogin, onLogout }: RouterConfig) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: (
            <PublicRoute user={user}>
              <LoginPage onLogin={onLogin} />
            </PublicRoute>
          ),
        },
        {
          path: "register",
          element: (
            <PublicRoute user={user}>
              <RegisterPage onRegister={onLogin} />
            </PublicRoute>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute user={user} allowedRoles={['admin']}>
          <AdminDashboardLayout user={user!} onLogout={onLogout} />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/admin/flights" replace />,
        },
        {
          path: "flights",
          element: <AdminFlightsPage />,
        },
        {
          path: "flights/:flightId",
          element: <AdminFlightDetailPage />,
        },
        {
          path: "cities",
          element: <AdminCitiesPage />,
        },
        {
          path: "luggage",
          element: <AdminLuggagePage />,
        },
      ],
    },
    {
      path: "/client",
      element: (
        <ProtectedRoute user={user} allowedRoles={['client']}>
          <ClientDashboardLayout user={user!} onLogout={onLogout} />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/client/flights" replace />,
        },
        {
          path: "flights",
          element: <ClientFlightsPage />,
        },
        {
          path: "booking/:flightId",
          element: <ClientBookingPage userId={user?.id || ''} />,
        },
        {
          path: "payment/:bookingId",
          element: <ClientPaymentPage />,
        },
        {
          path: "my-bookings",
          element: <ClientMyBookingsPage userId={user?.id || ''} />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);
};