<template>
  <v-container>
    <v-row v-if="data.length < 2">
      <v-col cols="12" md="12">
        1. set <v-icon icon="$target" /> (target can be 0)<br />
        2. update <v-icon icon="$items" /> (current value)<br />
        <!-- <span :style="{ color: colorItems }"></span> -->
        <!--:color="colorItems" -->
        3. periodically repeat 2. when it has changed
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" md="3">
        <InputTarget :target="target" @set-target="setTarget" />
      </v-col>
      <v-col cols="6" md="3">
        <InputItems :target="target" @add-row="addRow" />
      </v-col>
    </v-row>
    <v-row v-if="data.length >= 1">
      <v-col cols="4" md="2" offset="2" offsetMd="0">
        <v-btn id="btn-del-all" icon="$trash" color="red" @click="deleteAllData" />
      </v-col>
      <v-col cols="4" md="2" offset="1" offsetMd="3">
        <v-btn id="btn-plus-1" icon="$plus1" color="blue-lighten-2" @click="plus1" />
      </v-col>
    </v-row>
    <v-row v-if="data.length >= 1">
      <v-col v-if="data.length >= 2" cols="12" md="6">
        <StatsTable
          :data="data"
          :settings="settings"
          :target="target"
          @items-per-sec="forwardIpS"
        />
      </v-col>
      <v-col cols="12" md="6">
        <DataTable
          :data="data"
          :settings="settings"
          @delete-all-data="deleteAllData"
          @delete-row="deleteRow"
        />
      </v-col>
    </v-row>
    <v-row v-if="data.length >= 2">
      <EtaChart :data="data" :settings="settings" :target="target" :ips="itemsPerSec" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'

import InputItems from './InputItems.vue'
import InputTarget from './InputTarget.vue'
import DataTable from './DataTable.vue'
import StatsTable from './StatsTable.vue'
// Lazy loading of EtaChart to speed up initial loading
const EtaChart = defineAsyncComponent(() => import('@/components/EtaChart.vue'))

import type { UnitType, DataRowType, DataRowRedType } from '../types'
// import { colorItems } from '../colors'

import {
  helperCalcSpeedFromPreviousRow,
  helperRunningOnProd,
  helperStatsDataWrite
} from '../helper'

// target:
// = 0 -> count-down mode
// > 0 -> count-up mode

const target = ref<number>(0)
// speed in items per sec
const data = ref<Array<DataRowType>>([])
const settings = ref({ showDays: true, unitSpeed: 'min' as UnitType })
const itemsPerSec = ref(0) // from StatsTable, forwarded to EtaChart

onMounted(() => {
  // read data from Local Storage
  readLocalStorageTarget()
  readLocalStorageData()
  decideIfToShowDays()
  setUnitOfSpeed('min')
})

function setTarget(targetNew: number) {
  if (targetNew < 0) {
    // console.log('invalid negative target:', targetNew)
    return
  }
  // console.log('targetNew:', targetNew)
  target.value = targetNew
  updateLocalStorageTarget()
}

function forwardIpS(ips: number) {
  itemsPerSec.value = ips
  const x = Math.abs(ips)
  if (x < 1 / 24 / 3600) {
    setUnitOfSpeed('day')
  } else if (x < 1 / 3600) {
    setUnitOfSpeed('hour')
  } else if (x < 1) {
    setUnitOfSpeed('min')
  } else {
    setUnitOfSpeed('sec')
  }
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

  // count-down: -1, count-up: +1
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
  localStorage.removeItem('eta_vue_target')
  target.value = 0
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
  localStorage.setItem('eta_vue_target', target.value.toString())
}

function updateLocalStorageData() {
  // only store the core data, not the derived data like speed
  const dataReduced = data.value.map(({ date, items }: DataRowType) => ({ date, items }))
  localStorage.setItem('eta_vue_data', JSON.stringify(dataReduced))
}
</script>
