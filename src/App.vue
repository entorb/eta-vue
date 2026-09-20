<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue"

import FooterText from "./components/FooterText.vue"

// lazy loaded, only needed once the dialog is opened
const MainInfo = defineAsyncComponent(() => import("./components/MainInfo.vue"))

const showInfo = ref(false)
</script>

<template>
  <v-app>
    <v-app-bar flat>
      <v-app-bar-title>Remaining (ETA)</v-app-bar-title>
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
    >
      <v-card>
        <v-card-text>
          <MainInfo />
        </v-card-text>
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
      <v-container
        fluid
        fill-height
      >
        <v-row>
          <v-col cols="12">
            <router-view />
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
