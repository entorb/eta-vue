import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import StatsTable from '../StatsTable.vue'

describe('Component renders', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(StatsTable, {
      props: { data: [], settings: { showDays: false, unitSpeed: 'min' } }
    })
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
