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
  updateInputFieldFromTarget()
})

const inputTarget = ref('')

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

function updateInputFieldFromTarget() {
  if (props.target !== undefined) {
    inputTarget.value = props.target.toString()
  } else {
    inputTarget.value = ''
  }
}
</script>
