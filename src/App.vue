<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-tabs v-model="tab" align-tabs="start">
          <v-tab to="/eta/eta">ETA</v-tab>
          <v-tab to="/eta/multitimer">Multi-Timer</v-tab>
        </v-tabs>
        <v-row>
          <v-col cols="12">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer>
      <FooterText />
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import FooterText from './components/FooterText.vue'

const tab = ref<string | null>(null)
// Get the current route
const route = useRoute()

tab.value = route.path
</script>
