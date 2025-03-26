#!/bin/sh

# ensure we are in the root dir
script_dir=$(cd $(dirname $0) && pwd)
cd $script_dir/..

npm run check && npm run build-only && rsync -rhv --delete --no-perms --ignore-times dist/ entorb@entorb.net:html/eta/
