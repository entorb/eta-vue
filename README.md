# ETA (Estimated Time of Arrival)

**ETA:** Calculate remaining (waiting) time / estimated time of arrival.

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

## Documentation

- [docs/tools.md](docs/tools.md) details how to set up the tools
- [docs/vue-how-to.md](docs/vue-how-to.md) outlines the Vue.js tech-stack and provides links to documentation and how-tos
- [docs/issus.md](docs/issues.md) lists problems and obstacles, faced during development

## Build and Run this Project Locally

Install npm packages: `pnpm install`

Run live-updated dev-instance: `pnpm run dev`

### Cypress E2E tests

```sh
pnpm run build
pnpm run preview
pnpm run cy:open
```

Now in Cypress navigate to "E2E Testing" -> "Firefox" -> "Start E2E Testing in Firefox"

## Credits

- notification sound `481151__matrixxx__cow-bells-01.mp3` is from [freesound.org](https://freesound.org/people/MATRIXXX_/sounds/481151/)
- favicon is `timer-outline` from [MDI](https://pictogrammers.com/library/mdi/icon/timer-outline/) and converted via [favicon.io](https://favicon.io/favicon-converter/)
