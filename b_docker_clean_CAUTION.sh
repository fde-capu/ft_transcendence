#!/bin/sh

set -x;
[ "$(docker ps -aq)" != "" ] && docker container rm -f $(docker ps -aq);
[ "$(docker images -aq)" != "" ] && docker rmi -f $(docker images -aq);
docker system prune;
docker builder prune -y --all
docker images prune -y;
docker images -a;
docker ps -a;
./b_docker_restart.sh
