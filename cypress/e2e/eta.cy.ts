import { getEtaLocalStorageDataFistLastRowItems } from './helper-cy'

describe('start app', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('Up', () => {
    cy.get('#input-target').clear().type('20{enter}')
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_target')).to.eq('20')
    })

    cy.get('#input-items').type('1{enter}')
    cy.get('#input-items')
      .type('12{enter}')
      .should(() => {
        const { first, last } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(12)
      })
    cy.get('#btn-plus-1').click()
    cy.should(() => {
      const { first, last } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(1)
      expect(last).to.eq(12 + 1)
    })

    cy.get('#btn-del-row-0').click()
    cy.should(() => {
      const { first, last } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(12)
      expect(last).to.eq(13)
    })
  })

  it('Down', () => {
    cy.get('#input-target').clear().type('0{enter}')
    // stored into local storage only after entering of items

    cy.get('#input-items').type('99{enter}')
    cy.get('#input-items').type('66{enter}')
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_target')).to.eq('0')
      const { first, last } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(99)
      expect(last).to.eq(66)
    })

    cy.get('#btn-plus-1').click()
    cy.should(() => {
      const { first, last } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(99)
      expect(last).to.eq(66 - 1)
    })

    cy.get('#btn-del-row-2').click()
    cy.should(() => {
      const { first, last } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(99)
      expect(last).to.eq(66)
    })
  })
})
