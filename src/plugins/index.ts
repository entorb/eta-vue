/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import type { App } from 'vue'

import vuetify from './vuetify'

// Types

export function registerPlugins(app: App) {
  app.use(vuetify)
}
