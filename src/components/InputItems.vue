<template>
  <!-- label="Current items" -->
  <v-text-field
    id="input-items"
    v-model="inputItems"
    :label="inputItemsLabel"
    type="text"
    inputmode="decimal"
    variant="outlined"
    append-icon="$save"
    @keyup.enter="enterItems"
    @blur="enterItems"
    @click:append="enterItems"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataRowRedType } from '../types'

const emits = defineEmits(['add-row'])

const props = defineProps({
  target: { type: Number, default: undefined as number | undefined }
})

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

const inputItemsLabel = computed(() => {
  return props.target == 0 ? 'Items to go' : 'Current items'
})
</script>
