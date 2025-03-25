<template>
  <!-- v-data-table would support sorting... -->
  <!-- height="300px"  -->
  <v-table ref="tableRef" fixed-header density="compact" class="align-start">
    <thead>
      <tr>
        <th scope="col" :class="{ 'text-center': true }"><v-icon icon="$timeLastInput" /></th>
        <th scope="col" :class="{ 'text-center': true }"><v-icon icon="$items" /></th>
        <th scope="col" :class="{ 'text-center': true }"><v-icon icon="$speed" /></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="generateRowKey(row)">
        <td>{{ dateToString(row.date) }}</td>
        <td :class="{ 'text-right': true }">
          <span :style="{ color: colorItems, fontWeight: 'bold' }">{{ row.items }}</span>
        </td>
        <td :class="{ 'text-center': true }">
          <span :style="{ color: colorSpeed, fontWeight: 'bold' }">
            <TooltipSpeed
              v-if="index >= 1"
              :ips="row.speed"
              :unit="settings.unitSpeed"
            ></TooltipSpeed>
          </span>
        </td>
        <td :class="{ 'text-center': true }">
          <v-btn
            :id="'btn-del-row-' + index"
            icon="$trash"
            size="small"
            variant="text"
            @click="$emit('delete-row', index)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString } from '../helper'
import type { DataRowType } from '../types'
import { colorItems, colorSpeed } from '../colors'

const props = defineProps({
  data: { type: Array<DataRowType>, required: true },
  settings: { type: Object, required: true }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(['delete-all-data', 'delete-row'])

function dateToString(datetime: Date): string {
  return helperDateToString(datetime, props.settings.showDays)
}

// Generates a unique key for a given data row.
// Required to assure that changes in data.speed re-render the table
function generateRowKey(row: DataRowType): string {
  return `${row.date.getTime()}-${row.items}-${row.speed}`
}
</script>
