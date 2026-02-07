<script setup lang="ts">
import FooterText from './components/FooterText.vue'
import MainMultiTimer from './components/MainMultiTimer.vue'
</script>

<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-row>
          <v-col cols="12">
            <MainMultiTimer />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-container>
      <v-footer>
        <FooterText />
      </v-footer>
    </v-container>
  </v-app>
</template>
