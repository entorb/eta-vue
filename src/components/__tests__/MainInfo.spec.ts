import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import MainInfo from '../MainInfo.vue'

describe('Component renders', () => {
  let wrapper: ReturnType<typeof shallowMount>
  beforeEach(() => {
    wrapper = shallowMount(MainInfo)
  })
  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
