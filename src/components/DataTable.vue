<template>
  <!-- v-data-table would support sorting... -->
  <v-table ref="tableRef" fixed-header height="300px" density="compact" class="align-start">
    <thead>
      <tr>
        <th>Date</th>
        <th>Items</th>
        <th>Speed</th>
        <th :class="{ 'text-center': true }">
          <v-btn icon="mdi-trash-can" icon-color="red" flat @click="$emit('delete-all-data')" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td>{{ dateToString(row.date, true) }}</td>
        <td :class="{ 'text-right': true }">{{ row.value }}</td>
        <td :class="{ 'text-center': true }">
          <TooltipSpeed
            v-if="index >= 1"
            :ips="calculateItemsPerSecFromPreviousLine(index)"
          ></TooltipSpeed>
        </td>
        <td :class="{ 'text-center': true }">
          <v-btn icon="mdi-trash-can" size="small" flat @click="$emit('delete-row', index)" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString } from './helper'

export default defineComponent({
  name: 'DataTable',
  components: {
    TooltipSpeed,
  },
  props: {
    data: { type: Array<{ date: Date; value: number }>, required: true },
  },
  emits: ['delete-all-data', 'delete-row'],
  methods: {
    dateToString(datetime: Date, showDays: boolean = false): string {
      return helperDateToString(datetime, showDays)
    },
    calculateItemsPerSecFromPreviousLine(index: number): number {
      if (index == 0 || this.data.length == 0) {
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
