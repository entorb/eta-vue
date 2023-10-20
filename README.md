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

- Prettier code formatter
- ESLint code linter
- Lint-Staged
- Husky
- CSpell code spell checker

These tools are configured as git pre-commit hook in `.lintstagedrc`

See nice how to at <https://www.coffeeclass.io/articles/commit-better-code-with-husky-prettier-eslint-lint-staged>

Preparation: setup Husky pre-commit hook via

```sh
npm run prepare
```

run manually:

```sh
npx lint-staged
```

## Unit tests

see nice how to at
<https://blog.logrocket.com/guide-vitest-automated-testing-vue-components/>

## Manual code style checks

```sh
npm run format
npm run lint
npm run spell
```
