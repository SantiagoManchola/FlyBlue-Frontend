/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('admin@flyblue.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to login as admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>
      
      /**
       * Custom command to login as client
       * @example cy.loginAsClient()
       */
      loginAsClient(): Chainable<void>
      
      /**
       * Custom command to setup API mocks
       * @example cy.setupApiMocks()
       */
      setupApiMocks(): Chainable<void>
      
      /**
       * Custom command to get by data-testid
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to intercept and mock API calls
       * @example cy.mockApiCall('GET', '/api/vuelos', { fixture: 'vuelos.json' })
       */
      mockApiCall(method: string, url: string, response: any): Chainable<void>
    }
  }
}

// Command para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    
    // Esperar a que se guarde el token
    cy.window().its('localStorage.token').should('exist')
  })
})

// Command para login como admin
Cypress.Commands.add('loginAsAdmin', () => {
  const adminEmail = 'admin@flyblue.com'
  const adminPassword = 'Admin123!'
  
  cy.session('admin', () => {
    // Configurar el localStorage directamente sin hacer la petición real
    cy.visit('/login')
    
    // Establecer el localStorage antes de interactuar con la app
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-admin-token-12345')
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        nombre: 'Admin',
        apellido: 'FlyBlue',
        email: adminEmail,
        rol: 'administrador',
      }))
    })
  })
})

// Command para login como cliente
Cypress.Commands.add('loginAsClient', () => {
  const clientEmail = 'client@flyblue.com'
  const clientPassword = 'Client123!'
  
  cy.session('client', () => {
    // Configurar el localStorage directamente sin hacer la petición real
    cy.visit('/login')
    
    // Establecer el localStorage antes de interactuar con la app
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-client-token-67890')
      win.localStorage.setItem('user', JSON.stringify({
        id: 2,
        nombre: 'Cliente',
        apellido: 'Prueba',
        email: clientEmail,
        rol: 'cliente',
      }))
    })
  })
})

// Command para configurar mocks de API
Cypress.Commands.add('setupApiMocks', () => {
  // Mock de vuelos
  cy.intercept('GET', '**/vuelos*', { fixture: 'vuelos.json' }).as('getFlights')
  
  // Mock de ciudades
  cy.intercept('GET', '**/ciudades*', { fixture: 'ciudades.json' }).as('getCities')
  
  // Mock de equipajes
  cy.intercept('GET', '**/equipajes*', { fixture: 'equipajes.json' }).as('getLuggage')
  
  // Mock de reservas
  cy.intercept('GET', '**/reservas*', { fixture: 'reservas.json' }).as('getBookings')
})

// Command para obtener por data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Command para mockear llamadas a API
Cypress.Commands.add('mockApiCall', (method: string, url: string, response: any) => {
  cy.intercept(method as any, url, response)
})

export {}
