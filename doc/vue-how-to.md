# Vue Documentation

## Vue.js - Framework

Project structure was created by

```sh
npm create vue@latest
```

<https://vuejs.org/guide/>

As example for handling of media (image and audio) assets, see [src/components/StatsTable.vue](https://github.com/entorb/eta-vue/blob/main//components/StatsTable.vue)

## Vuetify - Vue Component Framework

<https://vuetifyjs.com/en/components/all/#form-inputs-and-controls>

include only used icons in build and central handling of icons
<https://vuetifyjs.com/en/features/icon-fonts/#mdi-js-svg>

see config [src/plugins/vuetify.ts](https://github.com/entorb/eta-vue/blob/main/src/plugins/vuetify.ts)

## Material Design Icons (MDI)

OpenSource icon collection
<https://pictogrammers.com/library/mdi/>

Icon search
<https://vuetifyjs.com/en/features/icon-fonts/#mdi-icon-search>

use `mdi` as prefix in Vuetify (e.g. `trash-can` -> `mdi-trash-can`)

## Unplugin-Fonts (do not load fonts from Google server)

<https://github.com/cssninjaStudio/unplugin-fonts#google-fonts>
<https://fontsource.org/fonts/roboto>

```sh
npm install @fontsource/roboto
```

see [vite.config.ts](https://github.com/entorb/eta-vue/blob/main/vite.config.ts)

## Vitest - Testing Framework

<https://vitest.dev/guide/>

see config [vitest.config.ts](https://github.com/entorb/eta-vue/blob/main/vitest.config.ts)

see how-tos at

<https://blog.logrocket.com/guide-vitest-automated-testing-vue-components/>
<https://codingpr.com/test-your-vue-3-app-with-vitest-and-vue-test-utils/>

To exclude a function in v8 code coverage report

```js
/* c8 ignore next */
```

Fix for `TypeError: window.matchMedia is not a function`
see <https://lobotuerto.com/notes/vue-testing-cheat-sheet>
and files
[vitest.config.ts](https://github.com/entorb/eta-vue/blob/main/vitest.config.ts) and
[vitest.setup.ts](https://github.com/entorb/eta-vue/blob/main/vitest.setup.ts)

## Vite - Frontend Tooling (replaces vue-cli)

<https://vitejs.dev/guide/>

see config [vite.config.ts](https://github.com/entorb/eta-vue/blob/main/vite.config.ts)

Manual chunks per component:
Do not use `output: manualChunks:` in [vite.config.ts](https://github.com/entorb/eta-vue/blob/main/vite.config.ts), as this prevents lazy loading via `defineAsyncComponent`
Instead, just use `defineAsyncComponent` to define lazy loading AND define chunks.

### (DEPRECATED: Vue CLI)

<https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/>

### PWA - Progressive Web App

Install resulting Webpage as App

Currently only supported by Chrome/Chromium/Edge, not by Safari and Firefox

Great how-to:
<https://wildermuth.com/2023/02/09/vite-plugin-for-progressive-web-apps/>

1. add Vite PWA plugin

```sh
npm i vite-plugin-pwa -D
```

2. add pwa to [vite.config.ts](https://github.com/entorb/eta-vue/blob/main/vite.config.ts)
   `import { VitePWA } from "vite-plugin-pwa";`
   and data for the manifest file (e.g. the required logo(s))

3. place a logo in the public dir (e.g. `144.png`)

done.

Check in Chrome Devtools -> Application -> Manifest for errors.

Other how-tos

- <https://rubenr.dev/pwa-vite/>
- <https://dev.to/adefam/pwa-in-vue-vite-53a3>
- outdated: <https://blog.logrocket.com/building-pwa-vue/>

## Vue Router

<https://router.vuejs.org/>

see <https://stackblitz.com/edit/vue3-vite-router-typescript-starter>

Configured in [router.ts](https://github.com/entorb/eta-vue/blob/main/src/router.ts) and [App.vue](https://github.com/entorb/eta-vue/blob/main/src/App.vue)
see also [public/.htaccess](https://github.com/entorb/eta-vue/blob/main/public/.htaccess) for URL rewrite in case users directly access a routed page.

Lazy loading of routes
see <https://router.vuejs.org/guide/advanced/lazy-loading.html>

## TypeScript

<https://www.typescriptlang.org/docs/handbook/intro.html>

## Vue ECharts

- [ECharts Get Started](https://echarts.apache.org/handbook/en/get-started)
- [Vue ECharts](https://github.com/ecomfe/vue-echarts#readme)
- [Vue ECharts import code generator](https://vue-echarts.dev/#codegen)
- [Vue ECharts playground](https://stackblitz.com/edit/vue-echarts-vue-3?file=src%2FApp.vue)

## Not used yet

## Vue I18n - Internationalization

<https://vue-i18n.intlify.dev/guide/>
how to at <https://phrase.com/blog/posts/ultimate-guide-to-vue-localization-with-vue-i18n/>
and <https://codingpr.com/create-international-website-with-vue-3/>

### Pinia - store for Vue.js

<https://pinia.vuejs.org/>
