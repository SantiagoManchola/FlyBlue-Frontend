describe('Cliente - Crear Reserva', () => {
  beforeEach(() => {
    cy.loginAsClient()
    
    // Mock de datos necesarios
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
    
    cy.intercept('GET', '**/equipajes*', { fixture: 'equipajes.json' }).as('getLuggage')
    
    cy.visit('/client/booking/create?flight=1')
  })

  it('Debe mostrar el formulario de reserva', () => {
    cy.wait('@getFlightDetail')
    cy.wait('@getLuggage')
    
    cy.contains(/crear reserva|book|reservar/i).should('be.visible')
  })

  it('Debe mostrar información del vuelo seleccionado', () => {
    cy.wait('@getFlightDetail')
    
    cy.contains('FB001').should('be.visible')
    cy.contains('Bogotá').should('be.visible')
    cy.contains('Medellín').should('be.visible')
  })

  it('Debe permitir seleccionar asiento', () => {
    cy.wait('@getFlightDetail')
    
    // Mock de asientos disponibles
    cy.intercept('GET', '**/vuelos/1/asientos*', {
      body: {
        asientos: [
          { numero: '12A', disponible: true, tipo: 'ventana' },
          { numero: '12B', disponible: true, tipo: 'pasillo' },
          { numero: '12C', disponible: false, tipo: 'ventana' },
        ],
      },
    }).as('getSeats')
    
    cy.wait('@getSeats')
    
    // Seleccionar asiento disponible
    cy.contains('12A').click()
    
    // Verificar que se seleccionó
    cy.contains('12A').should('have.class', /selected|active/i)
  })

  it('Debe permitir seleccionar equipaje', () => {
    cy.wait('@getLuggage')
    
    // Seleccionar equipaje facturado
    cy.contains(/equipaje facturado/i)
      .parent()
      .find('input[type="checkbox"], button')
      .first()
      .click()
    
    // Verificar que se actualizó el precio total
    cy.contains(/total/i).should('be.visible')
  })

  it('Debe calcular el precio total correctamente', () => {
    cy.wait('@getFlightDetail')
    cy.wait('@getLuggage')
    
    // Precio base del vuelo
    cy.contains('150000').should('be.visible')
    
    // Agregar equipaje facturado (50000)
    cy.contains(/equipaje facturado/i)
      .parent()
      .find('input[type="checkbox"], button')
      .first()
      .click()
    
    // Total debería ser 200000
    cy.contains('200000').should('be.visible')
  })

  it('Debe crear la reserva exitosamente', () => {
    cy.wait('@getFlightDetail')
    cy.wait('@getLuggage')
    
    // Mock de creación de reserva
    cy.intercept('POST', '**/reservas*', {
      statusCode: 201,
      body: {
        id: 1,
        numero_asiento: '12A',
        estado: 'confirmada',
        precio_total: 200000,
      },
    }).as('createBooking')
    
    // Seleccionar asiento
    cy.intercept('GET', '**/vuelos/1/asientos*', {
      body: {
        asientos: [
          { numero: '12A', disponible: true },
        ],
      },
    })
    
    // cy.contains('12A').click()
    
    // Seleccionar equipaje
    cy.contains(/equipaje facturado/i)
      .parent()
      .find('input[type="checkbox"], button')
      .first()
      .click()
    
    // Confirmar reserva
    cy.contains(/confirmar|crear reserva|book/i).click()
    
    cy.wait('@createBooking')
    
    // Verificar redirección o mensaje de éxito
    cy.contains(/reserva creada|booking created|éxito/i).should('be.visible')
  })

  it('Debe mostrar error si no hay asientos disponibles', () => {
    cy.intercept('POST', '**/reservas*', {
      statusCode: 400,
      body: {
        message: 'No hay asientos disponibles',
      },
    }).as('createBookingError')
    
    cy.contains(/confirmar|crear reserva/i).click()
    
    cy.wait('@createBookingError')
    
    cy.contains(/no hay asientos|no disponible/i).should('be.visible')
  })
})
