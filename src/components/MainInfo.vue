<script setup lang="ts">
function clearLocalStorage() {
  localStorage.removeItem("eta_vue_data")
  localStorage.removeItem("eta_vue_target")
}

const installSteps = [
  { platform: "Android, Windows", how: "Chrome or Edge -> Install" },
  { platform: "iOS", how: "Safari -> Share -> Add to Home Screen" },
  { platform: "MacOS", how: "Safari -> File -> Add to Dock" },
]
</script>

<template>
  <div>
    <p class="text-body-2 mb-4">
      Enter the current value (of items/to go) from time to time. The remaining time is derived via
      <a
        href="https://en.wikipedia.org/wiki/Linear_regression"
        target="_blank"
        rel="noopener noreferrer"
      >linear regression</a>
      or, to emphasize the latest data points,
      <a
        href="https://en.wikipedia.org/wiki/Weighted_least_squares"
        target="_blank"
        rel="noopener noreferrer"
      >weighted linear regression</a>
      (toggle with the weight button).
    </p>
    <p class="text-body-2">
      <strong>Count-down</strong> (target = 0): "standing in a queue"<br />
      <strong>Count-up</strong> (target > 0): "10 of 100 done"
    </p>

    <v-divider class="my-4" />

    <h2 class="text-subtitle-1 font-weight-medium mb-2">
      Install as app
    </h2>
    <v-list
      density="compact"
      class="bg-transparent py-0"
    >
      <v-list-item
        v-for="step in installSteps"
        :key="step.platform"
        class="px-0"
      >
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ step.platform }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-body-2">
          {{ step.how }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider class="my-4" />

    <h2 class="text-subtitle-1 font-weight-medium mb-2">
      Your data
    </h2>
    <p class="text-body-2 mb-3">
      Your data is stored only on your device. Only anonymous usage statistics are gathered on the
      server.
    </p>
    <v-btn
      type="button"
      size="small"
      variant="tonal"
      color="error"
      prepend-icon="$trash"
      @click="clearLocalStorage"
    >
      Delete my data
    </v-btn>

    <v-divider class="my-4" />

    <h2 class="text-subtitle-1 font-weight-medium mb-2">
      About
    </h2>
    <p class="text-body-2">
      This app is free (as of free-beer), ad-free and OpenSource. If you like it, please share it.
      <a
        href="https://entorb.net/contact.php?origin=eta"
        target="_blank"
        rel="noopener noreferrer"
      >Feedback</a>
      is highly appreciated. Complete source code and project documentation are at
      <a
        href="https://github.com/entorb/eta-vue/"
        target="_blank"
        rel="noopener noreferrer"
      >GitHub.com/entorb/eta-vue/</a>.
    </p>
  </div>
</template>
