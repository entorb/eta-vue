#!/bin/sh
# ensure we are in the root dir
cd $(dirname $0)/..

# exit upon error
set -e

# cleanup
rm -f .DS_Store
rm -f */.DS_Store

./scripts/run_checks.sh
pnpm run build
rsync -rhv --delete --no-perms --ignore-times dist/ entorb@entorb.net:html/eta/

echo DONE
