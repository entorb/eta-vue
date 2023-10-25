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
import type { UnitType } from './types'

// target:
// undefined -> simple mode, no ETA
// > 0 -> count-up mode
// = 0 -> count-down mode

const target = ref<number | undefined>(undefined)
const data = ref<Array<{ date: Date; value: number }>>([])
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
  console.log('new target:', targetNew)
  target.value = targetNew
  updateLocalStorageTarget()
}

function setUnitOfSpeed(unit: string) {
  settings.value.unitSpeed = unit as UnitType
}

function addRow(row: { date: Date; value: number }) {
  // console.log('new row:', row)
  data.value.push(row)
  decideIfToShowDays()
  updateLocalStorageData()
}

function decideIfToShowDays() {
  if (data.value.length > 0) {
    const firstDate = data.value[0].date
    const lastDate = data.value[data.value.length - 1].date
    settings.value.showDays = firstDate.getTime() < lastDate.getTime() - 86400 * 1000
  } else {
    settings.value.showDays = false
  }
}

function plus1() {
  let value = 0
  let lastValue = 0
  const hasData = data.value.length > 0
  if (data.value.length > 0) {
    lastValue = data.value[data.value.length - 1].value
  }

  if (target.value == 0) {
    // target == 0 -> count-down mode
    if (hasData && lastValue >= 1) {
      value = lastValue - 1
    } else {
      return
    }
  } else {
    // count-up mode or simple mode
    value = lastValue + 1
  }
  const date = new Date()
  const newRow = { date: date, value: value }
  addRow(newRow)
}

function deleteRow(index: number) {
  if (index >= 0 && index < data.value.length) {
    data.value.splice(index, 1)
  }
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
  if (stored !== null) {
    const obj = JSON.parse(stored)
    data.value = obj.map((item: { date: string; value: number }) => ({
      date: new Date(item.date),
      value: item.value
    }))
  }
}

function updateLocalStorageTarget() {
  if (target.value != undefined) {
    localStorage.setItem('eta_vue_target', target.value.toString())
  }
}

function updateLocalStorageData() {
  localStorage.setItem('eta_vue_data', JSON.stringify(data.value))
}
</script>
