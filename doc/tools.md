# Tools used

## Vite - Frontend Tooling

- Build the app
- Add PWA features

see [doc/vue-how-to.md](https://github.com/entorb/eta-vue/blob/main/doc/vue-how-to.md) for details

## CSpell - Code spell checker

- `npm run spell`
- [cspell.json](https://github.com/entorb/eta-vue/blob/main/cspell.json) configuration (note `ignorePaths`)
- [cspell-words.txt](https://github.com/entorb/eta-vue/blob/main/cspell-words.txt) custom project dictionary
- [package.json](https://github.com/entorb/eta-vue/blob/main/package.json) -> `scripts -> spell` shows the used runtime parameters (note `--cache`)

## Prettier - Code formatter

- `npm run format`
- [.prettierrc.json](https://github.com/entorb/eta-vue/blob/main/.prettierrc.json) configuration
- [package.json](https://github.com/entorb/eta-vue/blob/main/package.json) -> `scripts -> format` shows the runtime parameters. (note `--cache` and prettier now respects .gitignore files by default)

## ESLint - Code linter/style checker

- `npm run lint`
- [.eslintrc.js](https://github.com/entorb/eta-vue/blob/main/.eslintrc.js) configuration
- [package.json](https://github.com/entorb/eta-vue/blob/main/package.json) -> `scripts -> link` shows the runtime parameters. (note `--cache` and `--ignore-path .gitignore`)

## Vitest - Unit test Framework

- `npm run test`
- [vitest.config.ts](https://github.com/entorb/eta-vue/blob/main/vitest.config.ts) configuration (note `exclude:`)
- [package.json](https://github.com/entorb/eta-vue/blob/main/package.json) -> `scripts -> test` shows the runtime parameters. (note `--coverage` for v8 code-coverage report)

## pre-commit hook via Husky and Lint-Staged

via Lint-Staged and Husky, the tools above are configured as git pre-commit hook

- `npx lint-staged` manual run
- [.husky/pre-commit](https://github.com/entorb/eta-vue/blob/main/.husky/pre-commit) runs `npx lint-staged`
- [.lintstagedrc](https://github.com/entorb/eta-vue/blob/main/.husky/.lintstagedrc) configuration of scripts to run per staged filetype

See nice how to at
<https://www.coffeeclass.io/articles/commit-better-code-with-husky-prettier-eslint-lint-staged>

Preparation: setup Husky pre-commit hook via

```sh
npm run prepare
```

## Cypress - Frontend end to end (E2E) testing

see <https://www.cypress.io/>

```sh
npm install cypress --save-dev
```

To run against Vite preview: run in host mode via package.conf

```json
"preview": "vite preview --host",
```

than

```sh
npm run build
npm run preview
```

My test cases: [cypress/e2e/](https://github.com/entorb/eta-vue/blob/main/cypress/e2e)

## Not used yet

### Sentry - Exception tracking

### Matomo - Gather user stats
