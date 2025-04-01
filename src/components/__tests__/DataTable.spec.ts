import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import DataTable from '../DataTable.vue'

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(DataTable, {
      props: { data: [], settings: { showDays: false, unitSpeed: 'min' } }
    })
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
