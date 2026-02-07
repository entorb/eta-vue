import { ref, computed } from 'vue'

import { helperCalcSpeedFromPreviousRow } from '../helper'
import type { DataRowType, DataRowRedType, UnitType } from '../types'

const STORAGE_KEY_DATA = 'eta_vue_data'
const STORAGE_KEY_TARGET = 'eta_vue_target'
const DAY_IN_MS = 86400 * 1000

export function useEtaData() {
  const target = ref(0)
  const data = ref<DataRowType[]>([])
  const settings = ref({ showDays: true, unitSpeed: 'min' as UnitType })
  const itemsPerSec = ref(0)

  const current = computed(() => {
    const lastRow = data.value[data.value.length - 1]
    return lastRow?.items ?? NaN
  })

  const hasData = computed(() => data.value.length > 0)
  const hasMultipleRows = computed(() => data.value.length >= 2)

  function loadFromStorage() {
    const storedTarget = localStorage.getItem(STORAGE_KEY_TARGET)
    if (storedTarget) {
      target.value = parseFloat(storedTarget)
    }

    const storedData = localStorage.getItem(STORAGE_KEY_DATA)
    if (storedData) {
      const parsed = JSON.parse(storedData)
      data.value = parsed.map(({ date, items }: DataRowRedType) => ({
        date: new Date(date),
        items,
        speed: 0
      }))
      recalculateSpeeds()
    }

    updateShowDays()
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY_TARGET, target.value.toString())
    const dataToStore = data.value.map(({ date, items }) => ({ date, items }))
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dataToStore))
  }

  function setTarget(newTarget: number) {
    if (newTarget < 0) return
    target.value = newTarget
    saveToStorage()
  }

  function addRow(row: DataRowRedType) {
    let speed = 0
    const lastRow = data.value[data.value.length - 1]
    if (lastRow) {
      speed = helperCalcSpeedFromPreviousRow(row, lastRow)
    }

    data.value.push({ ...row, speed })
    updateShowDays()
    saveToStorage()
  }

  function updateRow(index: number, row: DataRowRedType) {
    const item = data.value[index]
    if (!item) return

    item.date = row.date
    item.items = row.items
    data.value.sort((a, b) => a.date.getTime() - b.date.getTime())
    recalculateSpeeds()
    updateShowDays()
    saveToStorage()
  }

  function deleteRow(index: number) {
    if (index < 0 || index >= data.value.length) return

    data.value.splice(index, 1)

    if (index < data.value.length) {
      const item = data.value[index]
      if (item) {
        if (index === 0) {
          item.speed = 0
        } else {
          const prevRow = data.value[index - 1]
          if (prevRow) {
            item.speed = helperCalcSpeedFromPreviousRow(item, prevRow)
          }
        }
      }
    }

    updateShowDays()
    saveToStorage()
  }

  function deleteAll() {
    data.value = []
    target.value = 0
    localStorage.removeItem(STORAGE_KEY_DATA)
    localStorage.removeItem(STORAGE_KEY_TARGET)
  }

  function incrementByOne() {
    const lastItems = data.value[data.value.length - 1]?.items ?? 0
    if (target.value === 0 && lastItems <= 0) return

    const items = target.value === 0 ? lastItems - 1 : lastItems + 1
    addRow({ date: new Date(), items })
  }

  function recalculateSpeeds() {
    data.value.forEach((row, i) => {
      if (i === 0) {
        row.speed = 0
      } else {
        const prevRow = data.value[i - 1]
        if (prevRow) {
          row.speed = helperCalcSpeedFromPreviousRow(row, prevRow)
        }
      }
    })
  }

  function updateShowDays() {
    if (data.value.length < 2) {
      settings.value.showDays = false
      return
    }

    const firstDate = data.value[0]?.date
    const lastDate = data.value[data.value.length - 1]?.date

    if (firstDate && lastDate) {
      settings.value.showDays = lastDate.getTime() - firstDate.getTime() >= DAY_IN_MS
    }
  }

  function setUnitOfSpeed(unit: UnitType) {
    settings.value.unitSpeed = unit
  }

  function updateItemsPerSec(ips: number) {
    itemsPerSec.value = ips
    const absIps = Math.abs(ips)

    if (absIps < 1 / 24 / 3600) {
      setUnitOfSpeed('day')
    } else if (absIps < 1 / 3600) {
      setUnitOfSpeed('hour')
    } else if (absIps < 1) {
      setUnitOfSpeed('min')
    } else {
      setUnitOfSpeed('sec')
    }
  }

  return {
    // State
    target,
    data,
    settings,
    itemsPerSec,
    // Computed
    current,
    hasData,
    hasMultipleRows,
    // Methods
    loadFromStorage,
    setTarget,
    addRow,
    updateRow,
    deleteRow,
    deleteAll,
    incrementByOne,
    updateItemsPerSec
  }
}
