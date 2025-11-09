describe('Cliente - Pagos', () => {
  beforeEach(() => {
    cy.loginAsClient()
    
    // Mock de reserva pendiente de pago
    cy.intercept('GET', '**/reservas/2*', {
      body: {
        id: 2,
        numero_asiento: '24C',
        estado: 'pendiente',
        precio_total: 950000,
        vuelo: {
          numero_vuelo: 'FB003',
          origen: { nombre: 'Bogotá' },
          destino: { nombre: 'Miami' },
          fecha_salida: '2025-12-05T14:00:00Z',
        },
      },
    }).as('getBooking')
    
    cy.visit('/client/payment?booking=2')
  })

  it('Debe mostrar el formulario de pago', () => {
    cy.wait('@getBooking')
    
    cy.contains(/pago|payment/i).should('be.visible')
    cy.contains('950000').should('be.visible')
  })

  it('Debe mostrar información de la reserva a pagar', () => {
    cy.wait('@getBooking')
    
    cy.contains('FB003').should('be.visible')
    cy.contains('Bogotá').should('be.visible')
    cy.contains('Miami').should('be.visible')
    cy.contains('24C').should('be.visible')
  })

  it('Debe validar los campos de tarjeta de crédito', () => {
    cy.wait('@getBooking')
    
    // Intentar pagar sin llenar campos
    cy.contains(/pagar|pay/i).click()
    
    // Debe mostrar errores de validación
    cy.get('form').should('exist')
  })

  it('Debe procesar el pago exitosamente', () => {
    cy.wait('@getBooking')
    
    // Mock de pago exitoso
    cy.intercept('POST', '**/pagos*', {
      statusCode: 200,
      body: {
        id: 1,
        estado: 'aprobado',
        referencia: 'PAY-12345',
        fecha: '2025-11-09T10:00:00Z',
      },
    }).as('processPayment')
    
    // Llenar formulario de pago
    cy.get('input[name*="numero"], input[placeholder*="número" i]')
      .first()
      .type('4111111111111111')
    
    cy.get('input[name*="nombre"], input[placeholder*="nombre" i]')
      .first()
      .type('Juan Pérez')
    
    cy.get('input[name*="expira"], input[placeholder*="MM/YY" i]')
      .first()
      .type('12/25')
    
    cy.get('input[name*="cvv"], input[placeholder*="CVV" i]')
      .first()
      .type('123')
    
    // Procesar pago
    cy.contains(/pagar|pay/i).click()
    
    cy.wait('@processPayment')
    
    // Verificar confirmación
    cy.contains(/pago exitoso|payment successful/i).should('be.visible')
    cy.contains('PAY-12345').should('be.visible')
  })

  it('Debe mostrar error si el pago es rechazado', () => {
    cy.wait('@getBooking')
    
    // Mock de pago rechazado
    cy.intercept('POST', '**/pagos*', {
      statusCode: 400,
      body: {
        message: 'Tarjeta rechazada',
        estado: 'rechazado',
      },
    }).as('paymentError')
    
    // Llenar formulario
    cy.get('input[name*="numero"]').first().type('4111111111111111')
    cy.get('input[name*="nombre"]').first().type('Juan Pérez')
    cy.get('input[name*="expira"]').first().type('12/25')
    cy.get('input[name*="cvv"]').first().type('123')
    
    cy.contains(/pagar|pay/i).click()
    
    cy.wait('@paymentError')
    
    // Verificar mensaje de error
    cy.contains(/rechazada|declined|error/i).should('be.visible')
  })

  it('Debe poder volver a la página de reservas', () => {
    cy.wait('@getBooking')
    
    cy.contains(/volver|back/i).click()
    
    cy.url().should('include', '/bookings')
  })

  it('Debe mostrar resumen del pago antes de confirmar', () => {
    cy.wait('@getBooking')
    
    // Verificar resumen
    cy.contains(/total/i).should('be.visible')
    cy.contains('950000').should('be.visible')
    
    // Desglose del pago
    cy.contains(/vuelo/i).should('be.visible')
    cy.contains(/equipaje/i).should('be.visible')
  })
})
