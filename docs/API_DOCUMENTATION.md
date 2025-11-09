# Documentación de las APIs (src/api)

Este documento describe los archivos bajo `src/api/config`, `src/api/auth`, `src/api/client` y `src/api/admin`.
Incluye: propósito, funciones exportadas, parámetros esperados, valores de retorno, comportamiento ante errores y recomendaciones.

---

## Índice
- `src/api/config/endpoints.ts`
- `src/api/config/axiosInstance.ts`
- `src/api/auth/auth.api.ts`
- `src/api/client/reservas.api.ts`
- `src/api/client/pagos.api.ts`
- `src/api/admin/vuelos.api.ts`
- `src/api/admin/equipajes.api.ts`
- `src/api/admin/ciudades.api.ts`

---

## `src/api/config/endpoints.ts`

Propósito
- Centralizar las rutas/paths de la API en un único objeto `ENDPOINTS`.

Contenido (resumen)
- Constante exportada `ENDPOINTS` con subobjetos: `AUTH`, `ADMIN`, `CLIENT`, `PUBLIC`.

Funciones / rutas más importantes
- `AUTH.REGISTER` -> `/auth/register`
- `AUTH.LOGIN` -> `/auth/login`
- `AUTH.PROFILE` -> `/auth/me`
- `ADMIN.CREATE_CIUDAD` -> `/admin/ciudades`
- `ADMIN.CREATE_EQUIPAJE` -> `/admin/equipajes`
- `ADMIN.CREATE_VUELO` -> `/admin/vuelos`
- `CLIENT.CREATE_RESERVA` -> `/cliente/reservas`
- `CLIENT.GET_RESERVAS_BY_USER(id_usuario)` -> `/cliente/reservas/{id_usuario}`
- `CLIENT.PAGAR_RESERVA(reserva_id)` -> `/cliente/reservas/{reserva_id}/pago`
- `PUBLIC.GET_VUELO_BY_ID(id_vuelo)` -> `/vuelos/{id_vuelo}`
- `PUBLIC.GET_ASIENTOS_BY_VUELO(id_vuelo)` -> `/{id_vuelo}/asientos`  ← Atención (ver nota)
- `PUBLIC.GET_EQUIPAJES` -> `/equipajes`
- `PUBLIC.GET_CIUDADES` -> `/ciudades`
- `PUBLIC.GET_VUELOS` -> `/vuelos`

Nota importante
- El endpoint `GET_ASIENTOS_BY_VUELO` actualmente está definido como `/{id_vuelo}/asientos`.
  Esto probablemente es un error porque las demás rutas de vuelos están bajo `/vuelos`. Si la API backend espera `/vuelos/{id}/asientos`, la ruta actual provocará 404. Recomiendo corregir a `/vuelos/${id_vuelo}/asientos`.

Recomendaciones
- Mantener el patrón `/vuelos/...` para todas las rutas relacionadas con vuelos.
- Normalizar el uso de `number | string` en las firmas para coherencia.

---

## `src/api/config/axiosInstance.ts`

Propósito
- Crear una instancia de Axios con `baseURL` y configurar un interceptor para añadir el token de autenticación desde `localStorage`.

Comportamiento actual
- `baseURL` = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/v1`.
- Header por defecto: `Content-Type: application/json`.
- Interceptor request: obtiene `token` desde `localStorage.getItem("token")` y, si existe, añade `Authorization: Bearer ${token}` a `config.headers`.

Notas y recomendaciones
- Atención al valor de `VITE_API_URL`: normalizar si contiene slash final para evitar `//v1` duplicados.
- Actualmente se hace `if (!config.headers) config.headers = {} as any; (config.headers as any).Authorization = ...`.
  - Esto es correcto y compatible, pero si se busca mayor tipado, se puede crear un helper que mergee `AxiosRequestConfig['headers']` preservando métodos de `AxiosHeaders`.
  - Centralizar la clave del token (`"token"`) en una constante o en `authService`.
- Considerar manejo de refresh token si la API lo soporta.

---

## `src/api/auth/auth.api.ts`

Exportados
- `registrarUsuario(data: RegistroRequest)`
- `loginUsuario(data: LoginRequest)`
- `obtenerPerfil()`

Comportamiento
- Cada función hace una llamada con la instancia `api` y retorna `res.data`.
- Las funciones utilizan tipos definidos en `src/api/types.ts`

Parámetros y retornos
- Tipos implementados:
  - `RegistroRequest`: datos de registro
  - `LoginRequest`: credenciales de login

Errores
- No hay manejo explícito de errores (se propaga el error de axios). Si la UI no captura `.catch`, se puede añadir un wrapper o `try/catch` para normalizar el error.

