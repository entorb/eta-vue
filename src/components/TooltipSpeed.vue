<template>
  {{ ips.toPrecision(3) }}
  <v-tooltip activator="parent">
    {{ ips.toPrecision(3) }}/sec<br />
    {{ (ips * 60).toPrecision(3) }}/min<br />
    {{ (ips * 3600).toPrecision(3) }}/hour<br />
    {{ (ips * 3600 * 24).toPrecision(3) }}/day
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TooltipSpeed',
  props: {
    ips: {
      // items per second
      type: Number,
      required: true
    }
  }
})
</script>
