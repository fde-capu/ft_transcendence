#!/bin/sh

set -x;
docker container rm -f $(docker ps -aq) 2>/dev/null;
docker rmi $(docker images -aq) 2>/dev/null;
docker system prune -y 2>/dev/null;
docker images prune -y;
docker images -a;
docker ps -a;
