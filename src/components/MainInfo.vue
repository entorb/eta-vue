<script setup lang="ts">
function clearLocalStorage() {
  localStorage.removeItem("eta_vue_data")
  localStorage.removeItem("eta_vue_target")
}
</script>

<template>
  <div>
    <h2>Remaining-Timer / ETA</h2>
    <p>
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
    <p>
      <strong>Count-down</strong> (target = 0): "standing in a queue"<br />
      <strong>Count-up</strong> (target > 0): "10 of 100 done"
    </p>

    <h2>Install as app</h2>
    <p>
      Android, Windows: Chrome or Edge -> Install<br />
      iOS: Safari -> Share -> Add to Home Screen<br />
      MacOS: Safari -> File -> Add to Dock
    </p>

    <h2>Your data</h2>
    <p>
      Your data is stored only on your device. Only anonymous usage statistics are gathered on the
      server.
    </p>
    <v-btn
      type="button"
      size="small"
      @click="clearLocalStorage"
    >
      Delete my data
    </v-btn>
  </div>
</template>
