import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reporter: 'lcov'
      },
      environment: 'jsdom',
      server: {
        deps: {
          inline: ['vuetify', 'echarts', 'vue-echarts']
        }
      },
      setupFiles: ['./vitest.setup.ts'],
      exclude: [...configDefaults.exclude, 'vorlagen/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
