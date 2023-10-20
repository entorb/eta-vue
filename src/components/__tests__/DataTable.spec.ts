import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import DataTable from '../DataTable.vue'

describe('testing DataTable', () => {
  it('calculates items per second when index is positive', () => {
    const data = [
      { date: new Date('2023-10-17T12:00:00'), value: 100 },
      { date: new Date('2023-10-17T12:01:00'), value: 130 },
      { date: new Date('2023-10-17T12:02:00'), value: 200 },
    ]

    const wrapper = shallowMount(DataTable, {
      props: {
        data,
      },
    })
    const itemsPerSec = wrapper.vm.calculateItemsPerSecFromPreviousLine(1)
    expect(itemsPerSec).toBe(0.5)
  })

  it('empty data', () => {
    const data = [{ date: new Date('2023-10-17T12:00:00'), value: 100 }]

    const wrapper = shallowMount(DataTable, {
      props: {
        data,
      },
    })
    const itemsPerSec = wrapper.vm.calculateItemsPerSecFromPreviousLine(0)
    expect(itemsPerSec).toBe(0)
  })
})
