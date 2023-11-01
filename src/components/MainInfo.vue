<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>How to install as app</h2>
        <p>
          <a href="https://en.wikipedia.org/wiki/Progressive_web_app" target="_blank"
            >Progressive Web App (PWA)</a
          >
          technology is used to enable installation as app.
        </p>
        <p>
          <strong>Android</strong><br />
          Open this site in Edge or Chrome -> Tap Install
        </p>
        <p>
          <strong>iOS (iPhone, iPad)</strong><br />
          Open this site in Safari -> click share button at button of page -> choose "Add to Home
          Screen"
        </p>
        <p>
          <strong>MacOS</strong><br />
          Open this site in Safari -> Menu -> File -> Add to Dock
        </p>
        <p>
          <strong>Windows</strong><br />
          Open this site in Edge or Chrome -> Address bar, right side -> Install button
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>ETA</h2>
        <p>
          Calculate the average progress speed and estimated time of arrival.<br />
          3 distinct working modes:
        </p>
        <p>
          <strong>Simple</strong> (no target)<br />
          use case: just calculates the speed of process
        </p>
        <p>
          <strong>Count-up</strong> (target > 0)<br />
          use case: "10 of 100 done"
        </p>
        <p>
          <strong>Count-down</strong> (target = 0)<br />
          use case: "standing in a queue" etc.
        </p>
        <p>
          In all modes the average progress speed is derived using
          <a href="https://en.wikipedia.org/wiki/Weighted_least_squares" target="_blank"
            >weighted linear regression</a
          >
          to empathize the latest data points.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Multi-Timer</h2>
        <p>Create an arbitrary number of countdown timers.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts"></script>
