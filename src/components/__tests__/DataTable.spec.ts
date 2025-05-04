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
  it('renders the edit dialog', () => {
    wrapper.showEditDialog = true
    expect(wrapper.exists()).toBe(true)
    console.log(wrapper.dialogData)
  })
})

describe('Edit dialog', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(DataTable, {
      props: {
        data: [
          { date: new Date('2023-12-17T12:00:01Z'), items: 1, speed: 0 },
          { date: new Date('2023-12-17T12:00:02Z'), items: 2, speed: 1 },
          { date: new Date('2023-12-17T12:00:03Z'), items: 3, speed: 1 }
        ],
        settings: { showDays: false, unitSpeed: 'min' }
      }
    })
  })
  it('renders', () => {
    wrapper.vm.openEditDialog(1)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.showEditDialog).toBe(true)
    expect(wrapper.vm.dialogData.items).toBe('2')
    expect(wrapper.vm.dialogData.localDateString).toBe('2023-12-17T13:00:02')
  })
})
