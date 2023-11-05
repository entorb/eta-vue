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
  target: { type: Number, default: undefined as number | undefined }
})

const { target } = toRefs(props)
watch(target, () => {
  selectedMode.value = target.value == undefined ? 'Simple' : target.value > 0 ? 'Up' : 'Down'
})

const modes = ref(['Up', 'Simple', 'Down'])
const selectedMode = ref(props.target == undefined ? 'Simple' : props.target > 0 ? 'Up' : 'Down')

watch(selectedMode, () => {
  if (selectedMode.value == 'Down') {
    emits('set-target', 0)
  } else if (selectedMode.value == 'Simple') {
    emits('set-target', undefined)
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
