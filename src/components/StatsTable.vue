<script setup lang="ts">
import { ref, computed, watch, onMounted, toRefs } from 'vue'

import { colorItems, colorSpeed } from '../colors'
import {
  helperDateToString,
  helperSecondsToString,
  helperValueToString,
  helperPlaySoundTimerDone
} from '../helper'
import { helperLinReg } from '../helperLinReg'
import type { DataRowType } from '../types'

import TooltipSpeed from './TooltipSpeed.vue'

// Not used any more, since I want to prevent hashed filenames and allow for caching on client side
// import notificationSound from '@/assets/481151__matrixxx__cow-bells-01.mp3'

interface Props {
  data: DataRowType[]
  settings: { showDays: boolean; unitSpeed: string }
  target?: number
}

const props = withDefaults(defineProps<Props>(), {
  target: 0
})

const emit = defineEmits<{
  itemsPerSec: [slope: number]
}>()

const { target } = toRefs(props)

watch(target, () => {
  targetReached = false
  updateStats()
})

watch(
  () => props.data,
  () => {
    if (props.data.length === 0) {
      resetStats()
    }
    targetReached = false
    updateStats()
  },
  { deep: true }
)

const showETA = computed(() => eta.value.getTime() > 0)

let targetReached = false
// let timerInterval = null as NodeJS.Timeout | null
let timerInterval: number | null = null

// TODO: Leftover from simple mode: these are not computed, because only available if target is set
// calc in updateStats()
// not displayed
const dateFirst = ref(new Date(0))
const dateLast = ref(new Date(0))
const itemsFirst = ref(0.0)
const itemsLast = ref(0.0)
// displayed
const eta = ref(new Date(0))
const percentOfTarget = ref(0.0)
const itemsTotal = ref(0)
const itemsDone = ref(0)
const itemsPerSec = ref(0)

// calc in updateTimes()
const secSinceFirstRow = ref(0.0)
const secSinceLastRow = ref(0.0)
const itemsEstimated = ref(0.0)
const percentOfTargetEstimated = ref(0.0)
const secToETA = ref(0)

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
  // triggered by watcher if data empty
  eta.value = new Date(0)
  dateFirst.value = new Date(0)
  dateLast.value = new Date(0)
  itemsFirst.value = 0.0
  itemsLast.value = 0.0
  itemsDone.value = 0
  itemsTotal.value = 0
  itemsPerSec.value = 0
  secSinceFirstRow.value = 0
  secSinceLastRow.value = 0
  itemsEstimated.value = 0
  percentOfTarget.value = 0
  secToETA.value = 0
}

function updateStats() {
  // triggered by watcher if data changed
  if (props.data.length < 2) {
    return
  }

  // read first and last row
  if (props.data[0] && props.data[props.data.length - 1]) {
    dateFirst.value = props.data[0].date
    itemsFirst.value = props.data[0].items
    dateLast.value = props.data[props.data.length - 1]?.date ?? new Date(0)
    itemsLast.value = props.data[props.data.length - 1]?.items ?? 0
  }
  // calc done and total items
  itemsDone.value = props.target > 0 ? itemsLast.value : itemsFirst.value - itemsLast.value
  itemsTotal.value = props.target > 0 ? props.target : itemsFirst.value

  const { slope } = helperLinReg(props.data, true)
  itemsPerSec.value = slope
  emit('itemsPerSec', slope)

  percentOfTarget.value = itemsDone.value / itemsTotal.value
  if (itemsDone.value >= itemsTotal.value) {
    targetReached = true
  }

  // for invalid speed or target, the ETA is set 0
  if (itemsPerSec.value == 0 || itemsTotal.value <= itemsDone.value) {
    eta.value = new Date(0)
  } else {
    const t = (itemsTotal.value - itemsDone.value) / itemsPerSec.value
    // mode 'Down' has neg slope
    const timeLastRowToETA = props.target > 0 ? t : -t
    eta.value = new Date(dateLast.value.getTime() + timeLastRowToETA * 1000)
  }

  if (!targetReached) {
    startTimer()
  } else {
    stopTimer()
  }
}

