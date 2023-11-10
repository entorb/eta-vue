# Ideas

## Features

### Feature: ETA

- [x] Calculate remaining (waiting) time / estimated time of arrival
- [x] Mode: simple: no target / use case: just calculate the speed of process
- [x] Mode: count-up (target >0) / use case: X of Y done
- [x] Mode: count-down (target =0) / use case: "standing in a queue"
- [x] Using [weighted linear regression](https://en.wikipedia.org/wiki/Weighted_least_squares) to empathize the latest data points
- [x] Stats of speed and eta
- [x] Chart of items and speed over time

### Feature: Multi-Timer

- [x] Add Multi-Timer besides ETA
- [x] Create an arbitrary number of countdown timers
- [x] Store recent timers as cards for 1-click recreation

### Feature idea: Lap-Timer

- [ ] Add Lap-Timer Feature
- [ ] 1. setup, 2. start, 3. lap button per row, 4. display lap times, 5. display stats

### Feature idea: Pomodoro Timer

No use to re-invent the wheel, use [Pomofocus](https://pomofocus.io) instead

## UI

- [x] Use local storage to persist data
- [x] Favicon
- [x] Provide PWA and notify user about it
- [x] How-to install PWA version for different browsers/devices
- [x] PWA icon
- [x] Info page
- [x] UX feedback by CT
- [x] Footer in smaller font size or grey color
- [ ] Date format based on browser locale setting
- [ ] Multi-Language I18n
- [ ] isMobile: monitor for changes

### UI ETA

- [x] Notification sound when eta is reached
- [x] Tooltip of speed in various units
- [x] Select unit of speed
- [x] ETA intro text
- [x] ETA mode=down as default
- [x] Chart markLine: show avg speed calculated by `StatsTable.vue`
- [x] entering of percents should would an % sign shall be ignored
- [ ] Support for larger numbers than the JavaScript limit of 1.7e+308 via [Big.js](https://github.com/MikeMcl/big.js)
- [ ] Chart font size

### UI Multi-Timer

- [x] Delete one and all timer buttons
- [x] Play sound upon timer finished
- [ ] Reset timer button

## Tooling

- [x] Prettier
- [x] ESLint
- [x] CSpell
- [x] Pre-commit hook via Husky and Lint-Staged
- [x] Unit-tests via Vitest
- [x] Reduced build size by including only used icons
- [x] End to end (E2E) tests using Cypress

## Data handling

- [x] Central definition of data types in `types.ts`
- [x] Simple mode: Target = undefined vs. -1 ? undefined is correct, -1 would be easier to code
- [x] Store calculated speeds in `data` (not calc in `DataTable.vue` )
- [x] Update of target should trigger update of stats

## Refactoring

- [x] Use TypeScript instead of JavaScript
- [x] Use modern Single-File Components (SFCs) via `<script setup lang="ts">` instead of `<script lang="ts">`
- [x] isMobile check to helper.ts
- [ ] FooterText: replace router import by props

### Refactoring ETA

- [x] Split components InputItemsAndTarget and ActionsBlock into smaller ones
- [ ] Fix broken unit tests

### Refactoring Multi-Timer

- [x] End2End tests
- [ ] Split into smaller component files

## Deployment

- [x] Only include used icons to reduce file size
- [x] Fonts not fetched from Google but bundled
- [x] Static filename for audio file via `public` dir
- [x] Replace old app and deploy to [entorb.net/eta/](https://entorb.net/eta/). Move old app to [/v1](https://entorb.net/eta/v1/)
- [x] Generate a PWA version
- [x] Deploy ETA and Multi-Timer in one app
- [x] Do not load fonts from Google
- [x] Deploy MT as index2.html
- [x] Deploy MT as merged app together with ETA via Vue Router and navigation
- [x] Lazy loading of EtaChart component
- [x] Lazy loading of tabs/routes
- [ ] PWA wants screenshots of "form_factor" set to "wide" and "form_factor" other than "wide"

## Usage Stats and Exception Tracking

- [x] Local [Matomo](https://matomo.org) instance for visitor stats
- [x] Local database for usage stats: ETA & MT per 7 days and total
- [ ] [Sentry](https://sentry.io) for exception tracking

## Privacy

- [x] No access to 3rd party services
- [x] Data only stored on visitor's device
- [x] Delete all data button on info page
