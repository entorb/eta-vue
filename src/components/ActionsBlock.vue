<template>
  <v-container class="align-start">
    <v-row>
      <v-col cols="3">
        <v-select label="Unit" variant="outlined" v-model="unitSelected" :items="unitList" />
        <!-- @change="$emit('unit')" -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn icon="$plus1" @click="$emit('plus-1')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emits = defineEmits(['plus-1', 'unit'])
const { initialValue } = defineProps(['initialValue'])

// initialized manually, was too lazy to sync the init from App.vue
const unitList = ref(['sec', 'min', 'hour', 'day'])
const unitSelected = ref(initialValue || 'min')

// const unitSelected = ref('min')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(unitSelected, () => {
  emits('unit', unitSelected)
})
</script>
