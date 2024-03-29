#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
. $MYDIR/z_helper_functions.sh --source-only

ask "Say 'GOOD-BYE' to DOCKER CACHE on your ENTIRE SYSTEM?" || exit;
set -x;
[ "$(docker ps -aq)" != "" ] && docker container rm -f $(docker ps -aq);
[ "$(docker images -aq)" != "" ] && docker rmi -f $(docker images -aq);
docker system prune;
docker builder prune -y --all
docker images prune -y;
docker images -a;
docker ps -a;
