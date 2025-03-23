import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MainEta from '../MainEta.vue'

function initializeWrapper(wrapper) {
  localStorage.clear()
  wrapper.vm.data = []
  wrapper.vm.target = undefined
  wrapper.vm.settings = {}
}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('setTarget', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
  })

  it('target = 10', () => {
    const value = 10
    wrapper.vm.setTarget(value)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })

  it('target = 0', () => {
    const value = 0
    wrapper.vm.setTarget(value)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })

  it('target -1 -> unchanged', () => {
    const value = 10
    wrapper.vm.setTarget(value)
    wrapper.vm.setTarget(-1)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })
})

describe('setUnitOfSpeed', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
  })
  it('sec, min, hour, day', () => {
    wrapper.vm.setUnitOfSpeed('sec')
    expect(wrapper.vm.settings.unitSpeed).toBe('sec')
    wrapper.vm.setUnitOfSpeed('min')
    expect(wrapper.vm.settings.unitSpeed).toBe('min')
    wrapper.vm.setUnitOfSpeed('hour')
    expect(wrapper.vm.settings.unitSpeed).toBe('hour')
    wrapper.vm.setUnitOfSpeed('day')
    expect(wrapper.vm.settings.unitSpeed).toBe('day')
  })
})

describe('addRow', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('1x addRow', () => {
    expect(wrapper.vm.data[0].date).toStrictEqual(new Date('2023-10-17T12:00:00'))
    expect(wrapper.vm.data[0].items).toBe(100)
    expect(wrapper.vm.data[0].speed).toBe(0)
  })

  it('2x addRow -> speed', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:13'), items: 113 })

    expect(wrapper.vm.data[0].speed).toBe(0)
    expect(wrapper.vm.data[1].speed).toBe(1)
  })
})

describe('decideIfToShowDays', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('<24h', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-17T16:00:00'), items: 113 })

    expect(wrapper.vm.settings.showDays).toBe(false)
  })

  it('>=24h', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-18T12:00:00'), items: 113 })

    expect(wrapper.vm.settings.showDays).toBe(true)
  })
})

describe('plus1', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('target > 0', () => {
    wrapper.vm.setTarget(100)
    wrapper.vm.plus1()

    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[1].items).toBe(101)
  })

  it('target == 0', () => {
    wrapper.vm.setTarget(0)
    wrapper.vm.plus1()

    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[1].items).toBe(99)
  })
})

describe('deleteRow', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('del row 0', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(0)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].items).toBe(2)
    expect(wrapper.vm.data[1].items).toBe(4)
    expect(wrapper.vm.data[1].speed).toBe(2)
  })

  it('del row 1', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(1)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].items).toBe(1)
    expect(wrapper.vm.data[1].items).toBe(4)
    expect(wrapper.vm.data[1].speed).toBe(1.5)
  })

  it('del row 2', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(2)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].items).toBe(1)
    expect(wrapper.vm.data[1].items).toBe(2)
    expect(wrapper.vm.data[1].speed).toBe(1)
  })
})

describe('readLocalStorageData', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
  })

  it('3 rows', () => {
    localStorage.setItem(
      'eta_vue_data',
      JSON.stringify([
        { date: new Date('2023-10-17T12:00:01'), items: 1 },
        { date: new Date('2023-10-17T12:00:02'), items: 2 },
        { date: new Date('2023-10-17T12:00:03'), items: 4 }
      ])
    )

    wrapper.vm.readLocalStorageData()
    expect(wrapper.vm.data.length).toBe(3)
    expect(wrapper.vm.data[0].items).toBe(1)
    expect(wrapper.vm.data[1].items).toBe(2)
    expect(wrapper.vm.data[1].speed).toBe(1)
    expect(wrapper.vm.data[2].items).toBe(4)
    expect(wrapper.vm.data[2].speed).toBe(2)
  })
})

describe('deleteAllData', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('del all', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteAllData()
    expect(wrapper.vm.data.length).toBe(0)
    expect(localStorage.getItem('eta_vue_data')).toBe(null)
    // expect(wrapper.vm.target).toBe(0)
    // expect(localStorage.getItem('eta_vue_target')).toBe(null)
  })
})
