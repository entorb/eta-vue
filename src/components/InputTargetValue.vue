<template>
  <v-container class="align-start">
    <v-row>
      <v-col>
        <!-- not: v-model.number, as it removes "," from input-->
        <!-- append-inner-icon="$save" -->
        <!-- @click:append-inner="enterTarget" -->
        <v-text-field
          v-model="inputValue"
          label="Current"
          type="text"
          inputmode="decimal"
          variant="outlined"
          @keyup.enter="enterValue"
          @blur="enterValue"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="inputTarget"
          label="Target"
          type="text"
          inputmode="decimal"
          variant="outlined"
          @keyup.enter="enterTarget"
          @blur="enterTarget"
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
      inputValue: ''
    }
  },
  watch: {
    target: { handler: 'updateInputFieldFromTarget' }
  },
  methods: {
    enterTarget() {
      const target = parseFloat(this.inputTarget.replace(',', '.'))
      if (isNaN(target)) {
        this.inputTarget = ''
        return
      }
      if (target != this.target) {
        this.$emit('set-target', target)
      }
    },
    enterValue() {
      const value = parseFloat(this.inputValue.replace(',', '.'))
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
    }
  }
})
</script>
