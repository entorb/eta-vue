#!/bin/sh

# ensure we are in the root dir
cd "$(dirname "$0")/.." || exit 1

pnpm exec vitest --watch=false --silent --coverage
