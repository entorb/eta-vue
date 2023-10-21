<template>
  <v-container class="align-start">
    <v-row>
      <v-col cols="3">
        <v-select label="Unit" variant="outlined" v-model="unitSelected" :items="units" />
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ActionsBlock',
  emits: ['plus-1', 'unit'],
  data: () => ({
    unitSelected: 'min', // initializes manually, was too lazy to sync the init from App.vue
    units: ['sec', 'min', 'hour', 'day']
  }),
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unitSelected(newItem, oldItem) {
      this.$emit('unit', newItem)
    }
  }
})
</script>
