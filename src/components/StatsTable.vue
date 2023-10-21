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

<script lang="ts">
import { defineComponent } from 'vue'
// onMounted, onBeforeUnmount
import { helperDateToString, helperSecondsToString, helperValueToString } from './helper'
import { helperLinReg } from './helperLinReg'
import TooltipSpeed from './TooltipSpeed.vue'
import notificationSound from '@/assets/481151__matrixxx__cow-bells-01.mp3'

export default defineComponent({
  name: 'StatsTable',
  components: { TooltipSpeed },
  props: {
    data: { type: Array<{ date: Date; value: number }>, required: true },
    settings: {
      type: Object,
      default: () => ({ showDays: false, unitSpeed: 'sec' }),
      required: true
    },
    target: { type: Number || undefined, default: undefined }
  },
  data() {
    return {
      firstDate: new Date(0),
      lastDate: new Date(0),
      firstValue: 0.0,
      lastValue: 0.0,
      percentOfTarget: 0.0,
      percentOfTargetEstimated: 0.0,
      timeSinceFirstValue: 0.0,
      timeSinceLastValue: 0.0,
      timeToETA: 0,
      itemsPerSec: 0.0,
      itemsEstimated: 0.0,
      eta: new Date(0),
      timerInterval: null as NodeJS.Timeout | null,
      itemsDone: 0,
      itemsTotal: 0,
      targetReached: false
    }
  },
  watch: {
    data: {
      handler: 'updateStats',
      deep: true
    },
    target: { handler: 'updateStats' }
  },
  created() {
    this.updateStats()
    // also starts timer
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    dateToString(datetime: Date): string {
      // decide if we need to show days
      // TODO: move to App settings
      return helperDateToString(datetime, this.settings.showDays)
    },
    secToString(sec: number): string {
      return helperSecondsToString(sec)
    },
    updateStats() {
      if (this.data.length <= 1) {
        this.eta = new Date(0)
        return
      }
      this.targetReached = false // periodically checked and updated in updateTimes
      this.firstDate = this.data[0].date
      this.firstValue = this.data[0].value
      this.lastDate = this.data[this.data.length - 1].date
      this.lastValue = this.data[this.data.length - 1].value

      const { slope } = helperLinReg(this.data, true)
      this.itemsPerSec = slope

      // only for mode count-up and count-down the eta calc makes sense
      if (this.target !== undefined) {
        this.itemsDone = this.target != 0 ? this.lastValue : this.firstValue - this.lastValue
        this.itemsTotal = this.target != 0 ? this.target : this.firstValue
        this.percentOfTarget = this.itemsDone / this.itemsTotal

        if (this.itemsPerSec != 0) {
          if (this.itemsTotal > this.itemsDone) {
            if (this.target != 0) {
              this.timeToETA = (this.itemsTotal - this.itemsDone) / this.itemsPerSec
            } else {
              this.timeToETA = (this.itemsTotal - this.itemsDone) / -this.itemsPerSec
            }
          }
        }
        this.eta = new Date(this.lastDate.getTime() + this.timeToETA * 1000)
      } else {
        this.eta = new Date(0)
      }

      this.updateTimes()
      this.startTimer()
    },
    updateTimes() {
      // executed by interval timer
      const now = new Date().getTime()
      this.timeSinceFirstValue = Math.round((now - this.firstDate.getTime()) / 1000)
      this.timeSinceLastValue = (now - this.lastDate.getTime()) / 1000

      this.itemsEstimated =
        this.lastValue == 0 ? 0 : this.lastValue + this.itemsPerSec * this.timeSinceLastValue

      // time < eta
      if (new Date().getTime() < this.eta.getTime()) {
        this.timeToETA = Math.round((this.eta.getTime() - now) / 1000)
        // only for modes count-down and count-up the percent calc makes sense
        if (this.target !== undefined) {
          if (this.target != 0) {
            // count-up
            this.percentOfTargetEstimated =
              (this.itemsDone + this.itemsPerSec * this.timeSinceLastValue) / this.itemsTotal
          } else {
            // count-down: itemsPerSec is negative!
            this.percentOfTargetEstimated =
              (this.itemsDone - this.itemsPerSec * this.timeSinceLastValue) / this.itemsTotal
          }
        }
      } else {
        // if time > eta we stop the timer
        // this.stopTimer()
        if (this.targetReached == false) {
          this.targetReached = true
          this.playSoundTimerDone()
        }
        this.timeToETA = -1 // prevent s
        this.percentOfTargetEstimated = 1 // 100%
      }
    },
    // create a timer, that updates the elapsed and remaining time periodically
    startTimer() {
      this.stopTimer()
      let sleep: number = 1
      // decide on the sleep time
      if ((this.timeToETA == 0 || this.timeToETA > 15 * 60) && this.timeSinceFirstValue > 15 * 60) {
        sleep = 30
      }

      this.timerInterval = setInterval(() => {
        this.updateTimes()
      }, sleep * 1000)
    },
    stopTimer() {
      // Stop the timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
    playSoundTimerDone() {
      this.playSound(notificationSound)
    },
    playSound(url: string) {
      const audio = new Audio(url)
      audio.play()
    },
    valueToString(value: number): String {
      return helperValueToString(value)
    }
  }
})
</script>
