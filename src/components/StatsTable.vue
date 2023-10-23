<template>
  <v-table v-if="data.length >= 2" density="compact" class="align-start">
    <tbody>
      <tr>
        <th>Total speed</th>
        <td v-if="itemsPerSec !== 0.0">
          <TooltipSpeed :ips="itemsPerSec" :unit="settings.unitSpeed"></TooltipSpeed>
        </td>
      </tr>
      <tr>
        <th>Items (est.)</th>
        <td>{{ valueToString(itemsEstimated) }}</td>
      </tr>
      <tr v-if="showETA">
        <th>ETA</th>
        <td>{{ dateToString(eta) }}</td>
      </tr>
      <tr v-if="showETA">
        <th>Time to go</th>
        <td>{{ secToString(timeToETA) }}</td>
      </tr>
      <tr>
        <th>Start</th>
        <td>{{ dateToString(firstDate) }}</td>
      </tr>
      <tr>
        <th>Runtime</th>
        <td>{{ secToString(timeSinceFirstValue) }}</td>
      </tr>
      <tr>
        <th>Last input</th>
        <td>{{ secToString(timeSinceLastValue) }}</td>
      </tr>
      <tr v-if="target != undefined">
        <th>Percent</th>
        <td>{{ (100 * percentOfTarget).toFixed(1) }}%</td>
      </tr>
      <tr v-if="target != undefined && percentOfTarget < 1">
        <th>Percent (est.)</th>
        <td>{{ (100 * percentOfTargetEstimated).toFixed(1) }}%</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
// onMounted, onBeforeUnmount
import { helperDateToString, helperSecondsToString, helperValueToString } from './helper'
import { helperLinReg } from './helperLinReg'
import type { UnitType } from '../types'
import TooltipSpeed from './TooltipSpeed.vue'

// Not used any more, since I want to prevent hashed filenames and allow for caching on client side
// import notificationSound from '@/assets/481151__matrixxx__cow-bells-01.mp3'

const props = defineProps({
  data: { type: Array<{ date: Date; value: number }>, required: true },
  settings: {
    type: Object,
    default: () => ({ showDays: false, unitSpeed: 'min' as UnitType }),
    required: true
  },
  target: { type: Number, default: undefined as number | undefined }
})

const dataRef = ref(props.data)
const targetRef = ref(props.target)
watch(
  [dataRef, targetRef],
  () => {
    if (props.data.length == 0) {
      resetStats()
    }
    targetReached = false
    updateStats()
  },
  { deep: true }
)

const showETA = computed(() => props.target !== undefined && timeToETA.value > 0)

let firstDate = new Date(0)
let lastDate = new Date(0)
let firstValue = 0.0
let lastValue = 0.0
let itemsDone = 0

// these are not computed, because only available if target is set
const eta = ref(new Date(0))
const percentOfTarget = ref(0.0)
const percentOfTargetEstimated = ref(0.0)
const timeSinceFirstValue = ref(0.0)
const timeSinceLastValue = ref(0.0)
let targetReached = false
const itemsTotal = ref(0)
// these are updated by the updateTimer() function
let nowTS = new Date(0).getTime()
const timeToETA = ref(0)
const itemsPerSec = ref(0)
const itemsEstimated = ref(0.0)
// let timerInterval = null as NodeJS.Timeout | null
let timerInterval: number | null = null

onMounted(() => {
  updateStats()
  // Start timer logic here
})

onBeforeUnmount(() => {
  stopTimer()
})

