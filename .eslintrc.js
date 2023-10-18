module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'google',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier', // as last one
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    quotes: ['warn', 'double'],
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
