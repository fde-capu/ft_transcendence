#!/bin/sh

set -x;
[ "$(docker ps -aq)" != "" ] && docker container rm -f $(docker ps -aq);
[ "$(docker images -aq)" != "" ] && docker rmi -f $(docker images -aq);
docker system prune;
docker images prune;
docker images -a;
docker ps -a;
