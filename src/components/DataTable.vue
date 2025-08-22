<template>
  <v-data-table
    ref="tableRef"
    :headers="headers"
    :items="props.data"
    density="compact"
    fixed-header
    hide-default-footer
    items-per-page="-1"
  >
    <template v-slot:headers="{ columns }">
      <tr>
        <th
          v-for="column in columns"
          :key="String(column.value ?? 'default-key')"
          :style="{ textAlign: column.align }"
          scope="col"
        >
          <v-icon :icon="headers.find(h => h.value === column.value)?.icon || ''" />
        </th>
      </tr>
    </template>
    <template v-slot:item="{ item, index }">
      <tr>
        <td>
          <span
            :style="{
              textAlign: 'center',
              display: 'block'
            }"
          >
            {{ dateToString(item.date) }}
          </span>
        </td>

        <td>
          <span
            :style="{
              color: colorItems,
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block'
            }"
          >
            {{ item.items }}
          </span>
        </td>
        <td>
          <span
            :style="{
              color: colorSpeed,
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block'
            }"
          >
            <TooltipSpeed :ips="item.speed" :unit="settings.unitSpeed"></TooltipSpeed>
          </span>
        </td>
        <td>
          <v-btn
            :id="'btn-edit-row-' + index"
            size="small"
            variant="text"
            icon="$edit"
            @click="openEditDialog(index)"
          />
          <v-btn
            :id="'btn-del-row-' + index"
            icon="$trash"
            size="small"
            variant="text"
            @click="$emit('delete-row', index)"
          />
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="showEditDialog" max-width="500">
    <v-card title="Edit">
      <v-card-text>
        <!-- using browser datetime-local input, step="1" for display of seconds -->
        <v-text-field type="datetime-local" step="1" v-model="dialogData.localDateString" />
        <!-- copied from inputItems -->
        <v-text-field
          v-model="dialogData.items"
          id="edit-items"
          type="text"
          inputmode="decimal"
          prepend-icon="$items"
          variant="outlined"
          :base-color="colorItems"
          :color="colorItems"
          @keyup.enter="save()"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn :id="'btn-dialog-save'" icon="$save" @click="save()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TooltipSpeed from './TooltipSpeed.vue'
import { helperDateToString, helperDateToIsoString, helperValidateItemsInput } from '../helper'
import type { DataRowType, DataRowRedType } from '../types'
import { colorItems, colorSpeed } from '../colors'

type myHeader = {
  value: string
  icon: string | null
  width: string
  align: 'center'
}

const headers: myHeader[] = [
  { value: 'date', icon: '$timeLastInput', width: '50px', align: 'center' },
  { value: 'items', icon: '$items', width: '50px', align: 'center' },
  { value: 'speed', icon: '$speed', width: '50px', align: 'center' },
  { value: 'actions', icon: '', width: '50px', align: 'center' }
]

// v-dialog
const showEditDialog = ref(false)
const dialogData = ref({
  id: 0,
  items: '0',
  localDateString: helperDateToIsoString(new Date())
})

const props = defineProps({
  data: { type: Array<DataRowType>, required: true },
  settings: { type: Object, required: true }
})

const emit = defineEmits(['delete-all-data', 'delete-row', 'update-row'])

function dateToString(datetime: Date): string {
  return helperDateToString(datetime, props.settings.showDays)
}

function openEditDialog(index: number): void {
  dialogData.value.id = index
  dialogData.value.items = String(props.data[index]?.items ?? '') // fix Object is possibly 'undefined'
  dialogData.value.localDateString = helperDateToIsoString(props.data[index]?.date ?? new Date())
  showEditDialog.value = true
}

function save(): void {
  const d = new Date(dialogData.value.localDateString)
  const itemsStr = String(dialogData.value.items)
  if (!helperValidateItemsInput(itemsStr)) {
    return
  }
  showEditDialog.value = false
  const row: DataRowRedType = { date: d, items: Number(itemsStr) }
  emit('update-row', dialogData.value.id, row)
}

// Generates a unique key for a given data row.
// Required to assure that changes in data.speed re-render the table
// function generateRowKey(row: DataRowType): string {
//   return `${row.date.getTime()}-${row.items}-${row.speed}`
// }
</script>
