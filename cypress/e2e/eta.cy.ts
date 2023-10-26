import { getLocalStorageDataFistLastValue } from './helper-cy'

describe('start app', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('passes', () => {
    cy.get('#input-value').type('1')
    cy.get('#input-target').type('10{enter}')
    cy.get('#input-value').type('2{enter}')
    cy.get('#btn-plus-1').click()
  })
})

describe('set target', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('sets target to local storage', () => {
    cy.get('#input-target')
      .type('10{enter}')
      .should(() => {
        expect(localStorage.getItem('eta_vue_target')).to.eq('10')
      })
  })

  it('sets target=10 to local storage', () => {
    cy.get('#input-target')
      .type('10{enter}')
      .should(() => {
        // var 1
        expect(localStorage.getItem('eta_vue_target')).to.eq('10')
        // var 2
        const target = localStorage.getItem('eta_vue_target')
        expect(target).to.eq('10')
      })
  })
})
