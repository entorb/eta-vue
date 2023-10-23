<template>
  <!-- v-data-table would support sorting... -->
  <!-- height="300px"  -->
  <v-table ref="tableRef" fixed-header density="compact" class="align-start">
    <thead>
      <tr>
        <th>Date</th>
        <th>Items</th>
        <th>Speed</th>
        <th :class="{ 'text-center': true }">
          <v-btn icon="$trashCan" icon-color="red" flat @click="$emit('delete-all-data')" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td>{{ dateToString(row.date) }}</td>
        <td :class="{ 'text-right': true }">{{ row.value }}</td>
        <td :class="{ 'text-center': true }">
          <TooltipSpeed
            v-if="index >= 1"
            :ips="calculateItemsPerSecFromPreviousLine(index)"
            :unit="settings.unitSpeed"
          ></TooltipSpeed>
        </td>
        <td :class="{ 'text-center': true }">
          <v-btn icon="$trashCan" size="small" flat @click="$emit('delete-row', index)" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString } from './helper'
import { type UnitType } from '../types'

const props = defineProps({
  data: { type: Array<{ date: Date; value: number }>, required: true },
  settings: {
    type: Object,
    default: () => ({ showDays: false, unitSpeed: 'sec' as UnitType }),
    required: true
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(['delete-all-data', 'delete-row'])

function dateToString(datetime: Date): string {
  return helperDateToString(datetime, props.settings.showDays)
}

function calculateItemsPerSecFromPreviousLine(index: number): number {
  if (index == 0 || props.data.length == 0) {
    return 0
  }
  const currentItem = props.data[index]
  const prevItem = props.data[index - 1]
  const deltaT = (currentItem.date.getTime() - prevItem.date.getTime()) / 1000
  const deltaItems = currentItem.value - prevItem.value
  return deltaItems / deltaT
}
</script>
