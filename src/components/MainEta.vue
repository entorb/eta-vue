<template>
  <v-container>
    <v-row v-if="data.length == 0">
      <v-col cols="12">
        <p v-if="target == 0">
          Selected mode: count-down<br />
          1. enter items to go<br />
          2. repeat 1. when it has changed
        </p>
        <p v-if="target != undefined && target > 0">
          Selected mode: count-up<br />
          1. enter target items<br />
          2. enter current items<br />
          3. periodically repeat 2.
        </p>
        <p v-if="target == undefined">
          Selected mode: simple<br />
          1. enter current items<br />
          2. periodically repeat 1.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="2">
        <SelectMode :target="target" @set-target="setTarget" />
      </v-col>
      <v-col v-if="target != undefined && target > 0" cols="6" md="3">
        <InputTarget :target="target" @set-target="setTarget" />
      </v-col>
      <v-col cols="6" md="3">
        <InputItems :target="target" @add-row="addRow" />
      </v-col>
      <!-- offset="1"  -->
      <v-col cols="5" md="2">
        <SelectUnit :unit-initial="settings.unitSpeed" @unit="setUnitOfSpeed" />
      </v-col>
      <v-col cols="3" md="2">
        <v-btn id="btn-plus-1" icon="$plus1" @click="plus1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="data.length >= 2" cols="12" md="3">
        <StatsTable :data="data" :settings="settings" :target="target" />
      </v-col>
      <v-col v-if="data.length >= 1" cols="12" md="4">
        <DataTable
          :data="data"
          :settings="settings"
          @delete-all-data="deleteAllData"
          @delete-row="deleteRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import SelectMode from './SelectMode.vue'
import InputItems from './InputItems.vue'
import InputTarget from './InputTarget.vue'
import DataTable from './DataTable.vue'
import StatsTable from './StatsTable.vue'
import SelectUnit from './SelectUnit.vue'
import type { UnitType, DataRowType, DataRowRedType } from '../types'

import {
  helperCalcSpeedFromPreviousRow,
  helperRunningOnProd,
  helperStatsDataWrite
} from '../helper'

// target:
// undefined -> simple mode, no ETA
// > 0 -> count-up mode
// = 0 -> count-down mode

const target = ref<number | undefined>(0)
// speed in items per sec
const data = ref<Array<DataRowType>>([])
const settings = ref({ showDays: true, unitSpeed: 'min' as UnitType })

onMounted(() => {
  // read data from Local Storage
  readLocalStorageTarget()
  readLocalStorageData()
  decideIfToShowDays()
})

function setTarget(targetNew: number | undefined) {
  if (targetNew != undefined && targetNew < 0) {
    // console.log('invalid negative target:', targetNew)
    return
  }
  target.value = targetNew
  updateLocalStorageTarget()
}

function setUnitOfSpeed(unit: string) {
  settings.value.unitSpeed = unit as UnitType
}

function addRow(row: DataRowRedType) {
  const { date, items } = row
  let speed = 0
  if (data.value.length > 0) {
    const prevRow = data.value[data.value.length - 1]
    speed = helperCalcSpeedFromPreviousRow({ date, items }, prevRow)
  }
  data.value.push({ date, items, speed })
  decideIfToShowDays()
  updateLocalStorageData()
  // update usage stats stats only if there are at least 3 rows
  if (helperRunningOnProd() && data.value.length == 3) {
    helperStatsDataWrite('eta')
  }
  // to ensure that default target=0 is stored into local storage
  if (target.value == 0 && data.value.length == 1) {
    updateLocalStorageTarget()
  }
}

function decideIfToShowDays() {
  if (data.value.length > 0) {
    const firstDate = data.value[0].date
    const lastDate = data.value[data.value.length - 1].date
    settings.value.showDays = firstDate.getTime() <= lastDate.getTime() - 86400 * 1000
  } else {
    settings.value.showDays = false
  }
}

function plus1() {
  const hasData = data.value.length > 0
  const lastItems = hasData ? data.value[data.value.length - 1].items : 0

  // count-down mode: exit if lastValue <= 0
  if (target.value == 0 && lastItems <= 0) return

  // count-down: -1, count-up & simple: +1
  const items = target.value == 0 ? lastItems - 1 : lastItems + 1

  const newRow: DataRowRedType = { date: new Date(), items }
  addRow(newRow)
}

function deleteRow(index: number) {
  if (index >= 0 && index < data.value.length) {
    data.value.splice(index, 1)
  }
  // recalc speed
  // index starts at 0, so must be smaller than the length
  if (index < data.value.length) {
    // recalc speed for the row that now is shifted to index
    if (index == 0) {
      data.value[index].speed = 0
    } else {
      const prevRow = data.value[index - 1]
      const row = data.value[index]
      row.speed = helperCalcSpeedFromPreviousRow(row, prevRow)
    }
  }
  decideIfToShowDays()
  updateLocalStorageData()
}

function deleteAllData() {
  data.value = []
  localStorage.removeItem('eta_vue_data')
  // no: do not delete target, as this would trigger annoying reset of mode
  // target.value = 0
  // localStorage.removeItem('eta_vue_target')
}

function readLocalStorageTarget() {
  const stored = localStorage.getItem('eta_vue_target')
  if (stored !== null) {
    target.value = parseFloat(stored)
  }
}

function readLocalStorageData() {
  const stored = localStorage.getItem('eta_vue_data')
  data.value = []

  if (stored === null) {
    return
  }

  const obj = JSON.parse(stored)
  const dataReduced: DataRowRedType[] = obj.map(({ date, items }: DataRowRedType) => ({
    date: new Date(date),
    items
  }))

  const newData: DataRowType[] = []
  const dataReducedLength = dataReduced.length // Cache the length
  for (let i = 0; i < dataReducedLength; i++) {
    const { date, items } = dataReduced[i]
    const speed = i >= 1 ? helperCalcSpeedFromPreviousRow({ date, items }, newData[i - 1]) : 0
    newData.push({ date, items, speed })
  }
  data.value = newData
}

function updateLocalStorageTarget() {
  if (target.value != undefined) {
    localStorage.setItem('eta_vue_target', target.value.toString())
  } else {
    localStorage.removeItem('eta_vue_data')
  }
}

function updateLocalStorageData() {
  // only store the core data, not the derived data like speed
  const dataReduced = data.value.map(({ date, items }: DataRowType) => ({ date, items }))
  localStorage.setItem('eta_vue_data', JSON.stringify(dataReduced))
}
</script>
