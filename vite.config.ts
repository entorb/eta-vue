import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // TM: important when deploying not into the webserver root dir
  // error message "was blocked due to MIME type (“text/html”) mismatch"
  // (X-Content-Type-Options: nosniff)
  base: '/eta-vue/',
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
