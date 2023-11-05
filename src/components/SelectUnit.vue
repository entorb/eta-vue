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

const emits = defineEmits(['unit'])

const props = defineProps({
  unitInitial: { type: String, required: true }
})

const unitList = ref(['sec', 'min', 'hour', 'day'])
const unitSelected = ref(props.unitInitial)

watch(unitSelected, () => {
  emits('unit', unitSelected)
})
</script>
