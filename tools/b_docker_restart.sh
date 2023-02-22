#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

$MYDIR/b_docker_disable.sh;

systemctl stop docker
systemctl start docker
