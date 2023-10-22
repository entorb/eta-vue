import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TooltipSpeed from '../TooltipSpeed.vue'

describe('speedInUnit', () => {
  it('ips=0.0123 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 0.0123 }
    })
    expect(wrapper.vm.speedInUnit).toBe('0.0123/s')
  })
  it('ips=123 unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'sec', ips: 123 }
    })
    expect(wrapper.vm.speedInUnit).toBe('123/s')
  })

  it('unit=min', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'min', ips: 0.0123 / 60 }
    })
    const expectedOutput = '0.0123/m'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
  it('unit=hour', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'hour', ips: 123 / 3600 }
    })
    const expectedOutput = '123/h'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
  it('unit=day', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: { unit: 'day', ips: 123 / 3600 / 24 }
    })
    const expectedOutput = '123/d'
    const speedInUnit = wrapper.vm.speedInUnit
    expect(speedInUnit).toBe(expectedOutput)
  })
})
