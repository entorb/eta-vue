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
        <td>{{ valueToString(itemsEstimatedRef) }}</td>
      </tr>
      <tr v-if="target != undefined && timeToETA > 0">
        <th>ETA</th>
        <td>{{ dateToString(eta) }}</td>
      </tr>
      <tr v-if="target != undefined && timeToETA > 0">
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
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
// onMounted, onBeforeUnmount
import { helperDateToString, helperSecondsToString, helperValueToString } from './helper'
import { helperLinReg } from './helperLinReg'
import TooltipSpeed from './TooltipSpeed.vue'
import notificationSound from '@/assets/481151__matrixxx__cow-bells-01.mp3'

const props = defineProps({
  data: { type: Array<{ date: Date; value: number }>, required: true },
  settings: {
    type: Object,
    default: () => ({ showDays: false, unitSpeed: 'sec' }),
    required: true
  },
  target: { type: Number || undefined, default: undefined }
})

const dataRef = ref(props.data)
const targetRef = ref(props.target)
watch(
  [dataRef, targetRef],
  () => {
    updateStats()
  },
  { deep: true }
)

let firstDate = new Date(0)
let lastDate = new Date(0)
let firstValue = 0.0
let lastValue = 0.0
let percentOfTarget = 0.0
let percentOfTargetEstimated = 0.0
let timeSinceFirstValue = 0.0
let timeSinceLastValue = 0.0
let timeToETA = 0
let itemsPerSec = 0.0
const itemsEstimatedRef = ref(0.0) // not sure why this is needed only for this variable...
let itemsEstimated = 0.0
let eta = new Date(0)
let timerInterval = null as NodeJS.Timeout | null
let itemsDone = 0
let itemsTotal = 0
let targetReached = false

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
function updateStats() {
  if (props.data.length <= 1) {
    eta = new Date(0)
    return
  }
  targetReached = false // periodically checked and updated in updateTimes
  firstDate = props.data[0].date
  firstValue = props.data[0].value
  lastDate = props.data[props.data.length - 1].date
  lastValue = props.data[props.data.length - 1].value

  const { slope } = helperLinReg(props.data, true)
  itemsPerSec = slope

  // only for mode count-up and count-down the eta calc makes sense
  if (props.target !== undefined) {
    itemsDone = props.target != 0 ? lastValue : firstValue - lastValue
    itemsTotal = props.target != 0 ? props.target : firstValue
    percentOfTarget = itemsDone / itemsTotal

    if (itemsPerSec != 0) {
      if (itemsTotal > itemsDone) {
        if (props.target != 0) {
          timeToETA = (itemsTotal - itemsDone) / itemsPerSec
        } else {
          timeToETA = (itemsTotal - itemsDone) / -itemsPerSec
        }
      }
    }
    eta = new Date(lastDate.getTime() + timeToETA * 1000)
  } else {
    eta = new Date(0)
  }

  updateTimes()
  startTimer()
}
function updateTimes() {
  // executed by interval timer
  const now = new Date().getTime()
  timeSinceFirstValue = Math.round((now - firstDate.getTime()) / 1000)
  timeSinceLastValue = (now - lastDate.getTime()) / 1000

  itemsEstimated = lastValue == 0 ? 0 : lastValue + itemsPerSec * timeSinceLastValue
  itemsEstimatedRef.value = itemsEstimated
  console.log(itemsEstimated)

  if (props.target !== undefined) {
    // time < eta: target not reached yet
    if (new Date().getTime() < eta.getTime()) {
      timeToETA = Math.round((eta.getTime() - now) / 1000)
      // only for modes count-down and count-up the percent calc makes sense
      if (props.target != 0) {
        // count-up
        percentOfTargetEstimated = (itemsDone + itemsPerSec * timeSinceLastValue) / itemsTotal
      } else {
        // count-down: itemsPerSec is negative!
        percentOfTargetEstimated = (itemsDone - itemsPerSec * timeSinceLastValue) / itemsTotal
      }
    } else {
      // if time > eta we play a notification
      if (props.target !== undefined && targetReached == false) {
        targetReached = true
        playSoundTimerDone()
      }
      timeToETA = -1 // prevent s
      percentOfTargetEstimated = 1 // 100%
    }
  }
}
function // create a timer, that updates the elapsed and remaining time periodically
startTimer() {
  stopTimer()
  let sleep: number = 1
  // decide on the sleep time
  if ((timeToETA == 0 || timeToETA > 15 * 60) && timeSinceFirstValue > 15 * 60) {
    sleep = 30
  }

  timerInterval = setInterval(() => {
    updateTimes()
  }, sleep * 1000)
}

function stopTimer() {
  // Stop the timer
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}
function playSoundTimerDone() {
  playSound(notificationSound)
}
function playSound(url: string) {
  const audio = new Audio(url)
  audio.play()
}
function valueToString(value: number): String {
  return helperValueToString(value)
}
</script>
