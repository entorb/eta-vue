import { fileURLToPath, URL } from 'node:url'

import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // TM: important when deploying not into the webserver root dir
  // error message "was blocked due to MIME type (“text/html”) mismatch"
  // (X-Content-Type-Options: nosniff)
  base: '/eta/',
  build: {
    rollupOptions: {
      input: {
        eta: resolve(__dirname, 'index.html'),
        multitimer: resolve(__dirname, 'index2.html')
      }
    }
  },
  preview: { port: 4173 },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true
    }),
    // eslint-disable-next-line new-cap
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900'
          }
        ]
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ETA - Estimated Time of Arrival',
        short_name: 'ETA',
        description:
          'Calculate the average progress speed and estimated time of arrival. 3 modes: simple (no target), count-up (target > 0), count-down (target = 0). Weighted linear regression is applied.',
        icons: [
          {
            src: 'icons/144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],

  // define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    //   extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    // },
    // server: {
    //   port: 3000,
  }
})