function dateToString(datetime: Date): string {
  // decide if we need to show days
  // TODO: move to App settings
  return helperDateToString(datetime, props.settings.showDays)
}
function secToString(sec: number): string {
  return helperSecondsToString(sec)
}
function resetStats() {
  eta.value = new Date(0)
  firstDate = new Date(0)
  lastDate = new Date(0)
  firstValue = 0.0
  lastValue = 0.0
  itemsDone = 0
}
function updateStats() {
  if (props.data.length == 0) {
    // this case is handled by resetStats()
    return
  }
  firstDate = props.data[0].date
  firstValue = props.data[0].value
  lastDate = props.data[props.data.length - 1].date
  lastValue = props.data[props.data.length - 1].value
  itemsDone = props.target != 0 ? lastValue : firstValue - lastValue

  if (props.data.length == 1) {
    eta.value = new Date(0)
    itemsPerSec.value = 0
    return
  }

  const { slope } = helperLinReg(props.data, true)
  itemsPerSec.value = slope

  // calc eta
  // only for mode count-up and count-down the eta calc is possible
  if (props.target !== undefined) {
    itemsTotal.value = props.target != 0 ? props.target : firstValue
    percentOfTarget.value = itemsDone / itemsTotal.value

    if (itemsPerSec.value == 0 || itemsTotal.value <= itemsDone) {
      eta.value = new Date(0)
    } else {
      let timeLastValueToETA = 0
      if (props.target != 0) {
        // mode count-up
        timeLastValueToETA = (itemsTotal.value - itemsDone) / itemsPerSec.value
      } else {
        // mode count-down has neg slope
        timeLastValueToETA = (itemsTotal.value - itemsDone) / -itemsPerSec.value
      }
      eta.value = new Date(lastDate.getTime() + timeLastValueToETA * 1000)
    }
  }

  updateTimes()
  startTimer()
}
function updateTimes() {
  // periodically executed by interval timer
  if (props.data.length == 0) {
    nowTS = 0
    timeSinceFirstValue.value = 0
    timeSinceLastValue.value = 0
    itemsEstimated.value = 0
    return
  }
  nowTS = new Date().getTime()
  timeSinceFirstValue.value = Math.round((nowTS - firstDate.getTime()) / 1000)
  timeSinceLastValue.value = (nowTS - lastDate.getTime()) / 1000

  // calc itemsEstimated
  if (props.data.length == 1 || lastValue == 0) {
    itemsEstimated.value = lastValue
  } else {
    itemsEstimated.value = lastValue + itemsPerSec.value * timeSinceLastValue.value
  }

  // eta based calcs
  // only for modes count-down and count-up
  if (props.target == undefined || eta.value.getTime() == new Date(0).getTime()) {
    timeToETA.value = -1
    percentOfTargetEstimated.value = 0
  } else {
    // time < eta: target not reached yet
    if (nowTS < eta.value.getTime()) {
      timeToETA.value = Math.round((eta.value.getTime() - nowTS) / 1000)
      // count-up
      if (props.target != 0) {
        percentOfTargetEstimated.value =
          (itemsDone + itemsPerSec.value * timeSinceLastValue.value) / itemsTotal.value
      } else {
        // count-down: itemsPerSec is negative!
        percentOfTargetEstimated.value =
          (itemsDone - itemsPerSec.value * timeSinceLastValue.value) / itemsTotal.value
      }
    } else {
      percentOfTargetEstimated.value = 1 // 100%
      timeToETA.value = -1 // prevent s
      // if time > eta we once play a notification sound
      if (targetReached == false) {
        targetReached = true
        playSoundTimerDone()
      }
    }
  }
}
function // create a timer, that updates the elapsed and remaining time periodically
startTimer() {
  stopTimer()
  let sleep: number = 1
  // decide on the sleep time
  if ((timeToETA.value == 0 || timeToETA.value > 15 * 60) && timeSinceFirstValue.value > 15 * 60) {
    sleep = 30
  }

  timerInterval = window.setInterval(() => {
    updateTimes()
  }, sleep * 1000)
}

function stopTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval)
    timerInterval = null
  }
}
function playSoundTimerDone() {
  // playSound(notificationSound)
  // hardcoded to file in public dir instead of assets, since the latter results in hashed filenames (bad for caching upon app update)
  playSound('audio/481151__matrixxx__cow-bells-01.mp3')
}
function playSound(url: string) {
  const audio = new Audio(url)
  audio.play()
}
function valueToString(value: number): String {
  return helperValueToString(value)
}
</script>
