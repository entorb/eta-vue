<template>
  {{ speedInUnit(ips) }}
  <v-tooltip activator="parent">
    {{ ipsInSec(ips) }}<br />
    {{ ipsInMin(ips) }}<br />
    {{ ipsInHour(ips) }}<br />
    {{ ipsInDay(ips) }}
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { helperValueToString } from './helper'

export default defineComponent({
  name: 'TooltipSpeed',
  props: {
    ips: {
      // items per second
      type: Number,
      required: true
    },
    unit: {
      //sec, min, hour, day
      type: String,
      required: true
    }
  },
  methods: {
    speedInUnit(ips: number): String {
      if (this.unit == 'sec') {
        return this.ipsInSec(ips)
      } else if (this.unit == 'min') {
        return this.ipsInMin(ips)
      } else if (this.unit == 'hour') {
        return this.ipsInHour(ips)
      } else {
        return this.ipsInDay(ips)
      }
    },
    ipsInSec(ips: number): String {
      return helperValueToString(ips) + '/sec'
    },
    ipsInMin(ips: number): String {
      return helperValueToString(ips * 60) + '/min'
    },
    ipsInHour(ips: number): String {
      return helperValueToString(ips * 3600) + '/h'
    },
    ipsInDay(ips: number): String {
      return helperValueToString(ips * 86400) + '/day'
    }
  }
})
</script>
