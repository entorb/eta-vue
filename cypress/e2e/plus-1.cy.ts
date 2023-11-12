import { getEtaLocalStorageDataFistLastRowItems } from './helper-cy'

describe('plus-1', () => {
  beforeEach(() => {
    cy.visit('eta/')
  })

  it('1 click on plus-1, target = none', () => {
    cy.get('#select-mode').parent().click()
    cy.get('.v-list > :nth-child(4)').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#btn-plus-1')
      .click()
      .should(() => {
        expect(localStorage.getItem('eta_vue_data')).not.to.be.null
        const { last, first } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(1)
      })
  })

  it('1 click on plus-1, target = 10', () => {
    cy.get('#select-mode').parent().click()
    cy.get('.v-list > :nth-child(3)').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#input-target').clear().type('10{enter}')
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#btn-plus-1')
      .click()
      .should(() => {
        expect(localStorage.getItem('eta_vue_target')).to.eq('10')
        expect(localStorage.getItem('eta_vue_data')).not.to.be.null
        const { last, first } = getEtaLocalStorageDataFistLastRowItems()
        expect(first).to.eq(1)
        expect(last).to.eq(1)
      })
  })

  it('1 click on plus-1, target = 0, items = 123', () => {
    cy.get('#select-mode').parent().click()
    cy.get('.v-list > :nth-child(2)').click()
    cy.get('#input-items').type('123{enter}')

    cy.get('#btn-plus-1').click()
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_target')).to.eq('0')
      expect(localStorage.getItem('eta_vue_data')).not.to.be.null
      const { last, first } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(123)
      expect(last).to.eq(122)
    })
  })

  it('10 clicks on plus-1, target = none', () => {
    cy.get('#select-mode').parent().click()
    cy.get('.v-list > :nth-child(4)').click()
    for (let n = 0; n < 10; n++) {
      cy.get('#btn-plus-1').click()
    }
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_data')).not.to.be.null
      const { last, first } = getEtaLocalStorageDataFistLastRowItems()
      expect(first).to.eq(1)
      expect(last).to.eq(10)
    })
  })
})
