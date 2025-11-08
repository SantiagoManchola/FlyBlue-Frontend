# Documentación del Router - FlyBlue Frontend

## 📋 Estructura de Rutas

### Rutas Públicas (No autenticadas)
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Rutas de Administrador (Rol: admin)
- `/admin` - Redirige a `/admin/flights`
- `/admin/flights` - Lista de vuelos
- `/admin/flights/:flightId` - Detalle de un vuelo específico
- `/admin/cities` - Gestión de ciudades
- `/admin/luggage` - Gestión de equipajes

### Rutas de Cliente (Rol: client)
- `/client` - Redirige a `/client/flights`
- `/client/flights` - Lista de vuelos disponibles para reservar
- `/client/booking/:flightId` - Crear una reserva para un vuelo
- `/client/payment/:bookingId` - Realizar el pago de una reserva
- `/client/my-bookings` - Ver mis reservas

## 🔒 Protección de Rutas

### PublicRoute
Componente que protege las rutas públicas (login/register). Si el usuario ya está autenticado, lo redirige a su dashboard correspondiente:
- Admin → `/admin/flights`
- Client → `/client/flights`

### ProtectedRoute
Componente que protege las rutas privadas. Si el usuario no está autenticado, lo redirige a `/login`. También verifica que el usuario tenga el rol adecuado para acceder a la ruta.

## 📁 Estructura de Archivos

```
src/
├── router/
│   ├── index.tsx              # Configuración principal del router
│   ├── ProtectedRoute.tsx     # HOC para rutas protegidas
│   └── PublicRoute.tsx        # HOC para rutas públicas
├── pages/
│   ├── AuthLayout.tsx         # Layout para login/register
│   ├── LoginPage.tsx          # Página de login
│   ├── RegisterPage.tsx       # Página de registro
│   ├── AdminDashboardLayout.tsx   # Layout del dashboard admin
│   ├── ClientDashboardLayout.tsx  # Layout del dashboard cliente
│   ├── admin/
│   │   ├── AdminFlightsPage.tsx       # Lista de vuelos (admin)
│   │   ├── AdminFlightDetailPage.tsx  # Detalle de vuelo (admin)
│   │   ├── AdminCitiesPage.tsx        # Gestión de ciudades
│   │   └── AdminLuggagePage.tsx       # Gestión de equipajes
│   └── client/
│       ├── ClientFlightsPage.tsx      # Lista de vuelos (cliente)
│       ├── ClientBookingPage.tsx      # Crear reserva
│       ├── ClientPaymentPage.tsx      # Pago de reserva
│       └── ClientMyBookingsPage.tsx   # Mis reservas
└── components/
    └── layout/
        └── LayoutDashboard.tsx    # Layout compartido para dashboards
```

## 🔄 Flujo de Navegación

### Flujo de Autenticación
```
Usuario no autenticado
    ↓
/login (o /register)
    ↓
Login exitoso
    ↓
Admin → /admin/flights
Client → /client/flights
```

### Flujo de Administrador
```
/admin/flights
    ↓
Clic en "Ver detalle"
    ↓
/admin/flights/:flightId
    ↓
Botón "Volver"
    ↓
/admin/flights
```

### Flujo de Cliente - Reserva
```
/client/flights
    ↓
Clic en "Reservar"
    ↓
/client/booking/:flightId
    ↓
Completar formulario
    ↓
/client/payment/:bookingId
    ↓
Pago exitoso
    ↓
/client/my-bookings
```

## 💡 Uso del Router

### En App.tsx
```tsx
import { createAppRouter } from './router';

const router = useMemo(
  () => createAppRouter({ 
    user, 
    onLogin: handleLogin, 
    onLogout: handleLogout 
  }),
  [user]
);

return <RouterProvider router={router} />;
```

### Navegación Programática
```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

// Navegar a una ruta
navigate('/admin/flights');

// Navegar con reemplazo de historial
navigate('/login', { replace: true });

// Navegar hacia atrás
navigate(-1);
```

### Obtener Parámetros de URL
```tsx
import { useParams } from 'react-router';

const { flightId } = useParams<{ flightId: string }>();
```

### Obtener Ruta Actual
```tsx
import { useLocation } from 'react-router';

const location = useLocation();
const currentPath = location.pathname;
```

## 🎯 Ventajas de esta Implementación

1. **Separación de Responsabilidades**: Cada página es un componente independiente
2. **Rutas Protegidas**: Control de acceso basado en autenticación y roles
3. **Navegación Declarativa**: URLs limpias y semánticas
4. **Type Safety**: Uso de TypeScript para parámetros de rutas
5. **Código Reutilizable**: Layouts compartidos entre diferentes vistas
6. **Fácil Mantenimiento**: Estructura organizada y escalable

## 🔧 Personalización

### Agregar una Nueva Ruta de Administrador
1. Crear componente en `src/pages/admin/NuevaPagina.tsx`
2. Importar en `src/router/index.tsx`
3. Agregar ruta en el objeto de rutas `/admin`
4. Opcionalmente agregar ítem al sidebar en `AdminDashboardLayout.tsx`

### Agregar una Nueva Ruta de Cliente
1. Crear componente en `src/pages/client/NuevaPagina.tsx`
2. Importar en `src/router/index.tsx`
3. Agregar ruta en el objeto de rutas `/client`
4. Opcionalmente agregar ítem al sidebar en `ClientDashboardLayout.tsx`
