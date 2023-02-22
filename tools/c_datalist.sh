#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

$MYDIR/c_dataown.sh

out="$(sudo ls $FTTDIR/database/data)";
echo -n "data: ";
[ "$out" != "" ] && echo "\n$out" || echo "empty.";
