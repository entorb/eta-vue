import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MainInfo from '../MainInfo.vue'

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(MainInfo)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
