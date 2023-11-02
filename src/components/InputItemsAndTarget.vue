<template>
  <v-col cols="6" md="2">
    <v-select
      id="select-mode"
      v-model="selectedMode"
      :items="modes"
      label="Mode"
      mandatory
      variant="outlined"
    >
    </v-select>
    <!-- item-value="value" -->
    <!-- append-icon="icon" -->
    <!-- :item-props="itemProps" -->
  </v-col>
  <v-col v-if="selectedMode == 'Up'" cols="6" md="3">
    <v-text-field
      id="input-target"
      v-model="inputTarget"
      label="Target items"
      type="text"
      inputmode="decimal"
      variant="outlined"
      @keyup.enter="enterTarget"
      @blur="enterTarget"
    />
    <!-- append-icon="$save" @click:append="enterTarget" -->
  </v-col>
  <!-- label="Current items" -->
  <v-col cols="6" md="3">
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
  </v-col>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, computed } from 'vue'
import type { DataRowRedType } from '../types'

// interface SelectItem {
//   text: string
//   value: number
//   icon: string
// }

// const items = ref<SelectItem[]>([
//   { text: 'Up', value: 1, icon: '$arrowUp' },
//   { text: 'Simple', value: 2, icon: '$arrowUpDown' },
//   { text: 'Down', value: 3, icon: '$arrowDown' }
// ])

// function itemProps(item: SelectItem) {
//   return {
//     title: item.text,
//     value: item.value,
//     icon: item.icon
//   }
// }

const props = defineProps({
  target: { type: Number, default: undefined as number | undefined }
})

const emits = defineEmits(['set-target', 'add-row'])

const modes = ref(['Up', 'Simple', 'Down'])
const selectedMode = ref(props.target == undefined ? 'Simple' : props.target > 0 ? 'Up' : 'Down')

const inputItemsLabel = computed(() => {
  return selectedMode.value === 'Down' ? 'Items to go' : 'Current items'
})

const inputTarget = ref('')
const inputItems = ref('')

const { target } = toRefs(props)
watch(target, () => {
  updateInputFieldFromTarget()
  selectedMode.value = target.value == undefined ? 'Simple' : target.value > 0 ? 'Up' : 'Down'
})

watch(selectedMode, () => {
  if (selectedMode.value == 'Down') {
    emits('set-target', 0)
  } else if (selectedMode.value == 'Simple') {
    emits('set-target', undefined)
  }
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

function updateInputFieldFromTarget() {
  if (props.target !== undefined) {
    inputTarget.value = props.target.toString()
  } else {
    inputTarget.value = ''
  }
}
</script>
