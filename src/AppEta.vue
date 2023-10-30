<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row>
          <v-col cols="12">
            <MainEta />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <FooterText />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import MainEta from './components/MainEta.vue'
import FooterText from './components/FooterText.vue'
</script>
