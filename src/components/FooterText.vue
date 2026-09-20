<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

import { helperRunningOnProd, helperStatsDataRead } from "../helper"
import type { StatsDataType } from "../types"

const route = useRoute()

const statsData = ref<StatsDataType>({
  accesscounts: 0,
  accesscounts7: 0,
  firstaccess: "2000-01-01",
})

const origin = computed(() => {
  const path = route.path
  if (path === "/eta/" || path === "/eta/eta") return "eta"
  return ""
})

const showStats = computed(() => origin.value !== "")

onMounted(() => {
  void fetchAccessStats()
})

watch(route, () => {
  void fetchAccessStats()
})

async function fetchAccessStats() {
  if (!(helperRunningOnProd() && origin.value)) {
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
      {{ statsData.accesscounts7 }} etas in the last 7 days,
      {{ statsData.accesscounts }} in total since {{ statsData.firstaccess }}.
    </p>
  </div>
</template>
