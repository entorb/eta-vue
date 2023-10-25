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
          <v-col cols="5"> <ActionsBlock @plus-1="plus1" @unit="setUnitOfSpeed" /></v-col>
        </v-row>
        <v-row>
          <v-col cols="4" v-if="data.length >= 2">
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
  let stored = localStorage.getItem('target')
  if (stored !== null) {
    target.value = parseFloat(stored)
  }
  stored = localStorage.getItem('data')
  if (stored !== null) {
    const obj = JSON.parse(stored)
    data.value = obj.map((item: { date: string; value: number }) => ({
      date: new Date(item.date),
      value: item.value
    }))
    decideIfToShowDays()
  }
})

function setTarget(target_new: number | undefined) {
  if (target_new != undefined && target_new < 0) {
    console.log('invalid negative target:', target_new)
    return
  }
  console.log('new target:', target_new)
  target.value = target_new
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
  const firstDate = data.value[0].date
  const lastDate = data.value[data.value.length - 1].date
  settings.value.showDays = firstDate.getTime() < lastDate.getTime() - 86400 * 1000
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
    // Removes one element at the specified index
    data.value.splice(index, 1)
  }
}
function deleteAllData() {
  data.value = []
  localStorage.removeItem('data')
  target.value = undefined
  localStorage.removeItem('target')
}
function updateLocalStorageTarget() {
  if (target.value != undefined) {
    localStorage.setItem('target', target.value.toString())
  }
}
function updateLocalStorageData() {
  localStorage.setItem('data', JSON.stringify(data))
}
</script>
