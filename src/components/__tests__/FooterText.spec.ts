import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FooterText from '../FooterText.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initializeWrapper(wrapper) {}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(FooterText)
    initializeWrapper(wrapper)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
