<template>
  <v-table v-if="data.length > 1" height="300px" density="compact" class="align-start">
    <tbody>
      <tr>
        <th>Total speed</th>
        <td v-if="slope !== 0.0"><TooltipSpeed :ips="slope"></TooltipSpeed></td>
      </tr>
      <tr v-if="eta.getTime() !== new Date(0).getTime()">
        <th>ETA</th>
        <td>{{ dateToString(eta) }}</td>
      </tr>
      <tr>
        <th>Start</th>
        <td>{{ dateToString(firstDate) }}</td>
      </tr>
      <tr>
        <th>Remaining</th>
        <td>{{ secToString(secToGo) }}</td>
      </tr>
      <tr>
        <th>Runtime</th>
        <td>{{ secToString(runtime) }}</td>
      </tr>
      <tr>
        <th>Percent</th>
        <td>{{ percent.toFixed(0) }}%</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { helperDateToString, helperSecondsToString } from './helper'
import { helper_lin_reg } from './helper_lin_reg'
import TooltipSpeed from './TooltipSpeed.vue'

export default defineComponent({
  components: { TooltipSpeed },
  props: {
    data: { type: Array<{ date: Date; value: number }>, default: [] },
    target: { type: Number, default: 0.0 },
  },
  data() {
    return {
      firstDate: new Date(0),
      firstValue: 0.0,
      lastDate: new Date(0),
      lastValue: 0.0,
      percent: 0.0,
      runtime: 0.0,
      secToGo: 0,
      slope: 0.0,
      eta: new Date(0),
    }
  },
  created() {
    this.updateStats()
  },
  watch: {
    data: {
      handler: 'updateStats',
      deep: true,
    },
    target: { handler: 'updateStats' },
  },
  methods: {
    dateToString(datetime: Date): string {
      const firstDate = this.data[0].date
      const lastDate = this.data[this.data.length - 1].date
      const showDays = Number(firstDate) - Number(lastDate) > 1000 * 60 * 60 * 24
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
      const { slope, intercept } = helper_lin_reg(this.data, true)
      this.slope = slope
      let seconds_till_target = 0
      if (this.target > this.lastValue && this.slope != 0) {
        seconds_till_target = (this.target - this.lastValue) / this.slope
      }
      this.eta = new Date(this.lastDate.getTime() + seconds_till_target * 1000)
      this.percent = (100 * this.data[this.data.length - 1].value) / this.target
      // TODO: these should be updated by setInterval
      this.runtime = Math.round((new Date().getTime() - this.firstDate.getTime()) / 1000)
      if (this.eta.getTime() > new Date().getTime()) {
        this.secToGo = Math.round((this.eta.getTime() - new Date().getTime()) / 1000)
      } else {
        this.secToGo = 0
      }
    },
  },
})
</script>
