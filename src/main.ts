/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// locally hosting roboto font, instead of pointing to google
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/700.css"
import { createApp } from "vue"

import { registerPlugins } from "@/plugins"

import App from "./App.vue"
import router from "./router"

const app = createApp(App).use(router)

registerPlugins(app)

app.mount("#app")
