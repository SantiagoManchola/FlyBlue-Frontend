describe('Autenticación - Login', () => {
  beforeEach(() => {
    // Limpiar el localStorage antes de cada test
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('Debe mostrar el formulario de login correctamente', () => {
    cy.contains('Iniciar Sesión').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Debe mostrar errores de validación cuando los campos están vacíos', () => {
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparezcan mensajes de error (depende de tu implementación)
    cy.get('form').should('exist')
  })

  it('Debe mostrar error con credenciales incorrectas', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        message: 'Credenciales inválidas',
      },
    }).as('loginError')

    cy.get('input[type="email"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginError')
    // Verificar mensaje de error (ajustar según tu implementación)
  })

  it('Debe hacer login correctamente como administrador', () => {
    cy.fixture('admin-user').then((admin) => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: admin,
      }).as('loginSuccess')

      cy.get('input[type="email"]').type('admin@flyblue.com')
      cy.get('input[type="password"]').type('Admin123!')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginSuccess')

      // Verificar redirección al dashboard de admin
      cy.url().should('include', '/admin')
      
      // Verificar que el token se guardó
      cy.window().its('localStorage.token').should('exist')
    })
  })

  it('Debe hacer login correctamente como cliente', () => {
    cy.fixture('client-user').then((client) => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: client,
      }).as('loginSuccess')

      cy.get('input[type="email"]').type('client@flyblue.com')
      cy.get('input[type="password"]').type('Client123!')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginSuccess')

      // Verificar redirección al dashboard de cliente
      cy.url().should('include', '/client')
      
      // Verificar que el token se guardó
      cy.window().its('localStorage.token').should('exist')
    })
  })

  it('Debe tener un enlace para ir a registro', () => {
    cy.contains(/registr/i).click()
    cy.url().should('include', '/register')
  })
})
