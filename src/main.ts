/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import { registerPlugins } from '@/plugins'

const app = createApp(App).use(router)

registerPlugins(app)

app.mount('#app')
