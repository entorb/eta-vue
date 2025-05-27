# Issues/problems/obstacles

## Open

## Solved

### Vue / Vitest: [Vue warn]: Failed to resolve component: v-btn

fix: at top of test-case file add `import { describe, it, expect } from 'vitest'`

see <https://codingpr.com/test-your-vue-3-app-with-vitest-and-vue-test-utils/>

### Vue / Vitest / Typescript prod. build fails on .spec.ts file

`error TS2339: Property does not exist on type`

fix: in [tsconfig.app.json](https://github.com/entorb/eta-vue/blob/main/tsconfig.app.json) modify the import-all
`"include": ["env.d.ts", "src/**/*", "src/**/*.vue"],` to `"include": ["env.d.ts", "src/**/*.vue"],`
and keep
`"exclude": ["src/**/__tests__/*", "**/*.spec.ts"],`

### ESlint: Cannot find namespace 'NodeJS'.ts(2503)

`eslint Cannot find namespace 'NodeJS'.ts(2503)`

fix:
in [tsconfig.app.json](https://github.com/entorb/eta-vue/blob/main/tsconfig.app.json)
add to `compilerOptions` the setting `"types": ["node"]`
