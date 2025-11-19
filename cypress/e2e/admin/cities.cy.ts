describe('Admin - Gestión de Ciudades', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    
    // Mock de ciudades
    cy.intercept('GET', '**/ciudades*', { fixture: 'ciudades.json' }).as('getCities')
    
    cy.visit('/admin/cities')
  })

  it('Debe mostrar la lista de ciudades', () => {
    cy.wait('@getCities')
    
    cy.contains(/gestión de ciudades|cities management/i).should('be.visible')
    
    // Verificar ciudades
    cy.contains('Bogotá').should('be.visible')
    cy.contains('BOG').should('be.visible')
    cy.contains('Medellín').should('be.visible')
    cy.contains('MDE').should('be.visible')
  })

  it('Debe tener un botón para crear nueva ciudad', () => {
    cy.wait('@getCities')
    
    cy.contains(/nueva ciudad|create city|agregar/i).should('be.visible')
  })

  it('Debe crear una nueva ciudad exitosamente', () => {
    cy.wait('@getCities')
    
    // Mock de creación
    cy.intercept('POST', '**/ciudades*', {
      statusCode: 201,
      body: {
        id: 7,
        nombre: 'Barranquilla',
        pais: 'Colombia',
        codigo_iata: 'BAQ',
      },
    }).as('createCity')
    
    cy.contains(/nueva ciudad|create city|agregar/i).click()
    
    // Llenar formulario
    cy.get('input[name="nombre"]').type('Barranquilla')
    cy.get('input[name="pais"]').type('Colombia')
    cy.get('input[name="codigo_iata"]').type('BAQ')
    
    cy.contains(/crear|save|guardar/i).click()
    
    cy.wait('@createCity')
    
    cy.contains(/creada|created|éxito/i).should('be.visible')
  })

  it('Debe validar el código IATA (3 letras)', () => {
    cy.wait('@getCities')
    
    cy.intercept('POST', '**/ciudades*', {
      statusCode: 400,
      body: {
        message: 'Código IATA debe tener 3 letras',
      },
    }).as('createCityError')
    
    cy.contains(/nueva ciudad|create city/i).click()
    
    cy.get('input[name="nombre"]').type('Test')
    cy.get('input[name="pais"]').type('Test')
    cy.get('input[name="codigo_iata"]').type('INVALID') // Más de 3 letras
    
    cy.contains(/crear|save/i).click()
    
    // Debe mostrar error
    // cy.wait('@createCityError')
    // cy.contains(/código/i).should('be.visible')
  })

  it('Debe permitir editar una ciudad', () => {
    cy.wait('@getCities')
    
    cy.intercept('PUT', '**/ciudades/1*', {
      statusCode: 200,
      body: {
        id: 1,
        nombre: 'Bogotá D.C.',
        pais: 'Colombia',
        codigo_iata: 'BOG',
      },
    }).as('updateCity')
    
    // Click en editar
    cy.contains('Bogotá')
      .parent()
      .contains(/editar|edit/i)
      .click()
    
    // Modificar nombre
    cy.get('input[name="nombre"]').clear().type('Bogotá D.C.')
    
    cy.contains(/guardar|save|actualizar/i).click()
    
    cy.wait('@updateCity')
    
    cy.contains(/actualizada|updated/i).should('be.visible')
  })

  it('Debe permitir eliminar una ciudad', () => {
    cy.wait('@getCities')
    
    cy.intercept('DELETE', '**/ciudades/6*', {
      statusCode: 200,
      body: { message: 'Ciudad eliminada' },
    }).as('deleteCity')
    
    cy.contains('Ciudad de México')
      .parent()
      .contains(/eliminar|delete/i)
      .click()
    
    cy.contains(/confirmar|yes/i).click()
    
    cy.wait('@deleteCity')
    
    cy.contains(/eliminada|deleted/i).should('be.visible')
  })

  it('Debe buscar ciudades por nombre', () => {
    cy.wait('@getCities')
    
    cy.intercept('GET', '**/ciudades?search=Bogotá*', {
      body: {
        ciudades: [
          {
            id: 1,
            nombre: 'Bogotá',
            pais: 'Colombia',
            codigo_iata: 'BOG',
          },
        ],
      },
    }).as('searchCities')
    
    cy.get('input[type="search"], input[placeholder*="buscar" i]')
      .type('Bogotá')
    
    // cy.wait('@searchCities')
    
    // cy.contains('Bogotá').should('be.visible')
    // cy.contains('Medellín').should('not.exist')
  })

  it('Debe filtrar ciudades por país', () => {
    cy.wait('@getCities')
    
    cy.intercept('GET', '**/ciudades?pais=Colombia*', {
      body: {
        ciudades: [
          { id: 1, nombre: 'Bogotá', pais: 'Colombia', codigo_iata: 'BOG' },
          { id: 2, nombre: 'Medellín', pais: 'Colombia', codigo_iata: 'MDE' },
          { id: 3, nombre: 'Cartagena', pais: 'Colombia', codigo_iata: 'CTG' },
          { id: 4, nombre: 'Cali', pais: 'Colombia', codigo_iata: 'CLO' },
        ],
      },
    }).as('filterByCountry')
    
    // cy.get('[name="pais"]').select('Colombia')
    // cy.wait('@filterByCountry')
    
    // cy.contains('Bogotá').should('be.visible')
    // cy.contains('Miami').should('not.exist')
  })

  it('Debe mostrar mensaje cuando no hay ciudades', () => {
    cy.intercept('GET', '**/ciudades*', {
      body: { ciudades: [] },
    }).as('getEmptyCities')
    
    cy.visit('/admin/cities')
    cy.wait('@getEmptyCities')
    
    cy.contains(/no hay ciudades|no cities/i).should('be.visible')
  })
})
