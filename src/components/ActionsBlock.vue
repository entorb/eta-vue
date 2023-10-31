<template>
  <v-col cols="6" md="2">
    <v-select
      id="select-unit"
      v-model="unitSelected"
      label="Unit"
      variant="outlined"
      :items="unitList"
    />
  </v-col>
  <v-col cols="4" offset="1" md="2">
    <v-btn id="btn-plus-1" icon="$plus1" @click="$emit('plus-one')" />
  </v-col>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emits = defineEmits(['plus-one', 'unit'])

const props = defineProps({
  unitInitial: { type: String, required: true }
})

const unitList = ref(['sec', 'min', 'hour', 'day'])
const unitSelected = ref(props.unitInitial)

watch(unitSelected, () => {
  emits('unit', unitSelected)
})
</script>
