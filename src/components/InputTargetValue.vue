<template>
  <v-container class="align-start">
    <v-row>
      <v-col cols="6" md="3">
        <v-text-field
          v-model="inputTarget"
          label="Target"
          :append-inner-icon="'mdi-content-save'"
          variant="outlined"
          type="text"
          @click:append-inner="enterTarget"
          @keyup.enter="enterTarget"
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field
          v-model="inputValue"
          label="Value"
          :append-inner-icon="'mdi-content-save'"
          variant="outlined"
          type="text"
          @click:append-inner="enterValue"
          @keyup.enter="enterValue"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['set-target', 'add-row'],
  //   components: {},
  props: { target: { type: Number, default: 0.0 } },
  data() {
    return {
      inputTarget: this.target.toString() || '',
      inputValue: '',
    }
  },
  methods: {
    enterTarget() {
      const target = parseFloat(this.inputTarget)
      if (isNaN(target)) {
        this.inputTarget = ''
        return
      }
      this.$emit('set-target', target)
    },
    enterValue() {
      const value = parseFloat(this.inputValue)
      if (isNaN(value)) {
        return
      }

      const date = new Date()
      const newRow = { date: date, value: value }
      // Emit an event to update the data table
      this.$emit('add-row', newRow)
      this.inputValue = ''
    },
  },
})
</script>
