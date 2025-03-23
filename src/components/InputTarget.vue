<template>
  <v-text-field
    id="input-target"
    v-model="inputTarget"
    label="Target"
    type="text"
    inputmode="decimal"
    variant="outlined"
    @keyup.enter="enterTarget"
    @blur="enterTarget"
  />
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

const emits = defineEmits(['set-target'])

const props = defineProps({
  target: { type: Number, default: 0 }
})

const { target } = toRefs(props)
watch(target, () => {
  inputTarget.value = target.value.toString()
})

const inputTarget = ref(target.value.toString())

function enterTarget() {
  const targetNew = parseFloat(inputTarget.value.replace(',', '.'))
  if (isNaN(targetNew) || targetNew < 0) {
    inputTarget.value = ''
    return
  }
  if (targetNew !== props.target) {
    emits('set-target', targetNew)
  }
}
</script>
