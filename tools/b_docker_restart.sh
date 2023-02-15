#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

$MYDIR/b_docker_disable.sh;

CONTEXT=$(docker info 2>/dev/null | grep Context | sed -e "s/.* //");
if [ "$CONTEXT" = "rootless" ] ; then
	systemctl --user start docker;
	docker context use rootless;
else
	systemctl start docker;
fi;
