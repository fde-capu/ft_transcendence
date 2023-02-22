#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

sudo chown $(whoami) $FTTDIR/database/data \
	|| echo "database/data appears to be unexistent."
