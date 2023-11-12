<template>
  <v-select
    id="select-unit"
    v-model="unitSelected"
    label="Speed unit"
    variant="outlined"
    :items="unitList"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UnitType } from '../types'

const emits = defineEmits(['unit'])

const props = defineProps({
  unitInitial: { type: String as () => UnitType, required: true }
})

const unitList = ref<UnitType[]>(['sec', 'min', 'hour', 'day'])
const unitSelected = ref<UnitType>(props.unitInitial)

watch(unitSelected, () => {
  emits('unit', unitSelected.value)
})
</script>
