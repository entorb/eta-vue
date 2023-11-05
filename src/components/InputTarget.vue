<template>
  <!-- item-value="value" -->
  <!-- append-icon="icon" -->
  <!-- :item-props="itemProps" -->
  <!-- append-icon="$save" @click:append="enterTarget" -->
  <v-text-field
    id="input-target"
    v-model="inputTarget"
    label="Target items"
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
  target: { type: Number, default: undefined as number | undefined }
})

const { target } = toRefs(props)
watch(target, () => {
  inputTarget.value = target.value == undefined ? '' : target.value.toString()
})

const inputTarget = ref(target.value == undefined ? '' : target.value.toString())

function enterTarget() {
  const targetNew = parseFloat(inputTarget.value.replace(',', '.'))
  if (isNaN(targetNew)) {
    inputTarget.value = ''
    return
  }
  if (targetNew != props.target) {
    emits('set-target', targetNew)
  }
}
</script>
