<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import { helperRunningOnProd, helperStatsDataRead } from '../helper'
import type { StatsDataType } from '../types'

const route = useRoute()

const statsData = ref<StatsDataType>({
  accesscounts: 0,
  accesscounts7: 0,
  firstaccess: '2000-01-01'
})

const origin = computed(() => {
  const path = route.path
  if (path === '/eta/' || path === '/eta/eta') return 'eta'
  if (path === '/eta/multitimer') return 'eta-mt'
  return ''
})

const showStats = computed(() => origin.value !== '')
const statsLabel = computed(() => (origin.value === 'eta' ? 'etas' : 'timers'))

onMounted(() => {
  fetchAccessStats()
})

watch(route, () => {
  fetchAccessStats()
})

async function fetchAccessStats() {
  if (!helperRunningOnProd() || !origin.value) {
    return
  }

  const ret = await helperStatsDataRead(origin.value)
  if (ret) {
    statsData.value = ret
  }
}
</script>

<template>
  <div class="text-center">
    <p
      v-if="showStats"
      class="text-disabled"
    >
      {{ statsData.accesscounts7 }} {{ statsLabel }} in the last 7 days,
      {{ statsData.accesscounts }} in total since {{ statsData.firstaccess }}.
    </p>
    <p class="text-disabled">
      This app is free (as of free-beer), ad-free and OpenSource. If you like it, please share it.
      <a
        class="text-disabled"
        href="https://entorb.net/contact.php?origin=eta"
        target="_blank"
        rel="noopener noreferrer"
        >Feedback</a
      >
      is highly appreciated. Complete source code and project documentation are at
      <a
        class="text-disabled"
        href="https://github.com/entorb/eta-vue/"
        target="_blank"
        rel="noopener noreferrer"
        >GitHub.com/entorb/etc-vue/</a
      >.
    </p>
  </div>
</template>
