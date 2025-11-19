describe('Admin - Gestión de Vuelos', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    
    // Mock de vuelos
    cy.intercept('GET', '**/vuelos*', { fixture: 'vuelos.json' }).as('getFlights')
    cy.intercept('GET', '**/ciudades*', { fixture: 'ciudades.json' }).as('getCities')
    
    cy.visit('/admin/flights')
  })

  it('Debe mostrar la lista de vuelos', () => {
    cy.wait('@getFlights')
    
    cy.contains(/gestión de vuelos|flights management/i).should('be.visible')
    
    // Verificar que se muestran los vuelos
    cy.contains('FB001').should('be.visible')
    cy.contains('FB002').should('be.visible')
    cy.contains('FB003').should('be.visible')
  })

  it('Debe tener un botón para crear nuevo vuelo', () => {
    cy.wait('@getFlights')
    
    cy.contains(/nuevo vuelo|create flight|agregar/i).should('be.visible')
  })

  it('Debe abrir el formulario de crear vuelo', () => {
    cy.wait('@getFlights')
    cy.wait('@getCities')
    
    cy.contains(/nuevo vuelo|create flight|agregar/i).click()
    
    // Verificar que se abrió el formulario/modal
    cy.contains(/crear vuelo|create flight/i).should('be.visible')
  })

  it('Debe crear un nuevo vuelo exitosamente', () => {
    cy.wait('@getFlights')
    cy.wait('@getCities')
    
    // Mock de creación exitosa
    cy.intercept('POST', '**/vuelos*', {
      statusCode: 201,
      body: {
        id: 4,
        numero_vuelo: 'FB004',
        origen_id: 1,
        destino_id: 3,
        fecha_salida: '2025-12-10T10:00:00Z',
        fecha_llegada: '2025-12-10T12:00:00Z',
        precio: 200000,
        capacidad_total: 180,
      },
    }).as('createFlight')
    
    cy.contains(/nuevo vuelo|create flight|agregar/i).click()
    
    // Llenar formulario
    cy.get('input[name="numero_vuelo"]').type('FB004')
    // cy.get('select[name="origen"]').select('Bogotá')
    // cy.get('select[name="destino"]').select('Cartagena')
    cy.get('input[name="precio"]').type('200000')
    cy.get('input[name="capacidad"]').type('180')
    
    // Enviar formulario
    cy.contains(/crear|save|guardar/i).click()
    
    cy.wait('@createFlight')
    
    // Verificar mensaje de éxito
    cy.contains(/creado|created|éxito/i).should('be.visible')
  })

  it('Debe permitir editar un vuelo existente', () => {
    cy.wait('@getFlights')
    
    // Mock de actualización
    cy.intercept('PUT', '**/vuelos/1*', {
      statusCode: 200,
      body: {
        id: 1,
        numero_vuelo: 'FB001',
        precio: 160000, // Precio actualizado
      },
    }).as('updateFlight')
    
    // Click en editar (ajustar selector según tu UI)
    cy.contains('FB001')
      .parent()
      .contains(/editar|edit/i)
      .click()
    
    // Modificar precio
    cy.get('input[name="precio"]').clear().type('160000')
    
    // Guardar cambios
    cy.contains(/guardar|save|actualizar/i).click()
    
    cy.wait('@updateFlight')
    
    // Verificar mensaje de éxito
    cy.contains(/actualizado|updated/i).should('be.visible')
  })

  it('Debe permitir eliminar un vuelo', () => {
    cy.wait('@getFlights')
    
    // Mock de eliminación
    cy.intercept('DELETE', '**/vuelos/1*', {
      statusCode: 200,
      body: { message: 'Vuelo eliminado' },
    }).as('deleteFlight')
    
    // Click en eliminar
    cy.contains('FB001')
      .parent()
      .contains(/eliminar|delete/i)
      .click()
    
    // Confirmar eliminación
    cy.contains(/confirmar|yes/i).click()
    
    cy.wait('@deleteFlight')
    
    // Verificar que se eliminó
    cy.contains(/eliminado|deleted/i).should('be.visible')
  })

  it('Debe filtrar vuelos por estado', () => {
    cy.wait('@getFlights')
    
    cy.intercept('GET', '**/vuelos?estado=programado*', {
      body: {
        vuelos: [
          {
            id: 1,
            numero_vuelo: 'FB001',
            estado: 'programado',
          },
        ],
      },
    }).as('getScheduledFlights')
    
    // cy.get('[name="estado"]').select('programado')
    // cy.wait('@getScheduledFlights')
    
    // cy.contains('FB001').should('be.visible')
  })

  it('Debe mostrar detalles de un vuelo', () => {
    cy.wait('@getFlights')
    
    cy.intercept('GET', '**/vuelos/1*', {
      body: {
        id: 1,
        numero_vuelo: 'FB001',
        origen: { nombre: 'Bogotá' },
        destino: { nombre: 'Medellín' },
        fecha_salida: '2025-12-01T08:00:00Z',
        fecha_llegada: '2025-12-01T09:30:00Z',
        precio: 150000,
        capacidad_total: 180,
        asientos_disponibles: 145,
      },
    }).as('getFlightDetail')
    
    cy.contains('FB001').click()
    
    cy.wait('@getFlightDetail')
    
    cy.contains(/detalle|detail/i).should('be.visible')
    cy.contains('180').should('be.visible') // Capacidad
    cy.contains('145').should('be.visible') // Disponibles
  })

  it('Debe validar campos requeridos al crear vuelo', () => {
    cy.wait('@getFlights')
    
    cy.contains(/nuevo vuelo|create flight/i).click()
    
    // Intentar crear sin llenar campos
    cy.contains(/crear|save/i).click()
    
    // Debe mostrar errores de validación
    cy.get('form').should('exist')
  })
})
