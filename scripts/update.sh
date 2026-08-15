#!/bin/sh

# exit upon error
set -e

# ensure we are in the root dir
SCRIPT_DIR="$(dirname "$0")"
cd "$SCRIPT_DIR/.."

# 0. prek pre-commit
prek autoupdate

echo === Vue ===

rm -rf node_modules pnpm-lock.yaml
pnpm self-update
pnpm up --latest
pnpm exec biome migrate --write
# npm i baseline-browser-mapping@latest -D
# npx update-browserslist-db@latest

echo === check code ===
sh ./scripts/run_checks.sh

echo === Cypress ===
# start dev server in background, bypassing pnpm wrapper to remove warning upon killing process
# pnpm run dev
./node_modules/.bin/vite > /dev/null 2>&1 &
PID_VITE=$!

# wait for dev server to be ready (port 5173 is Vite's default)
echo "Waiting for dev server..."
while ! nc -z localhost 5173; do
  sleep 0.5
done
echo "Dev server ready (PID $PID_VITE)"

# run Cypress and capture its exit code immediately
pnpm run cy:run || EXIT_CODE=$?
EXIT_CODE=${EXIT_CODE:-0}


if [ -n "$(git status --porcelain)" ]; then
  echo === git push ===
  git add pnpm-lock.yaml
  git diff --staged --quiet -- pnpm-lock.yaml || git commit -m "Update Lock"

  git add package.json pnpm-workspace.yaml biome.json
  git commit -m "Update packages and pnpm audit findings"
  git push
fi

echo "update DONE, not yet deployed"
kill $PID_VITE
wait $PID_VITE 2>/dev/null || true
exit $EXIT_CODE