Ejemplo de uso
```
const user = await loginUsuario({ email: 'a@a.com', password: '1234' });
```

Recomendaciones
- Tipar entradas/salidas.
- Después del `loginUsuario`, confirmar que el `token` que regresa (si lo hace) se guarda en `localStorage.setItem('token', token)` para que el interceptor lo use.

---

## `src/api/client/reservas.api.ts`

Exportados
- `crearReserva(data: ReservaRequest)`
- `obtenerReservas(id_usuario: number)`

Comportamiento
- `crearReserva` hace `POST` a `ENDPOINTS.CLIENT.CREATE_RESERVA` con `data`
- `obtenerReservas` hace `GET` a `ENDPOINTS.CLIENT.GET_RESERVAS_BY_USER(id_usuario)`
- Las funciones usan tipos definidos en `src/api/types.ts`

Recomendaciones
- Aceptar `id_usuario: number | string` para concordar con `ENDPOINTS`
- Añadir manejo/normalización de errores si la UI lo necesita
- Considerar validaciones de datos antes de las llamadas

---

## `src/api/client/pagos.api.ts`

Exportados
- `procesarPago(reservaId: number, data: any)`

Comportamiento
- Hace `POST` a `ENDPOINTS.CLIENT.PAGAR_RESERVA(reservaId)` con `data`
- El parámetro `data` aún está tipado como `any`

Recomendaciones
- Definir tipo `PagoRequest` en `types.ts` para el parámetro `data`
- Definir tipo `PagoResponse` para el resultado
- Validar `reservaId` antes de la llamada
- Implementar manejo de errores específico para pagos
- Considerar retry en caso de fallos de red

---

## `src/api/admin/vuelos.api.ts`

Exportados
- `crearVuelo(data: VueloRequest)`
- `obtenerVueloPorId(id_vuelo: number)`
- `buscarVuelos()`

Comportamiento
- `crearVuelo`: `POST` a `ENDPOINTS.ADMIN.CREATE_VUELO`
- `obtenerVueloPorId`: `GET` a `ENDPOINTS.PUBLIC.GET_VUELO_BY_ID`
- `buscarVuelos`: `GET` a `ENDPOINTS.PUBLIC.GET_VUELOS`
- Usa tipos definidos en `src/api/types.ts`

Recomendaciones
- Considerar paginación para `buscarVuelos`
- Implementar filtros de búsqueda
- Si se necesita subir archivos, usar `FormData`
- Añadir validaciones de datos
- Implementar caché para vuelos frecuentemente consultados

---

## `src/api/admin/equipajes.api.ts`

Exportados
- `crearEquipaje(data: EquipajeRequest)`
- `obtenerEquipajes()`

Observaciones
- Utiliza `EquipajeRequest` definido en `src/api/types.ts`
- Las funciones retornan la respuesta de la API directamente

Recomendaciones
- Implementar validaciones de datos de entrada
- Considerar manejo de errores específicos para equipaje
- Documentar estructura de respuesta esperada

---

## `src/api/admin/ciudades.api.ts`

Exportados
- `crearCiudad(data: CiudadRequest)`
- `obtenerCiudades()`

Observaciones
- Utiliza tipos definidos en `src/api/types.ts`
- Las funciones devuelven `res.data` sin transformación adicional

Recomendaciones
- Considerar validaciones de datos de entrada
- Agregar manejo de errores específicos
- Implementar caché para `obtenerCiudades` si se usa frecuentemente

---

## Recomendaciones generales y próximos pasos

1. **Tipado y Validación**
   - Completar tipos faltantes (especialmente en `pagos.api.ts`)
   - Implementar validaciones de datos de entrada
   - Centralizar tipos comunes en `types.ts`

2. **Manejo de Errores**
   - Crear wrapper de requests para manejo uniforme
   - Definir estructura de error común: `{ ok: boolean, data?: T, error?: ApiError }`
   - Implementar retry para operaciones críticas
   - Añadir logging consistente

3. **Optimización**
   - Implementar caché para datos frecuentemente usados
   - Considerar paginación en listados
   - Añadir timeout para requests largos
   - Implementar cancelación de requests

4. **Testing**
   - Añadir tests unitarios con mock de `axios`
   - Crear casos de prueba para errores comunes
   - Implementar tests de integración
   - Documentar casos de prueba

5. **Seguridad**
   - Revisar manejo de tokens
   - Implementar refresh token
   - Sanitizar datos sensibles
   - Validar permisos por ruta

6. **Documentación**
   - Mantener tipos actualizados
   - Documentar errores específicos
   - Agregar ejemplos de uso
   - Documentar estructuras de respuesta

---


