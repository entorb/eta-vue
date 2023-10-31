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

  it('sets target=10 to local storage', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
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

describe('set items', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('add 1 item', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#input-value')
      .type('1{enter}')
      .should(() => {
        const { first, last } = getLocalStorageDataFistLastValue()
        expect(first).to.eq(1)
        expect(last).to.eq(1)
      })
  })

  it('add 3 items', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#input-value')
      .type('1{enter}')
      .type('2{enter}')
      .type('3{enter}')
      .should(() => {
        const { first, last } = getLocalStorageDataFistLastValue()
        expect(first).to.eq(1)
        expect(last).to.eq(3)
      })
  })
})
