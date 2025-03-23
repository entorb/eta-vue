<template>
  <v-container>
    <v-row>
      <v-col cols="7" md="3">
        <v-text-field
          id="input-name"
          v-model="inputName"
          label="Name of Timer"
          type="text"
          variant="outlined"
        />
      </v-col>
      <v-col cols="5" md="2">
        <v-select
          id="select-unit"
          v-model="unitSelected"
          label="Unit"
          variant="outlined"
          :items="unitList"
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field
          id="input-time"
          v-model="inputTime"
          label="Time"
          type="text"
          inputmode="decimal"
          variant="outlined"
          append-icon="$save"
          @click:append="addViaInput"
          @keyup.enter="addViaInput"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-chip
          v-for="title in recentTimerNames"
          :key="title"
          closable
          @click="addFromRecentTimer(title)"
          @click:close="removeFromRecentTimer(title)"
        >
          {{ title }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-table
          v-if="data.length >= 1"
          ref="tableRef"
          fixed-header
          density="compact"
          class="align-start"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th v-if="!isMobile">End</th>
              <th width="150px">Time</th>
              <th :class="{ 'text-center': true, 'small-width': true }">
                <v-btn id="btn-resetAll" icon="$repeat" icon-color="red" flat @click="resetAll" />
              </th>
              <th :class="{ 'text-center': true, 'small-width': true }">
                <v-btn id="btn-deleteAll" icon="$trash" icon-color="red" flat @click="deleteAll" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="row.name">
              <td>{{ row.name }}</td>
              <td v-if="!isMobile">{{ helperDateToString(row.dateEnd, showDays) }}</td>
              <td style="white-space: nowrap">
                <v-progress-linear v-model="row.percent" max="1" height="20" color="amber">
                  {{ helperSecondsToString(row.remainingTime) }}
                </v-progress-linear>
                <!-- ({{ (100 * row.percent).toFixed(1) }}%) -->
              </td>
              <td :class="{ 'text-center': true, 'small-width': true }">
                <v-btn icon="$repeat" size="small" flat @click="resetRow(index)" />
              </td>
              <td :class="{ 'text-center': true, 'small-width': true }">
                <v-btn
                  :id="'btn-del-row-' + index"
                  icon="$trash"
                  size="small"
                  flat
                  @click="deleteRow(index)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  helperClearName,
  helperDateToString,
  helperPlaySoundTimerDone,
  helperRunningOnMobile,
  helperRunningOnProd,
  helperSecondsToString,
  helperStatsDataWrite
} from '../helper'

import type { UnitType } from '../types'

const inputName = ref('')
const inputTime = ref('')
const unitList = ref<UnitType[]>(['sec', 'min', 'hour', 'day'])
const unitSelected = ref<UnitType>('min')
const showDays = ref(false)

const data = ref<Array<TimerType>>([])
const recentTimerNames = ref<Array<string>>([])

const isMobile = ref(helperRunningOnMobile())

export interface TimerType {
  name: string
  dateStart: Date
  dateEnd: Date
  remainingTime: number
  percent: number
}

let timerInterval: number | null = null

onMounted(() => {
  readLocalStorageData()
  readLocalStorageRecentTimers()
  startTimer()
})

function addViaInput() {
  const time = parseFloat(inputTime.value.replace(',', '.'))
  if (isNaN(time)) {
    inputTime.value = ''
    return
  }
  const cleanName = helperClearName(inputName.value)
  const name = cleanName === '' ? 'Timer' : cleanName
  const unit = unitSelected.value
  inputTime.value = ''
  inputName.value = ''
  add(name, time, unit)
  const thisTimerName = genRecentTimerName(name, time, unit)
  if (!recentTimerNames.value.includes(thisTimerName)) {
    recentTimerNames.value.push(thisTimerName)
    recentTimerNames.value.sort((a, b) => a.localeCompare(b))
    localStorage.setItem('eta_vue_mt_recent', JSON.stringify(recentTimerNames.value))
  }
}

function add(name: string, time: number, unit: string) {
  const factor = unit === 'sec' ? 1 : unit === 'min' ? 60 : unit === 'hour' ? 3600 : 86400
  const dateStart = new Date()
  const dateEnd = new Date(new Date().getTime() + time * 1000 * factor)

  data.value.push({
    name,
    dateStart,
    dateEnd,
    remainingTime: (dateEnd.getTime() - dateStart.getTime()) / 1000,
    percent: 0
  })

  updateLocalStorageData()
  if (helperRunningOnProd()) {
    helperStatsDataWrite('eta-mt')
  }
  startTimer()
}

