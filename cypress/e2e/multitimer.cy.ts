import { getMTLocalStorageDataFistLastRowItems } from './helper-cy'

function enterTimer(name: string, unit: string, time: string) {
  cy.get('#input-name').type(name)
  cy.get('#select-unit').parent().click()
  cy.contains(unit).click()
  cy.get('#input-time').type(time + '{enter}')
}

describe('Tests Multi-Timer', () => {
  beforeEach(() => {
    cy.visit('eta/').visit('eta/multitimer')
  })

  it('add and delete 1 timer', () => {
    enterTimer('MyTestTimerName', 'hour', '1.1')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName')
      expect(lastName).to.eq('MyTestTimerName')
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.05 * 3600 * 1000)
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.15 * 3600 * 1000)
    })
    // delete 1 timer button
    cy.get('tbody > :nth-child(1) > .text-center > .v-btn').click()
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_multitimer')).to.be.null
    })
  })

  it('add 2 timer', () => {
    enterTimer('MyTestTimerName1', 'hour', '1.1')
    enterTimer('MyTestTimerName2', 'hour', '2.1')

    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName1')
      expect(lastName).to.eq('MyTestTimerName2')
    })
  })

  it('add 3 timer, del 1st', () => {
    enterTimer('MyTestTimerName1', 'hour', '1.1')
    enterTimer('MyTestTimerName2', 'hour', '2.1')
    enterTimer('MyTestTimerName3', 'hour', '3.1')
    // delete button
    cy.get('tbody > :nth-child(1) > .text-center > .v-btn').click()
    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName2')
      expect(lastName).to.eq('MyTestTimerName3')
    })
  })

  it('deleteAll', () => {
    enterTimer('MyTestTimerName1', 'hour', '1.1')
    enterTimer('MyTestTimerName2', 'hour', '2.1')

    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName1')
      expect(lastName).to.eq('MyTestTimerName2')
    })

    cy.get('#btn-deleteAll').click()
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_multitimer')).to.be.null
    })
  })
})
