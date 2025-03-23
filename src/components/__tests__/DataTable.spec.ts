import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import DataTable from '../DataTable.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function initializeWrapper(wrapper) {}

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(DataTable, {
      props: { data: [], settings: { showDays: false, unitSpeed: 'min' } }
    })
    initializeWrapper(wrapper)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
