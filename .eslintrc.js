module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
