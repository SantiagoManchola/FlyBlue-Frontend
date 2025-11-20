describe('Smoke Test - Aplicación Principal', () => {
  it('Debe cargar la aplicación correctamente', () => {
    cy.visit('/')
    cy.url().should('include', 'localhost')
  })

  it('Debe redirigir a login cuando no está autenticado', () => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('Debe tener el título correcto', () => {
    cy.visit('/')
    cy.title().should('not.be.empty')
  })
})