function timer_triggered_function() {
  // periodically executed by interval timer
  // updates timers and estimation of percentages and items
  // calculates:
  // timeSinceFirstRow
  // timeSinceLastRow
  // itemsEstimated
  // percentOfTargetEstimated
  // timeToETA

  if (props.data.length < 2) {
    return
  }

  const nowTS = new Date().getTime()
  // 1. timeSinceFirstRow and timeSinceLastRow
  if (targetReached) {
    secSinceFirstRow.value = Math.round(
      (dateLast.value.getTime() - dateFirst.value.getTime()) / 1000
    )
  } else {
    secSinceFirstRow.value = Math.round((nowTS - dateFirst.value.getTime()) / 1000)
  }

  secSinceLastRow.value = (nowTS - dateLast.value.getTime()) / 1000

  // 2. estimate current items
  let estItemsCurrent = itemsLast.value + itemsPerSec.value * secSinceLastRow.value

  // handle overestimation
  if (props.target == 0 && estItemsCurrent < 0) {
    estItemsCurrent = 0 // Down: limit to 0
  } else if (props.target > 0 && estItemsCurrent > props.target) {
    estItemsCurrent = props.target // Up: limit to target
  }
  itemsEstimated.value = estItemsCurrent

  // 3. calc percentOfTargetEstimated and timeToETA

  // 3.1 target reached: end timer and play notification
  if (nowTS > eta.value.getTime()) {
    targetReached = true
    percentOfTargetEstimated.value = 1 // 100%
    // prevent play sound on first run
    if (secToETA.value != 0) {
      helperPlaySoundTimerDone()
    }
    stopTimer()
    secToETA.value = 0 // prevent to play notification again
    return
  }

  // 3.2 target not reached yet: time < eta

  // 3.2.1 percentOfTargetEstimated
  // count-up
  const estItemsDone = // items estimated
    props.target > 0
      ? itemsDone.value + itemsPerSec.value * secSinceLastRow.value
      : itemsDone.value - itemsPerSec.value * secSinceLastRow.value
  percentOfTargetEstimated.value = estItemsDone / itemsTotal.value

  // 3.2.2 timeToETA
  secToETA.value = Math.round((eta.value.getTime() - nowTS) / 1000)
}

// create a timer, that updates the elapsed and remaining time periodically
function startTimer() {
  stopTimer()
  if (targetReached) {
    return
  }
  let sleep: number = 1
  // dynamically decide on the sleep time
  if (secToETA.value > 15 * 60 && secSinceLastRow.value > 15 * 60) {
    sleep = 30
  }

  timerInterval = window.setInterval(() => {
    timer_triggered_function()
  }, sleep * 1000)
}

function stopTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval)
    timerInterval = null
  }
}

function valueToString(value: number): string {
  return helperValueToString(value)
}
</script>

<template>
  <!-- color="indigo" -->
  <!-- width="250px"  -->
  <v-card
    v-if="data.length >= 2 && showETA && !targetReached"
    variant="outlined"
  >
    <!-- class="text-h6 text-md-h5 text-lg-h4" -->
    <v-card-title class="text-center">
      <v-progress-linear
        v-model="percentOfTargetEstimated"
        max="1"
        height="30"
        color="amber"
      >
        <strong>{{ secToString(secToETA) }}</strong>
      </v-progress-linear>
    </v-card-title>
  </v-card>

  <v-table
    v-if="data.length >= 2"
    density="compact"
    class="align-start"
  >
    <tbody>
      <tr v-if="showETA">
        <td><v-icon icon="$eta" /></td>
        <td :style="{ fontWeight: 'bold' }">
          {{ dateToString(eta) }}
        </td>
      </tr>
      <tr>
        <td><v-icon icon="$items" /></td>
        <td>
          <v-progress-linear
            v-model="percentOfTarget"
            max="1"
            height="30"
            :color="colorItems"
          >
            <span :style="{ fontWeight: 'bold', fontSize: '1.2em' }">
              {{ itemsLast }} ({{ (100 * percentOfTarget).toFixed(1) }}%)
            </span>
          </v-progress-linear>
          <v-progress-linear
            v-model="percentOfTargetEstimated"
            max="1"
            height="20"
            color="amber"
          >
            {{ valueToString(itemsEstimated) }} ({{ (100 * percentOfTargetEstimated).toFixed(1) }}%)
          </v-progress-linear>
        </td>
      </tr>
      <tr v-if="itemsPerSec !== 0.0">
        <td><v-icon icon="$speed" /></td>
        <td :style="{ fontWeight: 'bold', color: colorSpeed }">
          <TooltipSpeed
            :ips="itemsPerSec"
            :unit="settings.unitSpeed"
          ></TooltipSpeed
          >/
          {{ settings.unitSpeed }}
        </td>
      </tr>
      <tr>
        <td><v-icon icon="$timeLastInput" /></td>
        <td
          width="150"
          :style="{ fontWeight: 'bold' }"
        >
          {{ secToString(secSinceLastRow) }}
        </td>
      </tr>
      <tr>
        <td><v-icon icon="$timeRunning" /></td>
        <td :style="{ fontWeight: 'bold' }">{{ secToString(secSinceFirstRow) }}</td>
      </tr>
      <tr>
        <td><v-icon icon="$timeStart" /></td>
        <td :style="{ fontWeight: 'bold' }">{{ dateToString(dateFirst) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
