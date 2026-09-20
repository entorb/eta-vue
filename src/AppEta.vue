<script setup lang="ts">
import FooterText from "./components/FooterText.vue"
import MainEta from "./components/MainEta.vue"
</script>

<template>
  <v-app>
    <v-main>
      <MainEta />
    </v-main>
    <v-footer class="d-flex justify-center">
      <FooterText />
    </v-footer>
  </v-app>
</template>
