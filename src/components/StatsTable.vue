<template>
  <v-card v-if="data.length >= 2 && showETA && !targetReached" width="250px">
    <v-card-title class="text-h6 text-md-h5 text-lg-h4"
      ><strong>{{ secToString(timeToETA) }}</strong></v-card-title
    >
  </v-card>

  <v-table v-if="data.length >= 2" density="compact" class="align-start">
    <tbody>
      <!-- <tr v-if="showETA && !targetReached">
        <td>Time to go</td>
        <td>
          <strong>{{ secToString(timeToETA) }}</strong>
        </td>
      </tr> -->
      <tr v-if="showETA">
        <td>ETA</td>
        <td>
          <strong>{{ dateToString(eta) }}</strong>
        </td>
      </tr>
      <tr v-if="itemsPerSec !== 0.0">
        <td>Total speed</td>
        <td>
          <TooltipSpeed :ips="itemsPerSec" :unit="settings.unitSpeed"></TooltipSpeed>
        </td>
      </tr>
      <tr>
        <td>Items (est.)</td>
        <td>{{ valueToString(itemsEstimated) }}</td>
      </tr>
      <tr v-if="target != undefined && percentOfTarget < 1">
        <td>Percent (est.)</td>
        <v-progress-linear v-model="percentOfTargetEstimated" max="1" height="20" color="amber">
          {{ (100 * percentOfTargetEstimated).toFixed(1) }}%
        </v-progress-linear>
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
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, toRefs } from 'vue'

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

const showETA = computed(() => props.target !== undefined)

let targetReached = false
// let timerInterval = null as NodeJS.Timeout | null
let timerInterval: number | null = null

// these are not computed, because only available if target is set
// calc in updateStats()
// not displayed
let firstDate = new Date(0)
let lastDate = new Date(0)
let firstItems = 0.0
let lastItems = 0.0
// displayed
const eta = ref(new Date(0))
const percentOfTarget = ref(0.0)
const itemsTotal = ref(0)
const itemsDone = ref(0)
const itemsPerSec = ref(0)

// calc in updateTimes()
const timeSinceFirstRow = ref(0.0)
const timeSinceLastRow = ref(0.0)
const itemsEstimated = ref(0.0)
const percentOfTargetEstimated = ref(0.0)
const timeToETA = ref(0)

onMounted(() => {
  updateStats()
  // Start timer logic here
})

// not stopping to support sync work with multitimer
// onBeforeUnmount(() => {
//   stopTimer()
// })

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
  itemsDone.value = 0
  itemsTotal.value = 0
  itemsPerSec.value = 0
  timeSinceFirstRow.value = 0
  timeSinceLastRow.value = 0
  itemsEstimated.value = 0
  percentOfTarget.value = 0
  timeToETA.value = 0
}

function updateStats() {
  if (props.data.length == 0) {
    eta.value = new Date(0)
    // this case is handled by resetStats()
    return
  }
  firstDate = props.data[0].date
  firstItems = props.data[0].items
  lastDate = props.data[props.data.length - 1].date
  lastItems = props.data[props.data.length - 1].items
  itemsDone.value = props.target != 0 ? lastItems : firstItems - lastItems

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

    percentOfTarget.value = itemsDone.value / itemsTotal.value
    if (itemsDone.value >= itemsTotal.value) {
      targetReached = true
    }

    if (itemsPerSec.value == 0 || itemsTotal.value <= itemsDone.value) {
      eta.value = new Date(0)
    } else {
      let timeLastRowToETA = 0
      if (props.target != 0) {
        // mode count-up
        timeLastRowToETA = (itemsTotal.value - itemsDone.value) / itemsPerSec.value
      } else {
        // mode count-down has neg slope
        timeLastRowToETA = (itemsTotal.value - itemsDone.value) / -itemsPerSec.value
      }
      eta.value = new Date(lastDate.getTime() + timeLastRowToETA * 1000)
    }
  }

  updateTimes()

  if (targetReached == false) {
    startTimer()
  }
}

function updateTimes() {
  // periodically executed by interval timer
  // updates timers and estimation of percentages and items
  // calculates
  // timeSinceFirstRow
  // timeSinceLastRow
  // itemsEstimated
  // percentOfTargetEstimated
  // timeToETA

  if (props.data.length == 0) {
    return
  }
  const nowTS = new Date().getTime()
  // 1. timeSinceFirstRow and timeSinceLastRow
  if (targetReached) {
    timeSinceFirstRow.value = Math.round((lastDate.getTime() - firstDate.getTime()) / 1000)
  } else {
    timeSinceFirstRow.value = Math.round((nowTS - firstDate.getTime()) / 1000)
  }

  timeSinceLastRow.value = (nowTS - lastDate.getTime()) / 1000

  // 2. calc itemsEstimated, also for simple mode
  let est = 0
  if (props.data.length == 1) {
    est = lastItems
  } else if (lastItems == 0) {
    est = 0
  } else {
    est = lastItems + itemsPerSec.value * timeSinceLastRow.value
  }
  if (props.target == 0 && est < 0) {
    est = 0
  } else if (props.target != undefined && props.target != 0 && nowTS > eta.value.getTime()) {
    est = props.target
  }

  itemsEstimated.value = est

  // simple mode: no end of timer and eta calc
  if (props.target == undefined) {
    return
  }

  // only one entry: no end of timer
  if (props.data.length == 1) {
    return
  }

  // if ETA = 0 -> stop here
  if (eta.value.getTime() == new Date(0).getTime()) {
    return
  }

  // 3. calc percentOfTargetEstimated and timeToETA

  // 3.1 target reached: end timer and play notification
  if (nowTS > eta.value.getTime()) {
    targetReached = true
    percentOfTargetEstimated.value = 1 // 100%
    // prevent play sound on first run
    if (timeToETA.value != 0) {
      playSoundTimerDone()
    }
    stopTimer()
    timeToETA.value = 0 // prevent to play notification again
    return
  }

  // 3.2 target not reached yet: time < eta

  // 3.2.1 percentOfTargetEstimated
  // count-up
  if (props.target != 0) {
    percentOfTargetEstimated.value =
      (itemsDone.value + itemsPerSec.value * timeSinceLastRow.value) / itemsTotal.value
  } else {
    // count-down: itemsPerSec is negative!
    percentOfTargetEstimated.value =
      (itemsDone.value - itemsPerSec.value * timeSinceLastRow.value) / itemsTotal.value
  }
  // 3.2.2 timeToETA
  timeToETA.value = Math.round((eta.value.getTime() - nowTS) / 1000)
}

// create a timer, that updates the elapsed and remaining time periodically
function startTimer() {
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
