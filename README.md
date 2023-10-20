# ETA in Vue.js using TypeScript and Vuetify

## Build

```sh
npm run dev
npm run build
```

## Vue Documentation

### Vue.js

<https://vuejs.org/examples/#hello-world>

### Vuetify

<https://vuetifyjs.com/en/components/all/#form-inputs-and-controls>

### Material icons

<https://pictogrammers.com/library/mdi/>
use `mdi` as prefix in Vuetify (e.g. `trash-can` -> `mdi-trash-can`)

## Tools used for this repo

These toos are configured as git pre-commit hook, see `.lintstagedrc`

- Prettier code formatter
- ESLint code linter
- Lint-Staged
- Husky
- CSpell code spell checker

See nice how to at <https://www.coffeeclass.io/articles/commit-better-code-with-husky-prettier-eslint-lint-staged>

# Unit tests

see nice how to at
<https://blog.logrocket.com/guide-vitest-automated-testing-vue-components/>

## Manual code style checks

```sh
npm run format
npm run lint
npm run cspell
```
