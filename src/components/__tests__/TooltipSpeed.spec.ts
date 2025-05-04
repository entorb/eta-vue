import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TooltipSpeed from '../TooltipSpeed.vue'

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 0.0123 }
    })
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('speedInUnit', () => {
  it('ips=0.0123 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 0.0123 }
    })
    expect(wrapper.vm.speedInUnit).toBe('0.0123')
  })
  it('ips=12.3 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 12.3 }
    })
    expect(wrapper.vm.speedInUnit).toBe('12.3')
  })
  it('ips=123 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 123 }
    })
    expect(wrapper.vm.speedInUnit).toBe('123')
  })
  it('ips=123456 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 123456 }
    })
    expect(wrapper.vm.speedInUnit).toBe('123456')
  })
  it('ips=123456789 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 123456789 }
    })
    expect(wrapper.vm.speedInUnit).toBe('123456789')
  })
  it('ips=1234567890123456 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 1234567890123456 }
    })
    expect(wrapper.vm.speedInUnit).toBe('1234567890123456')
  })

  it('10/s == 600 min', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'min', ips: 10 }
    })
    const expectedOutput = '600'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })

  it('12.3 in sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 12.3 }
    })
    const expectedOutput = '12.3'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
  it('12.3 in min', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'min', ips: 12.3 / 60 }
    })
    const expectedOutput = '12.3'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
  it('12.3 in hour', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'hour', ips: 12.3 / 3600 }
    })
    const expectedOutput = '12.3'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
  it('12.3 in day', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'day', ips: 12.3 / 3600 / 24 }
    })
    const expectedOutput = '12.3'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
})

describe('speedInUnit', () => {
  it('ips=0.0123 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {})
    let ips = 1 / 60 // 1/min
    expect(wrapper.vm.minPerItem(ips)).toBe('1.00')
    ips = 1 / 120 // 2/min
    expect(wrapper.vm.minPerItem(ips)).toBe('2.00')
    ips = 1 // 1/sec
    expect(wrapper.vm.minPerItem(ips)).toBe('0.0167')
  })
})
