<template>
  <!-- :label="inputItemsLabel" -->
  <v-text-field
    id="input-items"
    v-model="inputItems"
    label="Value"
    type="text"
    inputmode="decimal"
    append-icon="$save"
    prepend-icon="$items"
    variant="outlined"
    :base-color="colorItems"
    :color="colorItems"
    @blur="enterItems"
    @click:append="enterItems"
    @keyup.enter="enterItems"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// , computed
import type { DataRowRedType } from '../types'
import { colorItems } from '../colors'

const emits = defineEmits(['add-row'])

// const props = defineProps({
//   target: { type: Number, default: 0 }
// })

const inputItems = ref('')

function enterItems() {
  const items = parseFloat(inputItems.value.replace(',', '.'))
  if (isNaN(items)) {
    return
  }
  const date = new Date()
  const newRow: DataRowRedType = { date: date, items: items }
  // Emit an event to add the row to the data
  emits('add-row', newRow)
  inputItems.value = ''
}

// const inputItemsLabel = computed(() => {
//   return props.target > 0 ? 'Current' : 'To go'
// })
</script>
