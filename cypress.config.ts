// https://docs.cypress.io/app/component-testing/vue/overview

import { defineConfig } from 'cypress'

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents() {
      // implement node event listeners here
    }
  }
})
