import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import App from '../App.vue'

function initializeWrapper(wrapper) {
  localStorage.clear()
  wrapper.vm.data = []
  wrapper.vm.settings = {}
}

describe('App', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
  })

  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('setTarget', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
  })

  it('target = 10', () => {
    const value = 10
    wrapper.vm.setTarget(value)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored)).toBe(value)
  })

  it('target = 0', () => {
    const value = 0
    wrapper.vm.setTarget(value)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored)).toBe(value)
  })

  it('target undefinded', () => {
    const value = undefined
    wrapper.vm.setTarget(value)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(null)
  })

  it('target -1 -> unchanged', () => {
    const value = 10
    wrapper.vm.setTarget(value)
    wrapper.vm.setTarget(-1)

    expect(wrapper.vm.target).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored)).toBe(value)
  })
})

describe('setUnitOfSpeed', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
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
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), value: 100 })
  })

  it('1x addRow', () => {
    expect(wrapper.vm.data[0].date).toStrictEqual(new Date('2023-10-17T12:00:00'))
    expect(wrapper.vm.data[0].value).toBe(100)
    expect(wrapper.vm.data[0].speed).toBe(0)
  })

  it('2x addRow -> speed', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:13'), value: 113 })

    expect(wrapper.vm.data[0].speed).toBe(0)
    expect(wrapper.vm.data[1].speed).toBe(1)
  })
})

describe('decideIfToShowDays', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), value: 100 })
  })

  it('<24h', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-17T16:00:00'), value: 113 })

    expect(wrapper.vm.settings.showDays).toBe(false)
  })

  it('>=24h', () => {
    wrapper.vm.addRow({ date: new Date('2023-10-18T12:00:00'), value: 113 })

    expect(wrapper.vm.settings.showDays).toBe(true)
  })
})

describe('plus1', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:00'), value: 100 })
  })

  it('target > 0', () => {
    wrapper.vm.setTarget(100)
    wrapper.vm.plus1()

    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[1].value).toBe(101)
  })

  it('target undefined', () => {
    wrapper.vm.setTarget(undefined)
    wrapper.vm.plus1()

    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[1].value).toBe(101)
  })

  it('target == 0', () => {
    wrapper.vm.setTarget(0)
    wrapper.vm.plus1()

    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[1].value).toBe(99)
  })
})

describe('deleteRow', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:01'), value: 1 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:02'), value: 2 })
    wrapper.vm.addRow({ date: new Date('2023-10-17T12:00:03'), value: 4 })
  })

  it('del row 0', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(0)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].value).toBe(2)
    expect(wrapper.vm.data[1].value).toBe(4)
    expect(wrapper.vm.data[1].speed).toBe(2)
  })

  it('del row 1', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(1)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].value).toBe(1)
    expect(wrapper.vm.data[1].value).toBe(4)
    expect(wrapper.vm.data[1].speed).toBe(1.5)
  })

  it('del row 2', () => {
    expect(wrapper.vm.data.length).toBe(3)
    wrapper.vm.deleteRow(2)
    expect(wrapper.vm.data.length).toBe(2)
    expect(wrapper.vm.data[0].value).toBe(1)
    expect(wrapper.vm.data[1].value).toBe(2)
    expect(wrapper.vm.data[1].speed).toBe(1)
  })
})

describe('readLocalStorageData', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App)
    initializeWrapper(wrapper)
  })

  it('3 rows', () => {
    localStorage.setItem(
      'eta_vue_data',
      JSON.stringify([
        { date: new Date('2023-10-17T12:00:01'), value: 1 },
        { date: new Date('2023-10-17T12:00:02'), value: 2 },
        { date: new Date('2023-10-17T12:00:03'), value: 4 }
      ])
    )

    wrapper.vm.readLocalStorageData()
    expect(wrapper.vm.data.length).toBe(3)
    expect(wrapper.vm.data[0].value).toBe(1)
    expect(wrapper.vm.data[1].value).toBe(2)
    expect(wrapper.vm.data[1].speed).toBe(1)
    expect(wrapper.vm.data[2].value).toBe(4)
    expect(wrapper.vm.data[2].speed).toBe(2)
  })
})
