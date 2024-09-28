/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

export default [
  {
    root: true,
    extends: [
      'eslint:recommended',
      'google',
      'plugin:vue/vue3-recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
      ecmaVersion: 'latest'
    },
    ignorePatterns: ['vite.config.ts', '.gitignore'],
    files: ['.vue', '.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.cts', '.mts'],
    rules: {
      'require-jsdoc': 'off',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['function'] }
      ]
    }
  }
]
