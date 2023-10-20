/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'

// Types
import type { App } from 'vue'

// eslint-disable-next-line require-jsdoc
export function registerPlugins(app: App) {
  app.use(vuetify)
}
