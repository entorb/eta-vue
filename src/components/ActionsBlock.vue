<template>
  <v-container class="align-start">
    <v-row>
      <v-col>
        <v-select
          id="select-unit"
          v-model="unitSelected"
          label="Unit"
          variant="outlined"
          :items="unitList"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn id="btn-plus-1" icon="$plus1" @click="$emit('plus-1')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emits = defineEmits(['plus-1', 'unit'])

const props = defineProps({
  unitInitial: { type: String, required: true }
})

const unitList = ref(['sec', 'min', 'hour', 'day'])
const unitSelected = ref(props.unitInitial)

watch(unitSelected, () => {
  emits('unit', unitSelected)
})
</script>
