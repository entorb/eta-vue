import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MainMultiTimer from '../MainMultiTimer.vue'

function initializeWrapper(wrapper) {
  localStorage.clear()
  wrapper.vm.data.value = []
  wrapper.vm.recentTimerNames.value = []
}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainMultiTimer)
    initializeWrapper(wrapper)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

describe('recentTimerStuff', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainMultiTimer)
    initializeWrapper(wrapper)
  })

  it('genRecentTimerName abc:123h', () => {
    expect(wrapper.vm.genRecentTimerName(' a:b"c ', 123, 'hour')).toBe('abc:123h')
  })

  it('parseRecentTimerName abc:123h', () => {
    expect(wrapper.vm.parseRecentTimerName('abc:123h')).toStrictEqual({
      name: 'abc',
      time: 123,
      unit: 'hour'
    })
  })
})
