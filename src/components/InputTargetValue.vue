<template>
  <v-container class="align-start">
    <v-row>
      <v-col>
        <!-- not: v-model.number, as it removes "," from input-->
        <!-- append-inner-icon="$save" -->
        <!-- @click:append-inner="enterTarget" -->
        <v-text-field
          v-model="inputValue"
          label="Current items"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  target: { type: Number, default: undefined as number | undefined }
})

const emits = defineEmits(['set-target', 'add-row'])

const inputTarget = ref('')
const inputValue = ref('')

const targetRef = ref(props.target)

watch(targetRef, () => {
  updateInputFieldFromTarget()
})

function enterTarget() {
  let target = undefined
  if (inputTarget.value == '') {
    target = undefined
  } else {
    target = parseFloat(inputTarget.value.replace(',', '.'))
    if (isNaN(target)) {
      inputTarget.value = ''
      return
    }
  }
  if (target != props.target) {
    emits('set-target', target)
  }
}

function enterValue() {
  const value = parseFloat(inputValue.value.replace(',', '.'))
  if (isNaN(value)) {
    return
  }
  const date = new Date()
  const newRow = { date: date, value: value }
  // Emit an event to add the row to the data
  emits('add-row', newRow)
  inputValue.value = ''
}

function updateInputFieldFromTarget() {
  if (props.target !== undefined) {
    inputTarget.value = props.target.toString()
  } else {
    inputTarget.value = ''
  }
}
</script>
