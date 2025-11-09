// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import '@testing-library/cypress/add-commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Evitar que fallos de aplicación fallen los tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // Solo para ciertos errores que no queremos que fallen los tests
  if (err.message.includes('ResizeObserver') || err.message.includes('hydration')) {
    return false
  }
  return true
})
