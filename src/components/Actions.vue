<template>
  <v-btn icon="mdi-numeric-positive-1" @click="$emit('plus-1')"></v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Actions',
  props: {
    data: { type: Array<{ date: Date; value: number }>, default: [] },
  },
  emits: ['plus-1'],
})
</script>
