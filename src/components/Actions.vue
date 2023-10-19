<template>
  <v-btn icon="mdi-numeric-positive-1" v-on:click="$emit('plus-1')"></v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Actions',
  emits: ['plus-1'],
  props: {
    data: { type: Array<{ date: Date; value: number }>, default: [] },
  },
})
</script>
