#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

$MYDIR/b_docker_disable.sh;
systemctl --user start docker;
docker context use rootless;
systemctl --user start docker;
