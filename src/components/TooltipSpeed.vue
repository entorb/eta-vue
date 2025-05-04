<template>
  {{ speedInUnit }}
  <v-tooltip activator="parent">
    {{ ipsInUnit('sec') }} / sec<br />
    {{ ipsInUnit('min') }} / min<br />
    {{ minPerItem(props.ips) }} min/item<br />
    {{ ipsInUnit('hour') }} / hour<br />
    {{ ipsInUnit('day') }} / day
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { helperValueToString } from '../helper'
import type { UnitType } from '../types'

const props = defineProps({
  // items per second
  ips: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'min'
  }
})

const speedInUnit = ref('')

const ipsInUnit = (unit: UnitType): string => {
  const factor = {
    sec: 1,
    min: 60,
    hour: 3600,
    day: 86400
  }[unit]
  return helperValueToString(Math.abs(props.ips * factor))
}

function minPerItem(ips: number): string {
  return helperValueToString(Math.abs(1 / (60 * ips)))
}

watch(
  () => [props.unit, props.ips],
  () => {
    speedInUnit.value = ipsInUnit(props.unit as UnitType)
  },
  { immediate: true }
)
</script>
