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
        <td></td>
      </tr>
      <tr>
        <th>Remaining</th>
        <td></td>
      </tr>
      <tr>
        <th>Runtime</th>
        <td></td>
      </tr>
      <tr>
        <th>Percent</th>
        <td></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { helperDateToString } from './helper'
import TooltipSpeed from './TooltipSpeed.vue'

export default defineComponent({
  components: { TooltipSpeed },
  props: {
    data: { type: Array<{ date: Date; value: number }>, default: [] },
    target: { type: Number, default: 0.0 },
  },
  data() {
    return {
      slope: 0.0,
      // intercept: Number,
      eta: new Date(0),
    }
  },
  watch: {
    data: {
      handler: 'calculateWeightedLinearRegression', // calculateLinearRegression
      deep: true,
    },
  },
  methods: {
    dateToString(datetime: Date): string {
      const firstDate = this.data[0].date
      const lastDate = this.data[this.data.length - 1].date
      const showDays = Number(firstDate) - Number(lastDate) > 1000 * 60 * 60 * 24
      return helperDateToString(datetime, showDays)
    },

    calculateXAndY(data: Array<{ date: Date; value: number }>) {
      const Y = data.map(point => point.value)
      const Xms = data.map(point => point.date.getTime()) // timestamp in ms
      const firstTimestamp = Xms[0]
      const X = Xms.map(timestamp => (timestamp - firstTimestamp) / 1000)
      return { X, Y }
    },
    calculateLinearRegression() {
      const n = this.data.length
      if (n < 2) {
        this.eta = new Date(0)
        return null
      }
      const { X, Y } = this.calculateXAndY(this.data)

      let sumX = 0
      let sumY = 0
      for (let i = 0; i < n; i++) {
        sumX += X[i]
        sumY += Y[i]
      }
      const avgX = sumX / n
      const avgY = sumY / n

      const xDifferencesToAverage = X.map(value => avgX - value)
      const yDifferencesToAverage = Y.map(value => avgY - value)
      const xDifferencesToAverageSquared = xDifferencesToAverage.map(value => value ** 2)
      const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
        (curr, index) => curr * yDifferencesToAverage[index]
      )
      const denominator = xDifferencesToAverageSquared.reduce((prev, curr) => prev + curr, 0)
      const numerator = xAndYDifferencesMultiplied.reduce((prev, curr) => prev + curr, 0)

      this.slope = numerator / denominator
      // this.intercept = avgY - this.slope * avgX;
      this.calc_ETA()
    },
    calculateWeightedLinearRegression() {
      const n = this.data.length
      if (n < 2) {
        this.eta = new Date(0)
        return null
      }
      const { X, Y } = this.calculateXAndY(this.data)

      let sumXw = 0
      let sumYw = 0
      let sumWeight = 0
      for (let i = 0; i < n; i++) {
        const weight = i + 1
        sumWeight += weight
        sumXw += X[i] * weight
        sumYw += Y[i] * weight
      }

      const avgXw = sumXw / sumWeight
      const avgYw = sumYw / sumWeight

      let numerator = 0
      let denominator = 0
      for (let i = 0; i < n; i++) {
        const weight = i + 1
        numerator += weight * (X[i] - avgXw) * (Y[i] - avgYw)
        denominator += weight * (X[i] - avgXw) ** 2
      }

      this.slope = numerator / denominator
      // this.intercept = avgYw - this.slope * avgXw;
      this.calc_ETA()
    },
    calc_ETA() {
      if (!this.target) {
        return
      }
      const lastValue = this.data[this.data.length - 1].value
      const lastDate = this.data[this.data.length - 1].date
      const target = this.target
      const secToGo = (target - lastValue) / this.slope
      this.eta = new Date(lastDate.getTime() + secToGo * 1000)
    },
  },
})
</script>
