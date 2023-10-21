import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import TooltipSpeed from '../TooltipSpeed.vue'

describe('testing speedInUnit', () => {
  it('unit=sec', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: {
        unit: 'sec',
        ips: 1
      }
    })
    expect(wrapper.vm.speedInUnit(0.0123)).toBe('0.0123/sec')
    expect(wrapper.vm.speedInUnit(1000)).toBe('1000/sec')
  })
  it('unit=min', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: {
        unit: 'min',
        ips: 1
      }
    })
    expect(wrapper.vm.speedInUnit(0.0123 / 60)).toBe('0.0123/min')
    expect(wrapper.vm.speedInUnit(1000 / 60)).toBe('1000/min')
  })
  it('unit=hour', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: {
        unit: 'hour',
        ips: 1
      }
    })
    expect(wrapper.vm.speedInUnit(0.0123 / 3600)).toBe('0.0123/h')
    expect(wrapper.vm.speedInUnit(1000 / 3600)).toBe('1000/h')
  })
  it('unit=day', () => {
    const wrapper = shallowMount(TooltipSpeed, {
      props: {
        unit: 'day',
        ips: 1
      }
    })
    expect(wrapper.vm.speedInUnit(0.0123 / 86400)).toBe('0.0123/day')
    expect(wrapper.vm.speedInUnit(1000 / 86400)).toBe('1000/day')
  })
})
