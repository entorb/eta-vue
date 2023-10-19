#!/bin/sh

# ensure we are in the root dir
script_dir=$(cd $(dirname $0) && pwd)
cd $script_dir/..

rsync -rvhu --delete --no-perms dist/* entorb@entorb.net:html/eta-vue/
