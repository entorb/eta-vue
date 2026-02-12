<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

interface Props {
  target?: number
}

const props = withDefaults(defineProps<Props>(), {
  target: 0
})

const emit = defineEmits<{
  setTarget: [target: number]
}>()

const { target } = toRefs(props)
watch(target, () => {
  inputTarget.value = target.value.toString()
})

// Known issue: ref object reactivity loss - needed for proper initialization
// eslint-disable-next-line vue/no-ref-object-reactivity-loss
const inputTarget = ref(target.value.toString())

function enterTarget() {
  const targetNew = parseFloat(inputTarget.value.replace(',', '.'))
  if (isNaN(targetNew) || targetNew < 0) {
    inputTarget.value = ''
    return
  }
  if (targetNew !== props.target) {
    emit('setTarget', targetNew)
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
