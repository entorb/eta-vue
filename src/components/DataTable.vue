<template>
  <!-- v-data-table would support sorting... -->
  <v-table ref="tableRef" fixed-header height="300px" density="compact" class="align-start">
    <thead>
      <tr>
        <th>Date</th>
        <th>Items</th>
        <th>Speed</th>
        <th :class="{ 'text-center': true }">
          <v-btn icon="mdi-trash-can" icon-color="red" @click="deleteAllData" flat />
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- reverse data
      in data.slice().reverse() -->
      <tr v-for="(row, index) in data" :key="index">
        <td>{{ dateToString(row.date, true) }}</td>
        <td :class="{ 'text-right': true }">{{ row.value }}</td>
        <td :class="{ 'text-center': true }">
          <TooltipSpeed :ips="calculateItemsPerSec(index)" v-if="index >= 1"></TooltipSpeed>
        </td>
        <td :class="{ 'text-center': true }">
          <v-btn icon="mdi-trash-can" @click="deleteRow(index)" size="small" flat />
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
  emits: ['delete-all-data'],
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
      if (index == 0 || this.data.length == 0) {
        return 0
      }
      const currentItem = this.data[index]
      const prevItem = this.data[index - 1]
      const deltaT = (Number(currentItem.date) - Number(prevItem.date)) / 1000
      const deltaItems = currentItem.value - prevItem.value
      return deltaItems / deltaT
    },
    deleteRow(index: number) {
      if (index >= 0 && index < this.data.length) {
        // Removes one element at the specified index
        this.data.splice(index, 1)
      }
    },
    deleteAllData() {
      this.$emit('delete-all-data')
    },
  },
})
</script>
