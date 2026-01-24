# ETA (Estimated Time of Arrival) and Multi-Timer

**ETA:** Calculate remaining (waiting) time / estimated time of arrival.

**Multi-Timer:** Set and manage multiple countdown timers.

Hosted at [entorb.net/eta/](https://entorb.net/eta/). [Feedback](https://entorb.net/contact.php?origin=eta) is highly appreciated.

This project is a complete rewrite of [github.com/entorb/eta](https://github.com/entorb/eta/) using state of the art tech-stack. It is my first project in [Vue.js](https://vuejs.org) and several tools have been explored, see below.

## ETA Use Cases

- Standing in a queue / waiting room / ...
- Estimate the time for a process/work to finish
- Homework sessions
- Lawn mowing / tractor driving / ...
- Book reading finish time
- Idle-Games

[Weighted linear regression](https://en.wikipedia.org/wiki/Weighted_least_squares) is applied to calculate the speed with an emphasis on the latest data points

## Multi-Timer Use Cases

- Boiling eggs and cooking tea in parallel
- Idle-Games

## Documentation

- [docs/ideas.md](https://github.com/entorb/eta-vue/blob/main/docs/ideas.md) shows open and completed feature ideas
- [docs/tools.md](https://github.com/entorb/eta-vue/blob/main/docs/tools.md) details how to set up the tools
- [docs/vue-how-to.md](https://github.com/entorb/eta-vue/blob/main/docs/vue-how-to.md) outlines the Vue.js tech-stack and provides links to documentation and how-tos
- [docs/issus.md](https://github.com/entorb/eta-vue/blob/main/docs/issues.md) lists problems and obstacles, faced during development

## Build and Run this Project Locally

Install npm packages: `pnpm install`

Run live-updated dev-instance: `pnpm run dev`

Build and run: `pnpm run run`

Live preview of changes: `pnpm run dev` (via `vite --host`)

## Check code after changes

### Format and unit tests

```sh
pnpm run check
# this runs: format lint spell test-once

# to run unit test only, generating coverage report in coverage\lcov-report\index.html
pnpm run test-once

# or run this to permanently retest upon file changes
pnpm run test
```

### Cypress E2E tests

```sh
pnpm run build
pnpm run preview
pnpm run cy:open
```

Now in Cypress navigate to "E2E Testing" -> "Firefox" -> "Start E2E Testing in Firefox"

## Update

```sh
# update single package
pnpm up vite
# update all dependencies
pnpm up
```

## Support tools used for this project

- [Prettier](https://prettier.io) code formatter
- [ESLint](https://eslint.org) code linter
- [CSpell](https://cspell.org) code spell checker
- [Vitest](https://vitest.dev) unit tests
- [Cypress](https://www.cypress.io) E2E tests
- [Matomo](https://matomo.org) visitor stats (locally hosted instance)
- [SonarQube](https://sonarcloud.io/project/overview?id=entorb_eta-vue)

see [docs/tools.md](https://github.com/entorb/eta-vue/blob/main/docs/tools.md)

## known issues

eslint throws

```sh
[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of eslint.config.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/torben/GitHub/eta-vue/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
```

but setting `"type": "module"` in `package.json` prevents Cypress to start.

## Credits

- notification sound `481151__matrixxx__cow-bells-01.mp3` is from [freesound.org](https://freesound.org/people/MATRIXXX_/sounds/481151/)
- favicon is `timer-outline` from [MDI](https://pictogrammers.com/library/mdi/icon/timer-outline/) and converted via [favicon.io](https://favicon.io/favicon-converter/)
