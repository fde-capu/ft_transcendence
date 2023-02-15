#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

OLD_CONTEXT=$(docker info 2>/dev/null | grep Context | sed -e "s/.* //");

$MYDIR/b_docker_disable.sh;

if [ "$OLD_CONTEXT" = "rootless" ] ; then
	docker context use default;
	systemctl start docker;
else
	docker context use rootless;
	systemctl --user start docker;
fi;
