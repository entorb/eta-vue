import { fileURLToPath } from 'node:url'

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reporter: 'lcov'
      },
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/'
        }
      },
      setupFiles: ['./vitest.setup.ts'],
      server: {
        deps: {
          inline: ['vuetify', 'echarts', 'vue-echarts']
        }
      },
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
