<template>
  <v-table ref="tableRef" fixed-header height="300px" density="compact" class="align-start">
    <thead>
      <tr>
        <th>Date</th>
        <th>Items</th>
        <th>Speed</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td>{{ dateToString(row.date, true) }}</td>
        <td>{{ row.value }}</td>
        <td>
          <span v-if="index >= 1">
            <TooltipSpeed :ips="calculateItemsPerSec(index)"></TooltipSpeed>
          </span>
        </td>
      </tr>
    </tbody>
  </v-table>
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString } from './helper'

export default defineComponent({
  components: {
    TooltipSpeed,
  },
  props: {
    data: { type: Array<{ date: Date; value: number }>, default: [] },
  },
  methods: {
    dateToString(datetime: Date, showDays: boolean = false): string {
      return helperDateToString(datetime, showDays)
    },

    calculateItemsPerSec(index: number): number {
      if (index <= 1 || this.data.length <= 2) {
        return 0
      }
      const currentItem = this.data[index]
      const prevItem = this.data[index - 1]
      const deltaT = (Number(currentItem.date) - Number(prevItem.date)) / 1000
      const deltaItems = currentItem.value - prevItem.value
      return deltaItems / deltaT
    },
  },
})
</script>
