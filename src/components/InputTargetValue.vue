<template>
  <v-container class="align-start">
    <v-row>
      <v-col cols="6" md="3">
        <!-- :append-inner-icon="'mdi-content-save'" -->
        <!-- @click:append-inner="enterTarget" -->
        <v-text-field
          v-model="inputTarget"
          label="Target"
          type="number"
          inputmode="decimal"
          variant="outlined"
          @keyup.enter="enterTarget"
          @blur="enterTarget"
        />
      </v-col>
      <v-col cols="6" md="3">
        <!-- :append-inner-icon="'mdi-content-save'" -->
        <!-- v-model.number="inputValue" -->
        <!-- @click:append-inner="enterValue" -->
        <v-text-field
          v-model.number="inputValue"
          label="Value"
          type="number"
          inputmode="decimal"
          variant="outlined"
          @keyup.enter="enterValue"
          @blur="enterValue"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputTargetValue',
  props: { target: { type: Number || undefined, default: undefined } },
  emits: ['set-target', 'add-row'],
  data() {
    return {
      inputTarget: '',
      inputValue: '',
    }
  },
  watch: {
    target: { handler: 'updateInputFieldFromTarget' },
  },
  methods: {
    enterTarget() {
      const target = parseFloat(this.inputTarget)
      if (isNaN(target)) {
        this.inputTarget = ''
        return
      }
      if (target != this.target) {
        this.$emit('set-target', target)
      }
    },
    enterValue() {
      const value = parseFloat(this.inputValue)
      if (isNaN(value)) {
        return
      }

      const date = new Date()
      const newRow = { date: date, value: value }
      // Emit an event to add the row to the data
      this.$emit('add-row', newRow)
      this.inputValue = ''
    },
    updateInputFieldFromTarget() {
      if (this.target !== undefined) {
        this.inputTarget = this.target.toString()
      } else {
        this.inputTarget = ''
      }
    },
  },
})
</script>
