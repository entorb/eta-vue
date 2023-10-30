<template>
  {{ speedInUnit }}
  <v-tooltip activator="parent">
    {{ ipsInUnit('sec') }}<br />
    {{ ipsInUnit('min') }}<br />
    {{ ipsInUnit('hour') }}<br />
    {{ ipsInUnit('day') }}
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
  return helperValueToString(props.ips * factor) + '/' + unit.charAt(0)
}

watch(
  () => props.unit,
  () => {
    speedInUnit.value = ipsInUnit(props.unit as UnitType)
  },
  { immediate: true }
)
</script>
