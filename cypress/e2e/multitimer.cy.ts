import { getMTLocalStorageDataFistLastRowItems } from './helper-cy'

function enterTimer(name: string, time: string) {
  cy.get('#input-name').type(name)
  cy.get('#input-time').type(`${time}{enter}`)
}

describe('Tests Multi-Timer', () => {
  beforeEach(() => {
    cy.visit('eta/').visit('eta/multitimer')
  })

  it('12s timer', () => {
    enterTimer('MyTestTimerName s', '12s')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName s')
      expect(lastName).to.eq('MyTestTimerName s')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 12 * 1000)
    })
  })

  it('1.2min timer 1', () => {
    enterTimer('MyTestTimerName m', '1.2')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName m')
      expect(lastName).to.eq('MyTestTimerName m')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 60 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 60 * 1000 - 1000)
    })
  })

  it('1.2min timer 2', () => {
    enterTimer('MyTestTimerName m', '1.2m')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName m')
      expect(lastName).to.eq('MyTestTimerName m')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 60 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 60 * 1000 - 1000)
    })
  })

  it('1.2min timer 3', () => {
    enterTimer('MyTestTimerName m', '1,2m')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName m')
      expect(lastName).to.eq('MyTestTimerName m')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 60 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 60 * 1000 - 1000)
    })
  })

  it('1.2min timer 4', () => {
    enterTimer('MyTestTimerName m', '1:12m')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName m')
      expect(lastName).to.eq('MyTestTimerName m')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 60 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 60 * 1000 - 1000)
    })
  })

  it('1.2h timer', () => {
    enterTimer('MyTestTimerName h', '1.2h')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName h')
      expect(lastName).to.eq('MyTestTimerName h')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 3600 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 3600 * 1000 - 1000)
    })
  })

  it('1.2d timer', () => {
    enterTimer('MyTestTimerName d', '1.2d')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName d')
      expect(lastName).to.eq('MyTestTimerName d')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.2 * 24 * 3600 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.2 * 24 * 3600 * 1000 - 1000)
    })
  })

  it('add and delete 1 timer', () => {
    enterTimer('MyTestTimerName', '1.1h')
    cy.should(() => {
      const { firstName, firstEnd, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName')
      expect(lastName).to.eq('MyTestTimerName')
      expect(firstEnd.getTime()).to.be.lt(new Date().getTime() + 1.1 * 3600 * 1000)
      expect(firstEnd.getTime()).to.be.gt(new Date().getTime() + 1.1 * 3600 * 1000 - 1000)
    })
    // delete 1 timer
    cy.get('#btn-del-row-0').click({ force: true })
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_mt_data')).to.be.null
    })
  })

  it('add 2 timers', () => {
    enterTimer('MyTestTimerName1', '1.1h')
    enterTimer('MyTestTimerName2', '2.1h')

    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName1')
      expect(lastName).to.eq('MyTestTimerName2')
    })
  })

  it('add 3 timers, del 1st', () => {
    enterTimer('MyTestTimerName1', '1.1h')
    enterTimer('MyTestTimerName2', '2.1h')
    enterTimer('MyTestTimerName3', '3.1h')
    // delete button
    cy.get('#btn-del-row-0').click({ force: true })
    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName2')
      expect(lastName).to.eq('MyTestTimerName3')
    })
  })

  it('deleteAll', () => {
    enterTimer('MyTestTimerName1', '1.1h')
    enterTimer('MyTestTimerName2', '2.1h')

    cy.should(() => {
      const { firstName, lastName } = getMTLocalStorageDataFistLastRowItems()
      expect(firstName).to.eq('MyTestTimerName1')
      expect(lastName).to.eq('MyTestTimerName2')
    })

    cy.get('#btn-deleteAll').click({ force: true })
    cy.should(() => {
      expect(localStorage.getItem('eta_vue_mt_data')).to.be.null
    })
  })
})
