<template>
  <v-data-table
    ref="tableRef"
    fixed-header
    density="compact"
    :headers="headers"
    :items="props.data"
    hide-default-footer
  >
    <template #headers="{ columns }">
      <tr>
        <th v-for="column in columns" :key="column.value" :style="{ textAlign: column.align }">
          <v-icon v-if="column.icon" :icon="column.icon" />
        </th>
      </tr>
    </template>
    <template #item.date="{ item }">
      {{ dateToString(item.date) }}
    </template>
    <template #item.items="{ item }">
      <div :style="{ color: colorItems, fontWeight: 'bold' }">
        {{ item.items }}
      </div>
    </template>
    <template #item.speed="{ item }">
      <div :style="{ color: colorSpeed, fontWeight: 'bold' }">
        <TooltipSpeed :ips="item.speed" :unit="settings.unitSpeed"></TooltipSpeed>
      </div>
    </template>
    <template #item.actions="{ item, index }">
      <v-btn
        :id="'btn-del-row-' + index"
        icon="$trash"
        size="small"
        variant="text"
        @click="$emit('delete-row', index)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString } from '../helper'
import type { DataRowType } from '../types'
import { colorItems, colorSpeed } from '../colors'

const headers = [
  { value: 'date', icon: '$timeLastInput', width: '50px', align: 'center' },
  { value: 'items', icon: '$items', width: '50px', align: 'center' },
  { value: 'speed', icon: '$speed', width: '50px', align: 'center' },
  { value: 'actions', width: '50px', align: 'center' }
]

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
