/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'

import App from './App.vue'
import router from './router'

const app = createApp(App).use(router)

registerPlugins(app)

app.mount('#app')
