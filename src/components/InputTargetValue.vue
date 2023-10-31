<template>
  <!-- not: v-model.number, as it removes "," from input-->
  <v-col cols="12" md="3">
    <v-text-field
      id="input-value"
      v-model="inputValue"
      label="Current items"
      type="text"
      inputmode="decimal"
      variant="outlined"
      append-icon="$save"
      @keyup.enter="enterValue"
      @blur="enterValue"
      @click:append="enterValue"
    />
  </v-col>
  <v-col cols="12" md="3">
    <v-text-field
      id="input-target"
      v-model="inputTarget"
      label="Target"
      type="text"
      inputmode="decimal"
      variant="outlined"
      append-icon="$save"
      @keyup.enter="enterTarget"
      @blur="enterTarget"
      @click:append="enterTarget"
    />
  </v-col>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import type { DataRowRedType } from '../types'

const props = defineProps({
  target: { type: Number, default: undefined as number | undefined }
})

const emits = defineEmits(['set-target', 'add-row'])

const inputTarget = ref('')
const inputValue = ref('')

const { target } = toRefs(props)
watch(target, () => {
  updateInputFieldFromTarget()
})

function enterTarget() {
  let target = undefined
  if (inputTarget.value == '') {
    target = undefined
  } else {
    target = parseFloat(inputTarget.value.replace(',', '.'))
    if (isNaN(target)) {
      inputTarget.value = ''
      return
    }
  }
  if (target != props.target) {
    emits('set-target', target)
  }
}

function enterValue() {
  const value = parseFloat(inputValue.value.replace(',', '.'))
  if (isNaN(value)) {
    return
  }
  const date = new Date()
  const newRow: DataRowRedType = { date: date, value: value }
  // Emit an event to add the row to the data
  emits('add-row', newRow)
  inputValue.value = ''
}

function updateInputFieldFromTarget() {
  if (props.target !== undefined) {
    inputTarget.value = props.target.toString()
  } else {
    inputTarget.value = ''
  }
}
</script>
