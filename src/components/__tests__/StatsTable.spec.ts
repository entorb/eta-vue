import { describe, it, expect, beforeEach } from 'vitest' // vi
import { shallowMount } from '@vue/test-utils'
import StatsTable from '../StatsTable.vue'
// import { DataRowType } from '../../types'

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(StatsTable, {
      props: { data: [], settings: { showDays: false, unitSpeed: 'min' } }
    })
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('target=100', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(StatsTable, {
      props: {
        target: 100,
        data: [
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 0)), items: 10, speed: 0 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 1)), items: 12, speed: 2 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 2)), items: 14, speed: 2 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 3)), items: 16, speed: 2 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
  })

  it('load', () => {
    // console.log(wrapper.vm.props.data)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.itemsFirst).toEqual(10)
    expect(wrapper.vm.itemsLast).toEqual(16)
    expect(wrapper.vm.eta).toEqual(new Date(Date.UTC(2025, 1, 1, 1, 0, 45)))
    expect(wrapper.vm.percentOfTarget).toEqual(0.16)
    expect(wrapper.vm.itemsTotal).toEqual(100)
    expect(wrapper.vm.itemsDone).toEqual(16)
    expect(wrapper.vm.itemsPerSec).toEqual(2)
  })

  it('resetStats', async () => {
    await wrapper.vm.resetStats()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.itemsFirst).toEqual(0)
    expect(wrapper.vm.itemsLast).toEqual(0)
    expect(wrapper.vm.eta).toEqual(new Date(0))
    expect(wrapper.vm.percentOfTarget).toEqual(0)
    expect(wrapper.vm.itemsTotal).toEqual(0)
    expect(wrapper.vm.itemsDone).toEqual(0)
    expect(wrapper.vm.itemsPerSec).toEqual(0)
  })

  it('timer_triggered_function', async () => {
    expect(wrapper.vm.targetReached).toEqual(false)
    await wrapper.vm.timer_triggered_function()
    expect(wrapper.vm.targetReached).toEqual(true)
    expect(wrapper.vm.itemsEstimated).toEqual(100)
  })
})

describe('target=0', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(StatsTable, {
      props: {
        target: 0,
        data: [
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 0)), items: 10, speed: 0 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 1)), items: 8, speed: 2 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 2)), items: 6, speed: 2 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 3)), items: 4, speed: 2 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
  })

  it('load', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.itemsFirst).toEqual(10)
    expect(wrapper.vm.itemsLast).toEqual(4)
    expect(wrapper.vm.eta).toEqual(new Date(Date.UTC(2025, 1, 1, 1, 0, 5)))
    expect(wrapper.vm.percentOfTarget).toEqual(0.6)
    expect(wrapper.vm.itemsTotal).toEqual(10)
    expect(wrapper.vm.itemsDone).toEqual(6)
    expect(wrapper.vm.itemsPerSec).toEqual(-2)
  })

  it('resetStats', async () => {
    await wrapper.vm.resetStats()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.itemsFirst).toEqual(0)
    expect(wrapper.vm.itemsLast).toEqual(0)
    expect(wrapper.vm.eta).toEqual(new Date(0))
    expect(wrapper.vm.percentOfTarget).toEqual(0)
    expect(wrapper.vm.itemsTotal).toEqual(0)
    expect(wrapper.vm.itemsDone).toEqual(0)
    expect(wrapper.vm.itemsPerSec).toEqual(0)
  })

  it('timer_triggered_function', async () => {
    expect(wrapper.vm.targetReached).toEqual(false)
    await wrapper.vm.timer_triggered_function()
    expect(wrapper.vm.targetReached).toEqual(true)
    expect(wrapper.vm.itemsEstimated).toEqual(0)
  })
})

describe('target=50 reached', () => {
  let wrapper

  it('50/50', () => {
    wrapper = shallowMount(StatsTable, {
      props: {
        target: 50,
        data: [
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 0)), items: 0, speed: 0 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 1)), items: 10, speed: 10 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 2)), items: 20, speed: 10 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 3)), items: 30, speed: 10 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 4)), items: 40, speed: 10 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 5)), items: 50, speed: 10 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.itemsFirst).toEqual(0)
    expect(wrapper.vm.itemsLast).toEqual(50)
    expect(wrapper.vm.eta).toEqual(new Date(0))
    expect(wrapper.vm.percentOfTarget).toEqual(1)
    expect(wrapper.vm.itemsTotal).toEqual(50)
    expect(wrapper.vm.itemsDone).toEqual(50)
    expect(wrapper.vm.itemsPerSec).toEqual(10)
  })

  it('60/50', () => {
    wrapper = shallowMount(StatsTable, {
      props: {
        target: 50,
        data: [
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 0)), items: 0, speed: 0 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 1)), items: 20, speed: 20 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 2)), items: 40, speed: 20 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 3)), items: 60, speed: 20 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
    expect(wrapper.props('data').length).toEqual(4)
    expect(wrapper.vm.percentOfTarget).toEqual(1.2)
    expect(wrapper.vm.itemsTotal).toEqual(50)
    expect(wrapper.vm.itemsDone).toEqual(60)
  })

  it('timer_triggered_function', async () => {
    wrapper = shallowMount(StatsTable, {
      props: {
        target: 50,
        data: [
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 0)), items: 0, speed: 0 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 1)), items: 20, speed: 20 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 2)), items: 40, speed: 20 },
          { date: new Date(Date.UTC(2025, 1, 1, 1, 0, 3)), items: 60, speed: 20 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
    expect(wrapper.vm.targetReached).toEqual(true)
    await wrapper.vm.timer_triggered_function()
    expect(wrapper.vm.targetReached).toEqual(true)
    expect(wrapper.vm.itemsEstimated).toEqual(50)
  })
})
