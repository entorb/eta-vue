import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InputItemsAndTarget from '../InputItemsAndTarget.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initializeWrapper(wrapper) {}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(InputItemsAndTarget, {
      props: { target: undefined }
    })
    initializeWrapper(wrapper)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
