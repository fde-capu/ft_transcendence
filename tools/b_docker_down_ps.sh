#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";

set -x;
[ "$(docker ps -aq)" != "" ] && docker container rm -f $(docker ps -aq);
docker ps -a;
