<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

const props = defineProps({
  target: { type: Number, default: 0 }
})

const emits = defineEmits(['set-target'])

const { target } = toRefs(props)
watch(target, () => {
  inputTarget.value = target.value.toString()
})

// TODO
// eslint-disable-next-line vue/no-ref-object-reactivity-loss
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

<template>
  <v-text-field
    id="input-target"
    v-model="inputTarget"
    label="Target"
    type="text"
    inputmode="decimal"
    prepend-icon="$target"
    variant="outlined"
    @blur="enterTarget"
    @keyup.enter="enterTarget"
  />
</template>
