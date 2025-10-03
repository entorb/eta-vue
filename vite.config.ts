import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// locally hosting roboto font, instead of pointing to google
import Unfonts from 'unplugin-fonts/vite'
// import ViteFonts from 'unplugin-fonts/vite'

import { VitePWA } from 'vite-plugin-pwa'

import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // TM: important when deploying not into the webserver root dir
  // error message "was blocked due to MIME type (“text/html”) mismatch"
  // (X-Content-Type-Options: nosniff)
  base: '/eta/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        eta: resolve(__dirname, 'index1.html'),
        multitimer: resolve(__dirname, 'index2.html')
      }
      // !!! this prevents lazy loading via defineAsyncComponent !!!
      // output: {
      //   manualChunks: {
      //     'eta-chart': ['src/components/EtaChart.vue'],
      //     multitimer: ['src/components/MainMultiTimer.vue'],
      //     info: ['src/components/MainInfo.vue'],
      //     eta: ['src/components/MainEta.vue']
      //   }
      // }
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
    Unfonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [400, 700],
            styles: ['normal'] // 'italic'
          }
        ]
      }
    }),
    // ViteFonts({
    //   google: {
    //     families: [
    //       {
    //         name: 'Roboto',
    //         styles: 'wght@100;300;400;500;700;900'
    //       }
    //     ]
    //   }
    // }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ETA and Multi-Timer',
        short_name: 'ETA',
        description:
          'ETA: Calculate remaining (waiting) time / estimated time of arrival. Modes: count-down (target = 0), count-up (target > 0). Multi-Timer: Set and manage multiple countdown timers.',
        icons: [
          {
            src: 'icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable'
          },
          { src: 'icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ],
        theme_color: '#ffffff'
      }
    })
  ],

  // define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
    //   extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
})
