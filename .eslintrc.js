module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'google',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  plugins: ['vitest'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/valid-attribute-name': 'error',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      files: ['**/*.spec.js'],
      extends: ['plugin:vitest/recommended'],
    },
  ],
}
