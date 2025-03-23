import { getEtaLocalStorageDataFistLastRowItems } from './helper-cy'

describe('start app', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('passes', () => {
    cy.get('#select-mode').parent().click()
    cy.get('.v-list-item__content').contains('Up').click()
    // cy.get('.v-list > :nth-child(3)').click()
    cy.get('#input-target').clear().type('10{enter}')
    cy.get('#input-items').type('1')
    cy.get('#input-items').type('2{enter}')
    cy.get('#btn-plus-1').click()
  })
})

describe('mode count-up: set target', () => {
  beforeEach(() => {
    cy.visit('eta/')
    cy.get('#select-mode').parent().click()
    cy.get('.v-list-item__content').contains('Up').click()
    // cy.get('.v-list > :nth-child(3)').click()
  })

  it('sets target=20 to local storage', () => {
    cy.get('#input-target')
      .clear()
      .type('20{enter}')
      .should(() => {
        // var 1
        expect(localStorage.getItem('eta_vue_target')).to.eq('20')
        // var 2
        const target = localStorage.getItem('eta_vue_target')
        expect(target).to.eq('20')
      })
  })
})

describe('mode count-down: set items', () => {
  beforeEach(() => {
    cy.visit('eta/')
    cy.get('#select-mode').parent().click()
    cy.get('.v-list-item__content').contains('Down').click()
  })

  it('add 1 item', () => {
    cy.get('#input-items')
      .type('1{enter}')
      .should(() => {
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(1)
      })
  })

  it('add 3 items', () => {
    cy.get('#input-items')
      .type('3{enter}')
      .type('2{enter}')
      .type('1{enter}')
      .should(() => {
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(3)
        expect(last).to.eq(1)
      })
  })
})

describe('mode simple: set items', () => {
  beforeEach(() => {
    cy.visit('eta/')
    cy.get('#select-mode').parent().click()
    cy.get('.v-list-item__content').contains('Simple').click()
  })

  it('add 3 items', () => {
    cy.get('#input-items')
      .type('1{enter}')
      .type('2{enter}')
      .type('3{enter}')
      .should(() => {
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(3)
      })
  })
})
