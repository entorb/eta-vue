<template>
  <v-table v-if="data.length >= 2" density="compact" class="align-start">
    <tbody>
      <tr>
        <td>Total speed</td>
        <td v-if="itemsPerSec !== 0.0">
          <TooltipSpeed :ips="itemsPerSec" :unit="settings.unitSpeed"></TooltipSpeed>
        </td>
      </tr>
      <tr>
        <td>Items (est.)</td>
        <td>{{ valueToString(itemsEstimated) }}</td>
      </tr>
      <tr v-if="showETA">
        <td>ETA</td>
        <td>
          <strong>{{ dateToString(eta) }}</strong>
        </td>
      </tr>
      <tr v-if="showETA">
        <td>Time to go</td>
        <td>
          <strong>{{ secToString(timeToETA) }}</strong>
        </td>
      </tr>
      <tr>
        <td>Start</td>
        <td>{{ dateToString(firstDate) }}</td>
      </tr>
      <tr>
        <td>Runtime</td>
        <td>{{ secToString(timeSinceFirstRow) }}</td>
      </tr>
      <tr>
        <td>Last input</td>
        <td>{{ secToString(timeSinceLastRow) }}</td>
      </tr>
      <tr v-if="target != undefined">
        <td>Percent (last)</td>
        <v-progress-linear v-model="percentOfTarget" max="1" height="20" color="amber">
          {{ (100 * percentOfTarget).toFixed(1) }}%
        </v-progress-linear>
      </tr>
      <tr v-if="target != undefined && percentOfTarget < 1">
        <td>Percent (est.)</td>
        <v-progress-linear v-model="percentOfTargetEstimated" max="1" height="20" color="amber">
          {{ (100 * percentOfTargetEstimated).toFixed(1) }}%
        </v-progress-linear>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted, toRefs } from 'vue'
// onMounted, onBeforeUnmount
import {
  helperDateToString,
  helperSecondsToString,
  helperValueToString,
  playSoundTimerDone
} from '../helper'
import { helperLinReg } from '../helperLinReg'
import type { UnitType, DataRowType } from '../types'
import TooltipSpeed from './TooltipSpeed.vue'

// Not used any more, since I want to prevent hashed filenames and allow for caching on client side
// import notificationSound from '@/assets/481151__matrixxx__cow-bells-01.mp3'

const props = defineProps({
  data: { type: Array<DataRowType>, required: true },
  settings: {
    type: Object,
    default: () => ({ showDays: false, unitSpeed: 'min' as UnitType }),
    required: true
  },
  target: { type: Number, default: undefined as number | undefined }
})

const { target } = toRefs(props)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(target, (_newTarget, _oldTarget) => {
  targetReached = false
  updateStats()
})

watch(
  props.data,
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
let firstItems = 0.0
let lastItems = 0.0
let itemsDone = 0

// these are not computed, because only available if target is set
const eta = ref(new Date(0))
const percentOfTarget = ref(0.0)
const percentOfTargetEstimated = ref(0.0)
const timeSinceFirstRow = ref(0.0)
const timeSinceLastRow = ref(0.0)
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
  firstItems = 0.0
  lastItems = 0.0
  itemsDone = 0
}

function updateStats() {
  if (props.data.length == 0) {
    // this case is handled by resetStats()
    return
  }
  firstDate = props.data[0].date
  firstItems = props.data[0].items
  lastDate = props.data[props.data.length - 1].date
  lastItems = props.data[props.data.length - 1].items
  itemsDone = props.target != 0 ? lastItems : firstItems - lastItems

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
    itemsTotal.value = props.target != 0 ? props.target : firstItems
    percentOfTarget.value = itemsDone / itemsTotal.value

    if (itemsPerSec.value == 0 || itemsTotal.value <= itemsDone) {
      eta.value = new Date(0)
    } else {
      let timeLastRowToETA = 0
      if (props.target != 0) {
        // mode count-up
        timeLastRowToETA = (itemsTotal.value - itemsDone) / itemsPerSec.value
      } else {
        // mode count-down has neg slope
        timeLastRowToETA = (itemsTotal.value - itemsDone) / -itemsPerSec.value
      }
      eta.value = new Date(lastDate.getTime() + timeLastRowToETA * 1000)
    }
  }

  updateTimes()
  startTimer()
}

function updateTimes() {
  // periodically executed by interval timer
  if (props.data.length == 0) {
    nowTS = 0
    timeSinceFirstRow.value = 0
    timeSinceLastRow.value = 0
    itemsEstimated.value = 0
    return
  }
  nowTS = new Date().getTime()
  timeSinceFirstRow.value = Math.round((nowTS - firstDate.getTime()) / 1000)
  timeSinceLastRow.value = (nowTS - lastDate.getTime()) / 1000

  // calc itemsEstimated
  if (props.data.length == 1 || lastItems == 0) {
    itemsEstimated.value = lastItems
  } else {
    itemsEstimated.value = lastItems + itemsPerSec.value * timeSinceLastRow.value
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
          (itemsDone + itemsPerSec.value * timeSinceLastRow.value) / itemsTotal.value
      } else {
        // count-down: itemsPerSec is negative!
        percentOfTargetEstimated.value =
          (itemsDone - itemsPerSec.value * timeSinceLastRow.value) / itemsTotal.value
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
  if ((timeToETA.value == 0 || timeToETA.value > 15 * 60) && timeSinceFirstRow.value > 15 * 60) {
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

function valueToString(value: number): String {
  return helperValueToString(value)
}
</script>
