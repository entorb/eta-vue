import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import Vue from '@vitejs/plugin-vue'
// locally hosting roboto font, instead of pointing to google
import Unfonts from 'unplugin-fonts/vite'
// import ViteFonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://vite.dev/config/
export default defineConfig({
  // TM: important when deploying not into the webserver root dir
  // error message "was blocked due to MIME type (“text/html”) mismatch"
  // (X-Content-Type-Options: nosniff)
  base: '/eta/',
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
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
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vuetify', 'echarts', 'vue-echarts']
  },
  plugins: [
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    Vuetify({
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
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  preview: { port: 4173, strictPort: true },
  server: { port: 5173, strictPort: true }
})
