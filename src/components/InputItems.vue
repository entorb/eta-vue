<script setup lang="ts">
import { ref, watch } from 'vue'
// , computed
import type { DataRowRedType } from '../types'
import { helperValidateItemsInput } from '../helper'
import { colorItems } from '../colors'

const props = defineProps({
  currentItems: { type: Number, required: true }
})

const emits = defineEmits(['add-row'])

const inputItems = ref('')
const label = ref('Value')

watch(
  () => props.currentItems,
  newVal => {
    label.value = isNaN(newVal) ? 'Value' : String(newVal)
  }
)

function enterItems() {
  const itemsStr = inputItems.value
  if (!helperValidateItemsInput(itemsStr)) {
    return
  }
  const date = new Date()
  const newRow: DataRowRedType = { date: date, items: parseFloat(itemsStr.replace(',', '.')) }
  // Emit an event to add the row to the data
  emits('add-row', newRow)
  inputItems.value = ''
}

// const inputItemsLabel = computed(() => {
//   return props.target > 0 ? 'Current' : 'To go'
// })
</script>

<template>
  <v-text-field
    id="input-items"
    v-model="inputItems"
    :label="label"
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