function updateRemainingTime() {
  let countTimersRunning = 0
  for (const timer of data.value) {
    const remaining = timer.remainingTime
    // is the current timer still running?
    // upon reading from local storage, value is set to -1
    if (remaining != 0) {
      const now = new Date().getTime()
      const target = timer.dateEnd.getTime()
      const start = timer.dateStart.getTime()
      if (now < target) {
        countTimersRunning++
        timer.remainingTime = (target - now) / 1000
        timer.percent = (now - start) / (target - start)
      } else {
        timer.remainingTime = 0
        timer.percent = 1
        if (remaining != -1) helperPlaySoundTimerDone()
      }
    }
  }
  if (countTimersRunning == 0) {
    stopTimer()
  }
  // sort data by remaining time
  data.value.sort((a, b) => a.dateEnd.getTime() - b.dateEnd.getTime())
}

function stopTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval)
    timerInterval = null
  }
}

// create a timer, that updates the elapsed and remaining time periodically
function startTimer() {
  stopTimer()
  const sleep: number = 1
  updateRemainingTime()

  timerInterval = window.setInterval(() => {
    updateRemainingTime()
  }, sleep * 1000)
}

function resetRow(index: number) {
  const time = data.value[index].dateEnd.getTime() - data.value[index].dateStart.getTime()
  data.value[index].dateStart = new Date()
  data.value[index].dateEnd = new Date(data.value[index].dateStart.getTime() + time)
  data.value[index].remainingTime = time / 1000
  data.value[index].percent = 0
  startTimer()
  updateLocalStorageData()
}

function resetAll() {
  for (let index = 0; index < data.value.length; index++) {
    const time = data.value[index].dateEnd.getTime() - data.value[index].dateStart.getTime()
    data.value[index].dateStart = new Date()
    data.value[index].dateEnd = new Date(data.value[index].dateStart.getTime() + time)
    data.value[index].remainingTime = time / 1000
    data.value[index].percent = 0
  }
  startTimer()
  updateLocalStorageData()
}

function deleteRow(index: number) {
  data.value.splice(index, 1)
  startTimer()
  updateLocalStorageData()
}

function deleteAll() {
  data.value = []
  stopTimer()
  localStorage.removeItem('eta_vue_mt_data')
}

function updateLocalStorageData() {
  if (data.value.length == 0) {
    localStorage.removeItem('eta_vue_mt_data')
  } else {
    // only store the core data, not the derived data like speed
    const dataReduced = data.value.map(({ name, dateStart, dateEnd }: TimerType) => ({
      name,
      dateStart,
      dateEnd
    }))
    localStorage.setItem('eta_vue_mt_data', JSON.stringify(dataReduced))
  }
}

function readLocalStorageData() {
  data.value = []
  const stored = localStorage.getItem('eta_vue_mt_data')

  if (stored === null) {
    return
  }

  const obj = JSON.parse(stored)
  const dataReduced: TimerType[] = obj.map(({ name, dateStart, dateEnd }: TimerType) => ({
    name,
    dateStart: new Date(dateStart),
    dateEnd: new Date(dateEnd)
  }))

  const newData: TimerType[] = []
  const dataReducedLength = dataReduced.length // Cache the length
  for (let i = 0; i < dataReducedLength; i++) {
    const { name, dateStart, dateEnd } = dataReduced[i]

    newData.push({ name, dateStart, dateEnd, remainingTime: -1, percent: -1 })
  }
  data.value = newData
}

function readLocalStorageRecentTimers() {
  recentTimerNames.value = []
  const stored = localStorage.getItem('eta_vue_mt_recent')
  if (stored === null) {
    return
  }
  const obj = JSON.parse(stored)
  for (const title of obj) {
    recentTimerNames.value.push(title)
  }
}

function genRecentTimerName(name: string, time: number, unit: string): string {
  return helperClearName(name) + ':' + time.toString() + unit.charAt(0)
}

function parseRecentTimerName(title: string): { name: string; time: number; unit: string } {
  let s = title
  const unitShort = s.charAt(s.length - 1)
  const unit =
    unitShort === 's' ? 'sec' : unitShort === 'm' ? 'min' : unitShort === 'h' ? 'hour' : 'day'
  s = s.substring(0, s.length - 1)

  const name = s.split(':')[0]
  const time = parseFloat(s.split(':')[1])
  return { name, time, unit }
}

function removeFromRecentTimer(title: string) {
  const index = recentTimerNames.value.indexOf(title)
  if (index > -1) {
    recentTimerNames.value.splice(index, 1)
  }
  localStorage.setItem('eta_vue_mt_recent', JSON.stringify(recentTimerNames.value))
}

function addFromRecentTimer(title: string) {
  const { name, time, unit } = parseRecentTimerName(title)
  add(name, time, unit)
}
</script>

<style>
.small-width {
  width: 25px !important;
  max-width: 25px !important;
}
</style>
