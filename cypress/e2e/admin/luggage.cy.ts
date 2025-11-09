describe('Admin - Gestión de Equipajes', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    
    // Mock de equipajes
    cy.intercept('GET', '**/equipajes*', { fixture: 'equipajes.json' }).as('getLuggage')
    
    cy.visit('/admin/luggage')
  })

  it('Debe mostrar la lista de tipos de equipaje', () => {
    cy.wait('@getLuggage')
    
    cy.contains(/gestión de equipajes|luggage management/i).should('be.visible')
    
    // Verificar equipajes
    cy.contains('Equipaje de mano').should('be.visible')
    cy.contains('Equipaje facturado').should('be.visible')
    cy.contains('Equipaje extra').should('be.visible')
  })

  it('Debe mostrar información de cada tipo de equipaje', () => {
    cy.wait('@getLuggage')
    
    // Verificar equipaje de mano
    cy.contains('Equipaje de mano').parent().within(() => {
      cy.contains('10').should('be.visible') // Peso máximo
      cy.contains('0').should('be.visible') // Precio
    })
    
    // Verificar equipaje facturado
    cy.contains('Equipaje facturado').parent().within(() => {
      cy.contains('23').should('be.visible')
      cy.contains('50000').should('be.visible')
    })
  })

  it('Debe tener un botón para crear nuevo tipo de equipaje', () => {
    cy.wait('@getLuggage')
    
    cy.contains(/nuevo equipaje|create luggage|agregar/i).should('be.visible')
  })

  it('Debe crear un nuevo tipo de equipaje exitosamente', () => {
    cy.wait('@getLuggage')
    
    cy.intercept('POST', '**/equipajes*', {
      statusCode: 201,
      body: {
        id: 4,
        tipo: 'Equipaje deportivo',
        peso_maximo: 30,
        precio: 120000,
        descripcion: 'Para equipos deportivos',
      },
    }).as('createLuggage')
    
    cy.contains(/nuevo equipaje|create luggage|agregar/i).click()
    
    // Llenar formulario
    cy.get('input[name="tipo"]').type('Equipaje deportivo')
    cy.get('input[name="peso_maximo"]').type('30')
    cy.get('input[name="precio"]').type('120000')
    cy.get('textarea[name="descripcion"]').type('Para equipos deportivos')
    
    cy.contains(/crear|save|guardar/i).click()
    
    cy.wait('@createLuggage')
    
    cy.contains(/creado|created|éxito/i).should('be.visible')
  })

  it('Debe permitir editar un tipo de equipaje', () => {
    cy.wait('@getLuggage')
    
    cy.intercept('PUT', '**/equipajes/2*', {
      statusCode: 200,
      body: {
        id: 2,
        tipo: 'Equipaje facturado',
        peso_maximo: 25, // Peso actualizado
        precio: 55000, // Precio actualizado
      },
    }).as('updateLuggage')
    
    cy.contains('Equipaje facturado')
      .parent()
      .contains(/editar|edit/i)
      .click()
    
    // Modificar peso y precio
    cy.get('input[name="peso_maximo"]').clear().type('25')
    cy.get('input[name="precio"]').clear().type('55000')
    
    cy.contains(/guardar|save|actualizar/i).click()
    
    cy.wait('@updateLuggage')
    
    cy.contains(/actualizado|updated/i).should('be.visible')
  })

  it('Debe permitir eliminar un tipo de equipaje', () => {
    cy.wait('@getLuggage')
    
    cy.intercept('DELETE', '**/equipajes/3*', {
      statusCode: 200,
      body: { message: 'Equipaje eliminado' },
    }).as('deleteLuggage')
    
    cy.contains('Equipaje extra')
      .parent()
      .contains(/eliminar|delete/i)
      .click()
    
    cy.contains(/confirmar|yes/i).click()
    
    cy.wait('@deleteLuggage')
    
    cy.contains(/eliminado|deleted/i).should('be.visible')
  })

  it('Debe validar que el peso sea mayor a 0', () => {
    cy.wait('@getLuggage')
    
    cy.contains(/nuevo equipaje|create luggage/i).click()
    
    cy.get('input[name="tipo"]').type('Test')
    cy.get('input[name="peso_maximo"]').type('0')
    cy.get('input[name="precio"]').type('10000')
    
    cy.contains(/crear|save/i).click()
    
    // Debe mostrar error de validación
    cy.get('form').should('exist')
  })

  it('Debe validar que el precio sea mayor o igual a 0', () => {
    cy.wait('@getLuggage')
    
    cy.contains(/nuevo equipaje|create luggage/i).click()
    
    cy.get('input[name="tipo"]').type('Test')
    cy.get('input[name="peso_maximo"]').type('10')
    cy.get('input[name="precio"]').type('-1000')
    
    cy.contains(/crear|save/i).click()
    
    // Debe mostrar error de validación
    cy.get('form').should('exist')
  })

  it('Debe mostrar los equipajes ordenados por precio', () => {
    cy.wait('@getLuggage')
    
    // Verificar que el gratuito (0) aparece primero
    cy.get('tbody tr').first().should('contain', 'Equipaje de mano')
    
    // Y el más caro al final
    cy.get('tbody tr').last().should('contain', 'Equipaje extra')
  })

  it('Debe mostrar mensaje cuando no hay equipajes', () => {
    cy.intercept('GET', '**/equipajes*', {
      body: { equipajes: [] },
    }).as('getEmptyLuggage')
    
    cy.visit('/admin/luggage')
    cy.wait('@getEmptyLuggage')
    
    cy.contains(/no hay equipajes|no luggage/i).should('be.visible')
  })
})
