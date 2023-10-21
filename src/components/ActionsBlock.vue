<template>
  <v-container class="align-start">
    <v-btn icon="$plus1" @click="$emit('plus-1')"></v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ActionsBlock',
  // props: {
  //   data: { type: Array<{ date: Date; value: number }>, default: [] },
  // },
  emits: ['plus-1']
})
</script>
