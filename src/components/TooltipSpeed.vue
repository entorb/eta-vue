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
import { helperValueToString } from './helper'

const props = defineProps({
  ips: {
    // items per second
    type: Number,
    required: true
  },
  unit: {
    // sec, min, hour, day
    type: String,
    required: true
  }
})

const speedInUnit = ref('')

const ipsInUnit = (unit: string): string => {
  const factor = {
    sec: 1,
    min: 60,
    hour: 3600,
    day: 86400
  }[unit] as Record<string, number>
  return helperValueToString(props.ips * factor) + '/' + unit.charAt(0)
}

watch(
  () => props.unit,
  () => {
    speedInUnit.value = ipsInUnit(props.unit)
  },
  { immediate: true }
)
</script>
