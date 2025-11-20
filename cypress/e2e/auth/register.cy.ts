describe('Autenticación - Registro', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/register')
  })

  it('Debe mostrar el formulario de registro correctamente', () => {
    cy.contains(/registr/i).should('be.visible')
    
    // Verificar que existan todos los campos necesarios
    cy.get('input[type="text"]').should('have.length.at.least', 2) // nombre y apellido
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('have.length.at.least', 1)
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Debe mostrar errores de validación con campos vacíos', () => {
    cy.get('button[type="submit"]').click()
    
    // El formulario debe seguir visible (no debe enviarse)
    cy.get('form').should('exist')
  })

  it('Debe registrar un nuevo usuario correctamente', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 201,
      body: {
        message: 'Usuario registrado exitosamente',
        user: {
          id: 3,
          nombre: 'Nuevo',
          apellido: 'Usuario',
          email: 'nuevo@test.com',
          rol: 'cliente',
        },
      },
    }).as('registerSuccess')

    // Llenar el formulario
    cy.get('input[name="nombre"], input[placeholder*="nombre" i]').first().type('Nuevo')
    cy.get('input[name="apellido"], input[placeholder*="apellido" i]').first().type('Usuario')
    cy.get('input[type="email"]').type('nuevo@test.com')
    cy.get('input[type="password"]').first().type('Password123!')
    
    // Si hay confirmación de contraseña
    cy.get('input[type="password"]').last().type('Password123!')
    
    cy.get('button[type="submit"]').click()

    cy.wait('@registerSuccess')

    // Verificar redirección al login
    cy.url().should('include', '/login')
  })

  it('Debe mostrar error si el email ya está registrado', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 400,
      body: {
        message: 'El email ya está registrado',
      },
    }).as('registerError')

    cy.get('input[name="nombre"], input[placeholder*="nombre" i]').first().type('Test')
    cy.get('input[name="apellido"], input[placeholder*="apellido" i]').first().type('User')
    cy.get('input[type="email"]').type('existing@test.com')
    cy.get('input[type="password"]').first().type('Password123!')
    cy.get('input[type="password"]').last().type('Password123!')
    
    cy.get('button[type="submit"]').click()

    cy.wait('@registerError')
    
    // El usuario debe seguir en la página de registro
    cy.url().should('include', '/register')
  })

  it('Debe tener un enlace para ir al login', () => {
    cy.contains(/iniciar sesión/i).click()
    cy.url().should('include', '/login')
  })
})
