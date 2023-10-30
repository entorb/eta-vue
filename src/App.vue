<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col><h1>ETA - Estimated Time of Arrival</h1></v-col>
        </v-row>
        <v-row>
          <v-col>
            <InputTargetValue :target="target" @set-target="setTarget" @add-row="addRow" />
          </v-col>
          <!-- align-content="end" -->
          <v-col cols="5">
            <ActionsBlock :unit-initial="settings.unitSpeed" @plus-1="plus1" @unit="setUnitOfSpeed"
          /></v-col>
        </v-row>
        <v-row>
          <v-col v-if="data.length >= 2" cols="4">
            <StatsTable :data="data" :settings="settings" :target="target" />
          </v-col>
          <v-col v-if="data.length >= 1">
            <DataTable
              :data="data"
              :settings="settings"
              @delete-all-data="deleteAllData"
              @delete-row="deleteRow"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center mt-4" cols="12">
            This app is OpenSource. Its source code and project documentation can be found at
            <a href="https://github.com/entorb/eta-vue/" target="_blank"
              >GitHub.com/entorb/etc-vue/</a
            >. The previous version can be found at <a href="v1/">v1/</a>. Feel free to
            <a href="https://entorb.net/contact.php?origin=eta" target="_blank">contact</a> me.
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import InputTargetValue from './components/InputTargetValue.vue'
import DataTable from './components/DataTable.vue'
import StatsTable from './components/StatsTable.vue'
import ActionsBlock from './components/ActionsBlock.vue'
import type { UnitType, DataRowType, DataRowRedType } from './types'

import { helperCalcSpeedFromPreviousRow } from './helper'

// target:
// undefined -> simple mode, no ETA
// > 0 -> count-up mode
// = 0 -> count-down mode

const target = ref<number | undefined>(undefined)
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
    console.log('invalid negative target:', targetNew)
    return
  }
  target.value = targetNew
  updateLocalStorageTarget()
}

function setUnitOfSpeed(unit: string) {
  settings.value.unitSpeed = unit as UnitType
}

function addRow(row: DataRowRedType) {
  const { date, value } = row
  let speed = 0
  if (data.value.length > 0) {
    const prevRow = data.value[data.value.length - 1]
    speed = helperCalcSpeedFromPreviousRow({ date, value }, prevRow)
  }
  data.value.push({ date, value, speed })
  decideIfToShowDays()
  updateLocalStorageData()
}

// function recalcAllSpeeds() {
//   if (data.value.length == 0) return
//   else {
//     data.value[0].speed = 0
//     for (let i = 1; i < data.value.length; i++) {
//       const prevRow = data.value[i - 1]
//       const row = data.value[i]
//       row.speed = calcSpeed(row, prevRow)
//     }
//   }
// }

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
  const lastValue = hasData ? data.value[data.value.length - 1].value : 0

  // count-down mode: exit if lastValue <= 0
  if (target.value == 0 && lastValue <= 0) return

  // count-down: -1, count-up & simple: +1
  const value = target.value == 0 ? lastValue - 1 : lastValue + 1

  const newRow: DataRowRedType = { date: new Date(), value: value }
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
  target.value = undefined
  localStorage.removeItem('eta_vue_target')
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
  const dataReduced: DataRowRedType[] = obj.map(({ date, value }: DataRowRedType) => ({
    date: new Date(date),
    value
  }))

  const newDataValues: DataRowType[] = []
  const dataReducedLength = dataReduced.length // Cache the length
  for (let i = 0; i < dataReducedLength; i++) {
    const { date, value } = dataReduced[i]
    const speed = i >= 1 ? helperCalcSpeedFromPreviousRow({ date, value }, newDataValues[i - 1]) : 0
    newDataValues.push({ date, value, speed })
  }
  data.value = newDataValues
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
  const dataReduced = data.value.map(({ date, value }: DataRowType) => ({ date, value }))
  localStorage.setItem('eta_vue_data', JSON.stringify(dataReduced))
}
</script>
