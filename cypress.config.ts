// https://docs.cypress.io/app/component-testing/vue/overview

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
