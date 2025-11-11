# Documentación de los servicios (src/services)

Este documento describe los servicios centralizados en `src/services`:
- `adminService.ts`
- `authService.ts`
- `clientService.ts`

Incluye: propósito, funciones exportadas, tipos usados, manejo de errores y recomendaciones.

---

## Índice
- [adminService](#adminservice)
- [authService](#authservice)
- [clientService](#clientservice)

---

## adminService

**Propósito:**  
Centraliza las operaciones administrativas sobre ciudades, vuelos y equipajes. Proporciona una capa de abstracción sobre las APIs correspondientes y manejo de errores unificado.

**Funciones exportadas:**
- `crearCiudad(data: CiudadRequest)`
- `obtenerCiudades()`
- `crearVuelo(data: VueloRequest)`
- `obtenerVueloPorId(id_vuelo: number)`
- `buscarVuelos()`
- `crearEquipaje(data: EquipajeRequest)`
- `obtenerEquipajes()`

**Tipos importados:**  
- `CiudadRequest`: datos para crear ciudad
- `VueloRequest`: datos para crear vuelo
- `EquipajeRequest`: datos para crear equipaje

**Manejo de errores:**  
- Implementa try/catch en cada operación
- Loguea errores con `console.error`
- Preserva el stack trace al relanzar errores
- Mensajes de error específicos por operación

**Características:**
- Importa y utiliza APIs modulares de `admin/`
- Manejo de errores consistente
- Tipado estricto en todas las operaciones
- Retorna datos sin transformación adicional

**Recomendaciones:**  
- Implementar caché para operaciones de lectura frecuente
- Añadir validaciones de datos pre-request
- Considerar retry para operaciones críticas
- Agregar mensajes de error más descriptivos
- Si se agregan nuevas entidades, definir sus tipos en `types.ts`.

---

## authService

**Propósito:**  
Centraliza las operaciones de autenticación y gestión de sesión. Maneja el ciclo de vida completo de la autenticación: registro, login, perfil y logout.

**Funciones exportadas:**
- `registrar(data: RegistroRequest)`: registra nuevo usuario
- `login(data: LoginRequest)`: autentica usuario y gestiona token
- `obtenerPerfil()`: obtiene datos del usuario actual
- `logout()`: cierra sesión y limpia datos

**Tipos importados:**  
- `RegistroRequest`: datos de registro de usuario
- `LoginRequest`: credenciales de inicio de sesión

**Manejo de errores:**  
- Try/catch en todas las operaciones asíncronas
- Logging específico por tipo de error
- Preservación de stack trace
- Manejo consistente de errores de red

**Características especiales:**
- Gestión automática del token JWT:
  - Almacenamiento en `localStorage` tras login exitoso
  - Limpieza en logout
- Logueo detallado de errores
- Tipado estricto en todas las operaciones
- Manejo de estado de autenticación

**Recomendaciones:**  
- Implementar refresh token
- Añadir validación de token expirado
- Considerar almacenamiento seguro para el token
- Agregar eventos de cambio de estado de autenticación
- Implementar timeout en operaciones de red
- Si el backend cambia la estructura, actualizar los tipos y la lógica de guardado del token.

---

## clientService

**Propósito:**  
Centraliza las operaciones del cliente relacionadas con reservas y pagos. Proporciona una interfaz unificada para la gestión de reservas y su procesamiento de pago.

**Funciones exportadas:**
- `crearReserva(data: ReservaRequest)`: crea nueva reserva
- `obtenerReservas(id_usuario: number)`: lista reservas del usuario
- `procesarPago(reservaId: number, data: any)`: procesa pago de reserva

**Tipos definidos:**  
- `ReservaRequest`: datos para crear reserva
- Pendiente: definir `PagoRequest` para el parámetro `data` de `procesarPago`

**Manejo de errores:**  
- Try/catch en todas las operaciones
- Logging específico por operación:
  - "Error al crear reserva"
  - "Error al obtener reservas"
  - "Error al procesar pago"
- Preservación de stack trace

**Características:**
- Integración con APIs de reservas y pagos
- Manejo de errores consistente
- Tipado parcial (pendiente en pagos)
- Operaciones asíncronas con async/await

**Recomendaciones:**  
- Definir tipo `PagoRequest` para datos de pago
- Implementar validaciones pre-request
- Añadir retry para operaciones de pago
- Considerar timeout en operaciones críticas
- Implementar confirmación de operaciones
- Agregar manejo de estado de transacción
- Mantener los tipos centralizados para facilitar el mantenimiento y la reutilización.

---

## Recomendaciones generales

1. **Gestión de tipos**
   - Definir todos los tipos en `src/api/types.ts`
   - Eliminar uso de `any` en `procesarPago`
   - Documentar interfaces y tipos
   - Mantener consistencia en nombrado

2. **Manejo de errores**
   - Crear wrapper común para manejo de errores
   - Implementar retry en operaciones críticas
   - Añadir timeout en operaciones de red
   - Mejorar mensajes de error
   - Considerar log centralizado

3. **Seguridad**
   - Implementar refresh token
   - Mejorar almacenamiento de token
   - Sanitizar datos sensibles
   - Validar permisos por operación
   - Implementar logout en errores de auth

4. **Optimización**
   - Implementar caché donde sea apropiado
   - Agregar cancelación de requests
   - Considerar batch operations
   - Optimizar re-renders

5. **Estado y caché**
   - Considerar usar React Query o SWR
   - Implementar caché local
   - Gestionar estado de loading
   - Manejar revalidación

6. **Testing**
   - Crear tests unitarios
   - Implementar tests de integración
   - Mockear llamadas API
   - Probar manejo de errores

7. **Monitoreo**
   - Agregar telemetría
   - Implementar logging estructurado
   - Monitorear performance
   - Trackear errores

8. **Documentación**
   - Mantener JSDoc actualizado
   - Documentar efectos secundarios
   - Agregar ejemplos de uso
   - Documentar errores conocidos
   - Documentar efectos secundarios (ej: guardado en localStorage)