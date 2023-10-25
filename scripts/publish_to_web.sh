#!/bin/sh

# ensure we are in the root dir
script_dir=$(cd $(dirname $0) && pwd)
cd $script_dir/..

# npm run format && npm run lint && npm run test-once &&
#     npm run build && rsync -rvhu --delete --no-perms dist/* entorb@entorb.net:html/eta-vue/

npm run build && rsync -rhv --delete --exclude=v1 --no-perms --ignore-times dist/ entorb@entorb.net:html/eta-vue/
