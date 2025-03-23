<template>
  <v-select
    id="select-mode"
    v-model="selectedMode"
    :items="modes"
    label="Mode"
    mandatory
    variant="outlined"
  />
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

const emits = defineEmits(['set-target'])

const props = defineProps({
  target: { type: Number, default: 0 }
})

const { target } = toRefs(props)
watch(target, () => {
  selectedMode.value = target.value > 0 ? 'Up' : 'Down'
})

const modes = ref(['Down', 'Up'])
const selectedMode = ref(props.target > 0 ? 'Up' : 'Down')

// TODO: replace by trigger function
watch(selectedMode, () => {
  if (selectedMode.value == 'Down' && target.value != 0) {
    emits('set-target', 0)
  } else if (selectedMode.value == 'Up' && target.value <= 0) {
    // defaults to target = 100
    emits('set-target', 100)
  }
})

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
</script>
