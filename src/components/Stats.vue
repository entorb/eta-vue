<template>
  <v-table v-if="data.length >= 2" height="300px" density="compact" class="align-start">
    <tbody>
      <tr>
        <th>Total speed</th>
        <td v-if="itemsPerSecSlope !== 0.0">
          <TooltipSpeed :ips="itemsPerSecSlope"></TooltipSpeed>
        </td>
      </tr>
      <tr>
        <th>Start</th>
        <td>{{ dateToString(firstDate) }}</td>
      </tr>
      <tr>
        <th>Runtime</th>
        <td>{{ secToString(timeSinceFirstValue) }}</td>
      </tr>
      <tr v-if="target != undefined">
        <th>ETA</th>
        <td>{{ dateToString(eta) }}</td>
      </tr>
      <tr v-if="target != undefined">
        <th>Time to go</th>
        <td>{{ secToString(timeToETA) }}</td>
      </tr>
      <tr v-if="target != undefined">
        <th>Percent</th>
        <td>{{ (100 * percentOfTarget).toFixed(1) }}%</td>
      </tr>
      <tr v-if="target != undefined">
        <th>Percent (est)</th>
        <td>{{ (100 * percentOfTargetEstimated).toFixed(1) }}%</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// onMounted, onBeforeUnmount
import { helperDateToString, helperSecondsToString } from './helper'
import { helperLinReg } from './helperLinReg'
import TooltipSpeed from './TooltipSpeed.vue'

export default defineComponent({
  name: 'Stats',
  components: { TooltipSpeed },
  props: {
    data: { type: Array<{ date: Date; value: number }>, required: true },
    target: { type: Number || undefined, default: undefined },
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
      timeToETA: 0,
      itemsPerSecSlope: 0.0,
      eta: new Date(0),
      timerInterval: null as NodeJS.Timeout | null,
      itemsDone: 0,
      itemsTotal: 0,
    }
  },
  watch: {
    data: {
      handler: 'updateStats',
      deep: true,
    },
    target: { handler: 'updateStats' },
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
      const showDays = this.firstDate.getTime() - this.lastDate.getTime() > 1000 * 86400 // 60 * 60 * 24
      return helperDateToString(datetime, showDays)
    },
    secToString(sec: number): string {
      return helperSecondsToString(sec)
    },
    updateStats() {
      if (this.data.length < 2) {
        this.eta = new Date(0)
        return
      }
      this.firstDate = this.data[0].date
      this.firstValue = this.data[0].value
      this.lastDate = this.data[this.data.length - 1].date
      this.lastValue = this.data[this.data.length - 1].value

      const { slope } = helperLinReg(this.data, true)
      this.itemsPerSecSlope = slope
      if (this.target !== undefined) {
        this.itemsDone = this.target != 0 ? this.lastValue : this.firstValue - this.lastValue
        this.itemsTotal = this.target != 0 ? this.target : this.firstValue
        this.percentOfTarget = this.itemsDone / this.itemsTotal

        if (this.itemsPerSecSlope != 0) {
          if (this.itemsTotal > this.itemsDone) {
            if (this.target != 0) {
              this.timeToETA = (this.itemsTotal - this.itemsDone) / this.itemsPerSecSlope
            } else {
              this.timeToETA = (this.itemsTotal - this.itemsDone) / -this.itemsPerSecSlope
            }
          }
        }
        this.eta = new Date(this.lastDate.getTime() + this.timeToETA * 1000)
      }

      this.updateTimes()
      if (new Date().getTime() < this.eta.getTime()) {
        this.startTimer()
      }
    },
    updateTimes() {
      // executed by interval timer
      const now = new Date().getTime()
      this.timeSinceFirstValue = Math.round((now - this.firstDate.getTime()) / 1000)

      // time < eta
      if (new Date().getTime() < this.eta.getTime()) {
        this.timeToETA = Math.round((this.eta.getTime() - now) / 1000)
        if (this.target !== undefined) {
          const timeSinceLastValue = (now - this.lastDate.getTime()) / 1000
          if (this.target != 0) {
            this.percentOfTargetEstimated =
              (this.itemsDone + this.itemsPerSecSlope * timeSinceLastValue) / this.itemsTotal
          } else {
            this.percentOfTargetEstimated =
              (this.itemsDone - this.itemsPerSecSlope * timeSinceLastValue) / this.itemsTotal
          }
        }
      } else {
        // if time > eta we stop the timer
        this.stopTimer()
        this.timeToETA = 0
        this.percentOfTargetEstimated = 1 // 100%
      }
    },
    // create a timer, that updates the elapsed and remaining time periodically
    startTimer() {
      this.stopTimer()
      let sleep: number = 1
      if ((this.timeToETA == 0 || this.timeToETA > 15 * 60) && this.timeSinceFirstValue > 15 * 60) {
        sleep = 30
      }

      this.timerInterval = setInterval(() => {
        this.updateTimes()
      }, sleep * 1000) // sleep time in ms
    },
    stopTimer() {
      // Stop the timer
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
  },
})
</script>
./helperLinReg
