<script setup lang="ts">
function clearLocalStorage() {
  localStorage.removeItem('eta_vue_data')
  localStorage.removeItem('eta_vue_target')
  localStorage.removeItem('eta_vue_mt_data')
  localStorage.removeItem('eta_vue_mt_recent')
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Remaining-Timer / ETA</h2>
        <p style="padding-bottom: 10px">
          Calculate remaining (waiting) time / estimated time of arrival (ETA).
        </p>
        <p>
          <strong>Count-down</strong> (target = 0)<br />
          use case: "standing in a queue", etc.
        </p>
        <p>
          <strong>Count-up</strong> (target > 0)<br />
          use case: "10 of 100 done", etc.
        </p>
        <p style="padding-top: 10px">
          <strong>Usage:</strong> Periodically input the current value (of items/to go).<br />
          <!-- <strong>Optional:</strong> use the <strong>+1</strong> button for quick input if the value
          has changed by 1. -->
        </p>
        <p style="padding-top: 10px">
          In all modes the average progress speed is derived using
          <a
            href="https://en.wikipedia.org/wiki/Weighted_least_squares"
            target="_blank"
            >weighted linear regression</a
          >
          to empathize the latest data points.
        </p>
        <p style="padding-top: 10px">
          The largest supported input value is the JavaScript limit of
          <a
            href="https://www.w3schools.com/jsref/jsref_max_value.asp"
            target="_blank"
            >1.79e+308</a
          >.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Multi-Timer</h2>
        <p>Create an arbitrary number of countdown timers.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>How to install as app</h2>
        <p style="padding-bottom: 10px">
          <a
            href="https://en.wikipedia.org/wiki/Progressive_web_app"
            target="_blank"
            >PWA</a
          >
          technology is used to enable app installation.
        </p>
        <p>
          <strong>Android</strong><br />
          Open
          <a
            href="https://entorb.net/eta/"
            target="_blank"
            >ETA</a
          >
          in Edge or Chrome -> Tap Install
        </p>
        <p>
          <strong>iOS (iPhone, iPad)</strong><br />
          Open
          <a
            href="https://entorb.net/eta/"
            target="_blank"
            >ETA</a
          >
          in Safari -> click share button at button of page -> choose "Add to Home Screen"
        </p>
        <p>
          <strong>MacOS</strong><br />
          Open
          <a
            href="https://entorb.net/eta/"
            target="_blank"
            >ETA</a
          >
          in Safari -> Menu -> File -> Add to Dock
        </p>
        <p>
          <strong>Windows</strong><br />
          Open
          <a
            href="https://entorb.net/eta/"
            target="_blank"
            >ETA</a
          >
          in Edge or Chrome -> Address bar, right side -> Install button
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Disclaimer</h2>
        <p>
          Your data is exclusively stored on your local device, ensuring the utmost privacy and
          security. Click
          <a
            href="javascript:void(0)"
            @click="clearLocalStorage"
            >here</a
          >
          to delete this data. Only anonymous usage statistics are gathered on the server.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Previous version</h2>
        <p>
          For the previous version of ETA, visit
          <a
            href="https://entorb.net/eta-v1/"
            target="_blank"
            >entorb.net/eta-v1/</a
          >.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
