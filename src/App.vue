<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue"
import { useDisplay } from "vuetify"

import FooterText from "./components/FooterText.vue"

// lazy loaded, only needed once the dialog is opened
const MainInfo = defineAsyncComponent(() => import("./components/MainInfo.vue"))

const showInfo = ref(false)

const { smAndDown } = useDisplay()

// full title does not fit next to the info button on phones
const title = computed(() => (smAndDown.value ? "ETA" : "Estimated Time of Arrival (ETA)"))
</script>

<template>
  <v-app>
    <v-app-bar
      flat
      :density="smAndDown ? 'compact' : 'default'"
    >
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <template #append>
        <v-btn
          type="button"
          icon="$info"
          aria-label="Info"
          @click="showInfo = true"
        />
      </template>
    </v-app-bar>
    <v-dialog
      v-model="showInfo"
      max-width="800"
      scrollable
      :fullscreen="smAndDown"
    >
      <v-card title="Info">
        <v-divider />
        <v-card-text>
          <MainInfo />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="button"
            @click="showInfo = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-main>
      <router-view />
    </v-main>
    <v-footer class="d-flex justify-center">
      <FooterText />
    </v-footer>
  </v-app>
</template>
