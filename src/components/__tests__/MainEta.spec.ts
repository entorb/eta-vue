import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MainEta from '../MainEta.vue'
import { useEtaData } from '../../composables/useEtaData'

function initializeComposable(composable) {
  localStorage.clear()
  composable.data.value = []
  composable.target.value = 0
  composable.settings.value = { showDays: false, unitSpeed: 'min' }
}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainEta)
    localStorage.clear()
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('setTarget', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
  })

  it('target = 10', () => {
    const value = 10
    composable.setTarget(value)

    expect(composable.target.value).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })

  it('target = 0', () => {
    const value = 0
    composable.setTarget(value)

    expect(composable.target.value).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })

  it('target -1 -> unchanged', () => {
    const value = 10
    composable.setTarget(value)
    composable.setTarget(-1)

    expect(composable.target.value).toBe(value)
    const stored = localStorage.getItem('eta_vue_target')
    expect(stored).toBe(value.toString())
    expect(parseFloat(stored as string)).toBe(value)
  })
})

describe('setUnitOfSpeed', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
  })
  it('sec, min, hour, day', () => {
    composable.updateItemsPerSec(10)
    expect(composable.settings.value.unitSpeed).toBe('sec')
    composable.updateItemsPerSec(0.5)
    expect(composable.settings.value.unitSpeed).toBe('min')
    composable.updateItemsPerSec(0.0001)
    expect(composable.settings.value.unitSpeed).toBe('hour')
    composable.updateItemsPerSec(0.00001)
    expect(composable.settings.value.unitSpeed).toBe('day')
  })
})

describe('addRow', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('1x addRow', () => {
    expect(composable.data.value[0].date).toStrictEqual(new Date('2023-10-17T12:00:00'))
    expect(composable.data.value[0].items).toBe(100)
    expect(composable.data.value[0].speed).toBe(0)
  })

  it('2x addRow -> speed', () => {
    composable.addRow({ date: new Date('2023-10-17T12:00:13'), items: 113 })

    expect(composable.data.value[0].speed).toBe(0)
    expect(composable.data.value[1].speed).toBe(1)
  })
})

describe('plus1', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('target > 0', () => {
    composable.setTarget(100)
    composable.incrementByOne()

    expect(composable.data.value).toHaveLength(2)
    expect(composable.data.value[1].items).toBe(101)
  })

  it('target == 0', () => {
    composable.setTarget(0)
    composable.incrementByOne()

    expect(composable.data.value).toHaveLength(2)
    expect(composable.data.value[1].items).toBe(99)
  })
})

describe('deleteRow', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    composable.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    composable.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('del row 0', () => {
    expect(composable.data.value).toHaveLength(3)
    composable.deleteRow(0)
    expect(composable.data.value).toHaveLength(2)
    expect(composable.data.value[0].items).toBe(2)
    expect(composable.data.value[1].items).toBe(4)
    expect(composable.data.value[1].speed).toBe(2)
  })

  it('del row 1', () => {
    expect(composable.data.value).toHaveLength(3)
    composable.deleteRow(1)
    expect(composable.data.value).toHaveLength(2)
    expect(composable.data.value[0].items).toBe(1)
    expect(composable.data.value[1].items).toBe(4)
    expect(composable.data.value[1].speed).toBe(1.5)
  })

  it('del row 2', () => {
    expect(composable.data.value).toHaveLength(3)
    composable.deleteRow(2)
    expect(composable.data.value).toHaveLength(2)
    expect(composable.data.value[0].items).toBe(1)
    expect(composable.data.value[1].items).toBe(2)
    expect(composable.data.value[1].speed).toBe(1)
  })
})

describe('readLocalStorageData', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
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

    composable.loadFromStorage()
    expect(composable.data.value).toHaveLength(3)
    expect(composable.data.value[0].items).toBe(1)
    expect(composable.data.value[1].items).toBe(2)
    expect(composable.data.value[1].speed).toBe(1)
    expect(composable.data.value[2].items).toBe(4)
    expect(composable.data.value[2].speed).toBe(2)
  })
})

describe('deleteAllData', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    composable.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    composable.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('del all', () => {
    expect(composable.data.value).toHaveLength(3)
    composable.deleteAll()
    expect(composable.data.value).toHaveLength(0)
    expect(localStorage.getItem('eta_vue_data')).toBeNull()
    expect(composable.target.value).toBe(0)
    expect(localStorage.getItem('eta_vue_target')).toBeNull()
  })
})

describe('decideIfToShowDays', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:00'), items: 100 })
  })

  it('<24h', () => {
    composable.addRow({ date: new Date('2023-10-17T16:00:00'), items: 113 })

    expect(composable.settings.value.showDays).toBe(false)
  })

  it('>=24h', () => {
    composable.addRow({ date: new Date('2023-10-18T12:00:00'), items: 113 })

    expect(composable.settings.value.showDays).toBe(true)
  })
})

describe('calcSpeeds', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    composable.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    composable.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('works', () => {
    expect(composable.data.value[0].speed).toBe(0)
    expect(composable.data.value[1].speed).toBe(1)
    expect(composable.data.value[2].speed).toBe(2)
    // modify
    composable.data.value[1].speed = 12.3
    expect(composable.data.value[1].speed).toBe(12.3)
    // recalculate speeds by updating a row
    composable.updateRow(1, { date: new Date('2023-10-17T12:00:02'), items: 2 })
    expect(composable.data.value[0].speed).toBe(0)
    expect(composable.data.value[1].speed).toBe(1)
    expect(composable.data.value[2].speed).toBe(2)
  })
})

describe('updateRow', () => {
  let composable
  beforeEach(() => {
    composable = useEtaData()
    initializeComposable(composable)
    composable.addRow({ date: new Date('2023-10-17T12:00:01'), items: 1 })
    composable.addRow({ date: new Date('2023-10-17T12:00:02'), items: 2 })
    composable.addRow({ date: new Date('2023-10-17T12:00:03'), items: 4 })
  })

  it('update items', () => {
    expect(composable.data.value[0].speed).toBe(0)
    expect(composable.data.value[1].speed).toBe(1)
    expect(composable.data.value[2].speed).toBe(2)
    composable.updateRow(1, { date: new Date('2023-10-17T12:00:02'), items: 3 })
    expect(composable.data.value[0].speed).toBe(0)
    expect(composable.data.value[1].speed).toBe(2)
    expect(composable.data.value[2].speed).toBe(1)
    expect(composable.data.value[1].items).toBe(3)
  })

  it('update date', () => {
    expect(composable.data.value[0].items).toBe(1)
    expect(composable.data.value[1].items).toBe(2)
    expect(composable.data.value[2].items).toBe(4)
    composable.updateRow(1, { date: new Date('2023-10-17T12:00:00'), items: 0 })
    expect(composable.data.value[0].items).toBe(0)
    expect(composable.data.value[1].items).toBe(1)
    expect(composable.data.value[1].speed).toBe(1)
    expect(composable.data.value[2].items).toBe(4)
    expect(composable.data.value[2].speed).toBe(1.5)
  })
})
