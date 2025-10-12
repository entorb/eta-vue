<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { helperRunningOnProd, helperStatsDataRead } from '../helper'
import type { StatsDataType } from '../types'

// Get the current route
const route = useRoute()

onMounted(() => {
  fetchAccessStats()
})

watch(route, () => {
  fetchAccessStats()
})

const statsData = ref<StatsDataType>({
  accesscounts: 0,
  accesscounts7: 0,
  firstaccess: '2000-01-01'
})

async function fetchAccessStats() {
  if (!helperRunningOnProd()) {
    return
  }
  const origin = tab2origin(route.path)
  if (origin != '') {
    try {
      const ret = await helperStatsDataRead(origin)
      if (ret != undefined) {
        statsData.value = ret
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

function tab2origin(tab: string): string {
  let origin = ''
  if (tab == '/eta/' || tab == '/eta/eta') {
    origin = 'eta'
  } else if (tab == '/eta/multitimer') {
    origin = 'eta-mt'
  }
  return origin
}
</script>

<template>
  <div class="text-center">
    <p
      v-if="tab2origin(route.path) == 'eta' || tab2origin(route.path) == 'eta-mt'"
      class="text-disabled"
    >
      {{ statsData.accesscounts7 }} {{ tab2origin(route.path) === 'eta' ? 'etas' : 'timers' }} in
      the last 7 days, {{ statsData.accesscounts }} in total since {{ statsData.firstaccess }}.
    </p>
    <p class="text-disabled">
      This app is free (as of free-beer), ad-free and OpenSource. If you like it, please share it.
      <a
        class="text-disabled"
        href="https://entorb.net/contact.php?origin=eta"
        target="_blank"
        >Feedback</a
      >
      is highly appreciated. Complete source code and project documentation are at
      <a
        class="text-disabled"
        href="https://github.com/entorb/eta-vue/"
        target="_blank"
        >GitHub.com/entorb/etc-vue/</a
      >.
    </p>
  </div>
</template>
