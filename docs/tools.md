# Tools used

## Vite - Frontend Tooling

- Build the app
- Add PWA features

see [docs/vue-how-to.md](https://github.com/entorb/eta-vue/blob/main/docs/vue-how-to.md) for details

## CSpell - Code spell checker

- to install cspell globally: `npm install -g cspell@latest`
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

## Playwright - Frontend end to end (E2E) testing

see <https://playwright.dev/>

```sh
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Dev server is started automatically via `webServer` in [playwright.config.ts](https://github.com/entorb/eta-vue/blob/main/playwright.config.ts)

```sh
pnpm run e2e
pnpm run e2e:ui
```

My test cases: [e2e/](https://github.com/entorb/eta-vue/blob/main/e2e)

## Optionally

### pre-commit hook via Husky and Lint-Staged

See nice how to at <https://www.coffeeclass.io/articles/commit-better-code-with-husky-prettier-eslint-lint-staged>

```sh
npm install --save-dev husky lint-staged
```

add `.husky\pre-commit`:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

setup Husky pre-commit hook via

```sh
npx husky
```

**Attention**: this seems not to work on Windows
delete the generated `.husky` dir to fix problems of the pre-commit hook

### Matomo - Gather user stats

I use a self-hosted instance of [Matomo](https://matomo.org/) to count the users of this tool.

## Not used yet

### Sentry - Exception tracking
