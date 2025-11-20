describe('Rutas Protegidas', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  describe('Sin autenticación', () => {
    it('Debe redirigir a login cuando intenta acceder al dashboard de admin', () => {
      cy.visit('/admin')
      cy.url().should('include', '/login')
    })

    it('Debe redirigir a login cuando intenta acceder al dashboard de cliente', () => {
      cy.visit('/client')
      cy.url().should('include', '/login')
    })

    it('Debe permitir acceso a la página de login sin autenticación', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
      cy.contains(/iniciar sesión/i).should('be.visible')
    })

    it('Debe permitir acceso a la página de registro sin autenticación', () => {
      cy.visit('/register')
      cy.url().should('include', '/register')
      cy.contains(/registr/i).should('be.visible')
    })
  })

  describe('Autenticado como Admin', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
    })

    it('Debe permitir acceso al dashboard de admin', () => {
      cy.visit('/admin')
      cy.url().should('include', '/admin')
    })

    it('No debe redirigir a login cuando está autenticado', () => {
      cy.visit('/admin/flights')
      cy.url().should('not.include', '/login')
    })

    it('Debe poder cerrar sesión correctamente', () => {
      cy.visit('/admin')
      
      // Buscar botón de logout (ajustar selector según tu implementación)
      cy.contains(/cerrar sesión|logout|salir/i).click()
      
      // Verificar que se limpia el localStorage
      cy.window().its('localStorage.token').should('not.exist')
      
      // Verificar redirección al login
      cy.url().should('include', '/login')
    })
  })

  describe('Autenticado como Cliente', () => {
    beforeEach(() => {
      cy.loginAsClient()
    })

    it('Debe permitir acceso al dashboard de cliente', () => {
      cy.visit('/client')
      cy.url().should('include', '/client')
    })

    it('No debe poder acceder al dashboard de admin', () => {
      cy.visit('/admin')
      // Debe redirigir o mostrar error de permisos
      cy.url().should('not.include', '/admin')
    })

    it('Debe poder cerrar sesión correctamente', () => {
      cy.visit('/client')
      
      // Buscar botón de logout
      cy.contains(/cerrar sesión|logout|salir/i).click()
      
      // Verificar que se limpia el localStorage
      cy.window().its('localStorage.token').should('not.exist')
      
      // Verificar redirección al login
      cy.url().should('include', '/login')
    })
  })
})
