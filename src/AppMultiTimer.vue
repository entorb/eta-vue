<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col><h1>MultiTimer</h1></v-col>
        </v-row>
        <v-row>
          <v-col>
            <MultiTimer />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center mt-4" cols="12">
            This app is OpenSource. Its source code and project documentation can be found at
            <a href="https://github.com/entorb/eta-vue/" target="_blank"
              >GitHub.com/entorb/etc-vue/</a
            >. The previous version can be found at <a href="v1/">v1/</a>. Feel free to
            <a href="https://entorb.net/contact.php?origin=eta" target="_blank">contact</a> me.
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import MultiTimer from './components/MultiTimer.vue'
</script>
