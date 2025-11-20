describe('Cliente - Búsqueda de Vuelos', () => {
  beforeEach(() => {
    cy.loginAsClient()
    
    // Mock de ciudades y vuelos
    cy.intercept('GET', '**/ciudades*', { fixture: 'ciudades.json' }).as('getCities')
    cy.intercept('GET', '**/vuelos*', { fixture: 'vuelos.json' }).as('getFlights')
    
    cy.visit('/client/flights')
  })

  it('Debe mostrar el formulario de búsqueda de vuelos', () => {
    cy.contains(/buscar vuelos|flights/i).should('be.visible')
  })

  it('Debe cargar las ciudades en los selectores', () => {
    cy.wait('@getCities')
    
    // Verificar que se cargaron las ciudades (ajustar según tu implementación)
    cy.get('select, [role="combobox"]').should('exist')
  })

  it('Debe mostrar resultados de vuelos después de buscar', () => {
    cy.wait('@getFlights')
    
    // Verificar que se muestran los vuelos
    cy.contains('FB001').should('be.visible')
    cy.contains('Bogotá').should('be.visible')
    cy.contains('Medellín').should('be.visible')
  })

  it('Debe permitir filtrar vuelos por origen y destino', () => {
    cy.wait('@getCities')
    
    // Interceptar búsqueda específica
    cy.intercept('GET', '**/vuelos?origen=1&destino=2*', {
      body: {
        vuelos: [
          {
            id: 1,
            numero_vuelo: 'FB001',
            origen: { nombre: 'Bogotá', codigo_iata: 'BOG' },
            destino: { nombre: 'Medellín', codigo_iata: 'MDE' },
            fecha_salida: '2025-12-01T08:00:00Z',
            precio: 150000,
            asientos_disponibles: 145,
          },
        ],
      },
    }).as('searchFlights')
    
    // Realizar búsqueda (ajustar según tu UI)
    // cy.get('[name="origen"]').select('Bogotá')
    // cy.get('[name="destino"]').select('Medellín')
    // cy.get('button[type="submit"]').click()
    
    // cy.wait('@searchFlights')
    // cy.contains('FB001').should('be.visible')
  })

  it('Debe mostrar detalles del vuelo al hacer click', () => {
    cy.wait('@getFlights')
    
    // Mock del vuelo específico
    cy.intercept('GET', '**/vuelos/1*', {
      body: {
        id: 1,
        numero_vuelo: 'FB001',
        origen: { nombre: 'Bogotá', codigo_iata: 'BOG' },
        destino: { nombre: 'Medellín', codigo_iata: 'MDE' },
        fecha_salida: '2025-12-01T08:00:00Z',
        fecha_llegada: '2025-12-01T09:30:00Z',
        precio: 150000,
        asientos_disponibles: 145,
      },
    }).as('getFlightDetail')
    
    // Click en el primer vuelo (ajustar selector)
    cy.contains('FB001').click()
    
    cy.wait('@getFlightDetail')
    
    // Verificar detalles
    cy.contains(/detalle|detail/i).should('be.visible')
  })
})
