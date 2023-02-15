#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
. $MYDIR/z_helper_functions.sh --source-only
do_docker_stop;
