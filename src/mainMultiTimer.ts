/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import App from './AppMultiTimer.vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
