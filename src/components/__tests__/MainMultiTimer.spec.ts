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

describe('timer naming', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainMultiTimer)
    initializeWrapper(wrapper)
  })

  it('genTimerName abc:123h', () => {
    expect(wrapper.vm.genTimerName(' a:b"c ', 123, 'hour')).toBe('abc:123h')
  })

  it('parseTimerName abc:123h', () => {
    expect(wrapper.vm.parseTimerName('abc:123h')).toStrictEqual({
      name: 'abc',
      time: 123,
      unit: 'hour'
    })
  })
})

describe('timer creation', () => {
  let wrapper
  beforeEach(async () => {
    wrapper = shallowMount(MainMultiTimer)
    initializeWrapper(wrapper)
    await wrapper.vm.deleteAll()
  })

  it('addViaInput 20', async () => {
    wrapper.vm.inputName = 'Timer20m'
    wrapper.vm.inputTime = '20m'
    await wrapper.vm.addViaInput()
    // console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer20m')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(1200)
  })

  it('addViaInput 2.5', async () => {
    wrapper.vm.inputName = 'Timer2.5m'
    wrapper.vm.inputTime = '2,5'
    await wrapper.vm.addViaInput()
    // console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer2.5m')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(150)
  })

  it('addViaInput 2,5 unnamed', async () => {
    wrapper.vm.inputName = ''
    wrapper.vm.inputTime = '2,5'
    await wrapper.vm.addViaInput()
    console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(150)
  })

  it('addViaInput 10s', async () => {
    wrapper.vm.inputName = 'Timer10s'
    wrapper.vm.inputTime = '10s'
    await wrapper.vm.addViaInput()
    expect(wrapper.vm.data[0].name).toEqual('Timer10s')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(10)
    // console.log(wrapper.vm.data)
  })

  it('addViaInput 20m', async () => {
    wrapper.vm.inputName = 'Timer20m'
    wrapper.vm.inputTime = '20m'
    await wrapper.vm.addViaInput()
    console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer20m')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(1200)
  })

  it('addViaInput 3h', async () => {
    wrapper.vm.inputName = 'Timer3h'
    wrapper.vm.inputTime = '3h'
    await wrapper.vm.addViaInput()
    console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer3h')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(3 * 3600)
  })

  it('addViaInput 2d', async () => {
    wrapper.vm.inputName = 'Timer2d'
    wrapper.vm.inputTime = '2d'
    await wrapper.vm.addViaInput()
    console.log(wrapper.vm.data)
    expect(wrapper.vm.data[0].name).toEqual('Timer2d')
    expect(Math.round(wrapper.vm.data[0].remainingTime)).toEqual(2 * 24 * 3600)
  })
})
