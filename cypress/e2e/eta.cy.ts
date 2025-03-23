import { getEtaLocalStorageDataFistLastRowItems } from './helper-cy'

describe('start app', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('Mode Up: check target in local storage', () => {
    cy.get('#input-target')
      .clear()
      .type('20{enter}')
      .should(() => {
        expect(localStorage.getItem('eta_vue_target')).to.eq('20')
      })

    cy.get('#input-items').type('1{enter}')
    cy.get('#input-items').type('12{enter}')
    cy.get('#btn-plus-1')
      .click()
      .should(() => {
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(12+1)
      })
  })

  it('Down: simple', () => {
    cy.get('#input-target')
      .clear()
      .type('0{enter}')
      // stored into local storage only after entering of items

    cy.get('#input-items')
      .type('13{enter}')
      .should(() => {
        expect(localStorage.getItem('eta_vue_target')).to.eq('0')
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(13)
        expect(last).to.eq(13)
      })
  })
})
