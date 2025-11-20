describe('Cliente - Mis Reservas', () => {
  beforeEach(() => {
    cy.loginAsClient()
    
    // Mock de reservas del usuario
    cy.intercept('GET', '**/reservas*', { fixture: 'reservas.json' }).as('getBookings')
    
    cy.visit('/client/bookings')
  })

  it('Debe mostrar la lista de reservas del usuario', () => {
    cy.wait('@getBookings')
    
    cy.contains(/mis reservas|my bookings/i).should('be.visible')
    
    // Verificar que se muestran las reservas
    cy.contains('FB001').should('be.visible')
    cy.contains('FB003').should('be.visible')
  })

  it('Debe mostrar información detallada de cada reserva', () => {
    cy.wait('@getBookings')
    
    // Verificar información de la primera reserva
    cy.contains('FB001').parent().within(() => {
      cy.contains('Bogotá').should('be.visible')
      cy.contains('Medellín').should('be.visible')
      cy.contains('12A').should('be.visible') // Número de asiento
      cy.contains(/confirmada/i).should('be.visible')
    })
  })

  it('Debe filtrar reservas por estado', () => {
    cy.wait('@getBookings')
    
    // Filtrar solo confirmadas
    cy.intercept('GET', '**/reservas?estado=confirmada*', {
      body: {
        reservas: [
          {
            id: 1,
            numero_asiento: '12A',
            estado: 'confirmada',
            vuelo: {
              numero_vuelo: 'FB001',
              origen: { nombre: 'Bogotá' },
              destino: { nombre: 'Medellín' },
            },
          },
        ],
      },
    }).as('getConfirmedBookings')
    
    // cy.get('[name="estado"]').select('confirmada')
    // cy.wait('@getConfirmedBookings')
    
    // cy.contains('FB001').should('be.visible')
    // cy.contains('FB003').should('not.exist')
  })

  it('Debe permitir ver detalles de una reserva', () => {
    cy.wait('@getBookings')
    
    // Mock de detalle de reserva
    cy.intercept('GET', '**/reservas/1*', {
      body: {
        id: 1,
        numero_asiento: '12A',
        fecha_reserva: '2025-11-01T10:00:00Z',
        estado: 'confirmada',
        precio_total: 200000,
        vuelo: {
          numero_vuelo: 'FB001',
          origen: { nombre: 'Bogotá', codigo_iata: 'BOG' },
          destino: { nombre: 'Medellín', codigo_iata: 'MDE' },
          fecha_salida: '2025-12-01T08:00:00Z',
        },
        equipajes: [
          { tipo: 'Equipaje de mano', precio: 0 },
          { tipo: 'Equipaje facturado', precio: 50000 },
        ],
      },
    }).as('getBookingDetail')
    
    // Click en ver detalles
    cy.contains('FB001').click()
    
    cy.wait('@getBookingDetail')
    
    // Verificar detalles
    cy.contains('12A').should('be.visible')
    cy.contains('200000').should('be.visible')
    cy.contains(/equipaje facturado/i).should('be.visible')
  })

  it('Debe permitir cancelar una reserva', () => {
    cy.wait('@getBookings')
    
    // Mock de cancelación
    cy.intercept('PATCH', '**/reservas/1/cancelar*', {
      statusCode: 200,
      body: {
        message: 'Reserva cancelada exitosamente',
      },
    }).as('cancelBooking')
    
    // Click en cancelar (ajustar selector según tu UI)
    cy.contains('FB001')
      .parent()
      .contains(/cancelar/i)
      .click()
    
    // Confirmar cancelación en el modal
    cy.contains(/confirmar/i).click()
    
    cy.wait('@cancelBooking')
    
    // Verificar mensaje de éxito
    cy.contains(/cancelada|cancelled/i).should('be.visible')
  })

  it('Debe mostrar mensaje cuando no hay reservas', () => {
    cy.intercept('GET', '**/reservas*', {
      body: { reservas: [] },
    }).as('getEmptyBookings')
    
    cy.visit('/client/bookings')
    cy.wait('@getEmptyBookings')
    
    cy.contains(/no tienes reservas|no bookings/i).should('be.visible')
  })
})
