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

const inputName = ref('')
const inputTime = ref('')
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
  // support unit as suffix
  let input = inputTime.value
  const u = input.slice(-1)
  let unit = 'min'
  if (['s', 'm', 'h', 'd'].includes(u)) {
    input = input.slice(0, -1)
    switch (u) {
      case 's':
        unit = 'sec'
        break
      case 'h':
        unit = 'hour'
        break
      case 'd':
        unit = 'day'
        break
    }
  }

  // support time in format 12:34 and convert to decimal 12.57
  const regex = /:(\d{2})/
  const match = input.match(regex)
  if (match) {
    const seconds = parseInt(match[1] ?? '0', 10)
    const minutes = Math.round((seconds / 60) * 100) / 100
    input = input.replace(regex, minutes.toString().replace(/^0/, ''))
  }

  const time = parseFloat(input.replace(',', '.'))
  if (isNaN(time)) {
    inputTime.value = ''
    return
  }
  const cleanName = helperClearName(inputName.value)
  const name = cleanName === '' ? 'Timer' : cleanName
  // const unit = unitSelected.value
  inputTime.value = ''
  inputName.value = ''
  add(name, time, unit)
  const thisTimerName = genTimerName(name, time, unit)
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
  const timer = data.value[index]
  if (!timer) return
  const time = timer.dateEnd.getTime() - timer.dateStart.getTime()
  timer.dateStart = new Date()
  timer.dateEnd = new Date(timer.dateStart.getTime() + time)
  timer.remainingTime = time / 1000
  timer.percent = 0
  startTimer()
  updateLocalStorageData()
}

function resetAll() {
  for (const element of data.value) {
    const time = element.dateEnd.getTime() - element.dateStart.getTime()
    element.dateStart = new Date()
    element.dateEnd = new Date(element.dateStart.getTime() + time)
    element.remainingTime = time / 1000
    element.percent = 0
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
    const timer = dataReduced[i]
    if (!timer) continue
    const { name, dateStart, dateEnd } = timer

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

function genTimerName(name: string, time: number, unit: string): string {
  return helperClearName(name) + ':' + time.toString() + unit.charAt(0)
}

function parseTimerName(title: string): { name: string; time: number; unit: string } {
  let s = title
  const unitShort = s.charAt(s.length - 1)
  const unit =
    unitShort === 's' ? 'sec' : unitShort === 'm' ? 'min' : unitShort === 'h' ? 'hour' : 'day'
  s = s.substring(0, s.length - 1)

  const parts = s.split(':')
  const name = parts[0] ?? ''
  const time = parseFloat(parts[1] ?? '0')
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
  const { name, time, unit } = parseTimerName(title)
  add(name, time, unit)
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        cols="7"
        md="3"
      >
        <v-text-field
          id="input-name"
          v-model="inputName"
          label="Name of Timer"
          type="text"
          variant="outlined"
        />
      </v-col>
      <v-col
        cols="5"
        md="3"
      >
        <v-text-field
          id="input-time"
          v-model="inputTime"
          label="Time"
          type="text"
          inputmode="decimal"
          variant="outlined"
          append-icon="$save"
          @blur="addViaInput"
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
          fixed-header
          density="compact"
          class="align-start"
        >
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th
                v-if="!isMobile"
                scope="col"
              >
                End
              </th>
              <th
                scope="col"
                width="150px"
              >
                Time
              </th>
              <th
                scope="col"
                class="text-center small-width"
              >
                <v-btn
                  id="btn-resetAll"
                  icon="$repeat"
                  icon-color="red"
                  flat
                  @click="resetAll"
                />
              </th>
              <th
                scope="col"
                class="text-center small-width"
              >
                <v-btn
                  id="btn-deleteAll"
                  icon="$trash"
                  icon-color="red"
                  flat
                  @click="deleteAll"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in data"
              :key="row.name"
            >
              <td>{{ row.name }}</td>
              <td v-if="!isMobile">{{ helperDateToString(row.dateEnd, showDays) }}</td>
              <td style="white-space: nowrap">
                <v-progress-linear
                  v-model="row.percent"
                  max="1"
                  height="20"
                  color="amber"
                >
                  <strong>{{ helperSecondsToString(row.remainingTime) }}</strong>
                </v-progress-linear>
                <!-- ({{ (100 * row.percent).toFixed(1) }}%) -->
              </td>
              <td class="text-center small-width">
                <v-btn
                  icon="$repeat"
                  size="small"
                  flat
                  @click="resetRow(index)"
                />
              </td>
              <td class="text-center small-width">
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

<style>
.small-width {
  width: 25px !important;
  max-width: 25px !important;
}
</style>
