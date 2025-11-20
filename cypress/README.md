# Cypress Testing

Este proyecto incluye pruebas End-to-End (E2E) con Cypress para garantizar el correcto funcionamiento de la aplicación.

## 📁 Estructura de Pruebas

```
cypress/
├── e2e/                    # Tests E2E organizados por módulo
│   ├── auth/              # Tests de autenticación
│   │   ├── login.cy.ts
│   │   ├── register.cy.ts
│   │   └── protected-routes.cy.ts
│   ├── client/            # Tests del módulo cliente
│   │   ├── flights.cy.ts
│   │   ├── bookings.cy.ts
│   │   ├── my-bookings.cy.ts
│   │   └── payments.cy.ts
│   └── admin/             # Tests del módulo admin
│       ├── flights.cy.ts
│       ├── cities.cy.ts
│       └── luggage.cy.ts
├── fixtures/              # Datos de prueba mock
│   ├── ciudades.json
│   ├── vuelos.json
│   ├── equipajes.json
│   ├── reservas.json
│   ├── admin-user.json
│   └── client-user.json
└── support/               # Comandos y configuración
    ├── commands.ts        # Comandos personalizados
    └── e2e.ts            # Configuración global

```

## 🚀 Comandos Disponibles

### Modo Interactivo (Desarrollo)
```bash
# Abrir Cypress en modo interactivo
pnpm cypress:open
```

### Modo Headless (CI/CD)
```bash
# Ejecutar todos los tests
pnpm test:e2e

# Ejecutar tests con UI visible
pnpm test:e2e:headed

# Ejecutar en navegadores específicos
pnpm cypress:run:chrome
pnpm cypress:run:firefox
pnpm cypress:run:edge

# Para CI/CD
pnpm test:e2e:ci
```

## 🛠️ Comandos Personalizados

### Autenticación
```typescript
// Login con credenciales
cy.login('user@example.com', 'password')

// Login como administrador
cy.loginAsAdmin()

// Login como cliente
cy.loginAsClient()
```

### Mocks de API
```typescript
// Configurar todos los mocks
cy.setupApiMocks()

// Mock personalizado
cy.mockApiCall('GET', '/api/vuelos', { fixture: 'vuelos.json' })
```

### Selectores
```typescript
// Obtener elemento por data-testid
cy.getByTestId('submit-button')
```

## 📝 Fixtures Disponibles

### Ciudades (`ciudades.json`)
Contiene 6 ciudades de ejemplo con sus códigos IATA.

### Vuelos (`vuelos.json`)
Incluye 3 vuelos de ejemplo con diferentes rutas y precios.

### Equipajes (`equipajes.json`)
Define 3 tipos de equipaje con precios y pesos máximos.

### Reservas (`reservas.json`)
Contiene 2 reservas de ejemplo con diferentes estados.

### Usuarios
- `admin-user.json`: Usuario administrador
- `client-user.json`: Usuario cliente

## 🧪 Estrategias de Testing

### 1. Tests sin Backend (Recomendado para desarrollo)

Los tests están configurados para funcionar con mocks de API usando `cy.intercept()`. Esto permite:
- ✅ Desarrollar tests antes de tener el backend listo
- ✅ Tests más rápidos y predecibles
- ✅ Control total sobre las respuestas de la API
- ✅ Simular casos edge y errores fácilmente

### 2. Tests con Backend Real

Cuando el backend esté disponible, puedes cambiar a usar la API real:

1. Actualizar `.env.test`:
```env
VITE_USE_API_MOCKS=false
VITE_API_URL=http://localhost:3000/api
```

2. Comentar los `cy.intercept()` en los tests
3. Asegurar que el backend esté corriendo antes de ejecutar los tests

## 📋 Cobertura de Tests

### Módulo de Autenticación
- ✅ Login con credenciales válidas/inválidas
- ✅ Registro de nuevos usuarios
- ✅ Validación de formularios
- ✅ Protección de rutas
- ✅ Roles de usuario (admin/cliente)
- ✅ Cerrar sesión

### Módulo Cliente
- ✅ Búsqueda de vuelos
- ✅ Filtros por origen/destino/fecha
- ✅ Ver detalles de vuelo
- ✅ Crear reservas
- ✅ Selección de asientos
- ✅ Agregar equipaje
- ✅ Ver mis reservas
- ✅ Cancelar reservas
- ✅ Procesar pagos
- ✅ Validación de tarjetas

### Módulo Admin
- ✅ CRUD de vuelos
- ✅ CRUD de ciudades
- ✅ CRUD de equipajes
- ✅ Validaciones de formularios
- ✅ Filtros y búsquedas
- ✅ Gestión de estados

## 🎯 Mejores Prácticas

1. **Usar fixtures para datos**: Mantener datos de prueba consistentes
2. **Comandos reutilizables**: Crear comandos para flujos comunes
3. **Mocks de API**: Interceptar llamadas para control total
4. **Selectores semánticos**: Preferir `data-testid` sobre clases CSS
5. **Tests independientes**: Cada test debe poder ejecutarse solo
6. **Limpieza de estado**: Usar `beforeEach` para limpiar localStorage/cookies

## 🐛 Debugging

### Ver tests ejecutándose
```bash
pnpm test:e2e:headed
```

### Abrir Cypress DevTools
En modo interactivo, usa la interfaz gráfica para:
- Ver cada paso del test
- Inspeccionar elementos
- Ver requests de red
- Time-travel debugging

### Screenshots y Videos
Los screenshots se guardan automáticamente en `cypress/screenshots/` cuando un test falla.

## 🔧 Configuración

La configuración principal está en `cypress.config.ts`:

```typescript
{
  baseUrl: 'http://localhost:5173',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000
}
```

## 📚 Recursos

- [Documentación de Cypress](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Mejores prácticas de Cypress](https://docs.cypress.io/guides/references/best-practices)

## ✨ Próximos Pasos

1. Ejecutar la aplicación: `pnpm dev`
2. Abrir Cypress: `pnpm cypress:open`
3. Ejecutar los tests uno por uno para familiarizarte
4. Agregar `data-testid` a tus componentes para mejorar los selectores
5. Cuando el backend esté listo, cambiar a modo de API real

---

**Nota**: Los tests están diseñados para ser flexibles. Algunos selectores pueden necesitar ajustes según tu implementación exacta de la UI.
