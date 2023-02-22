#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
FTTDIR="$MYDIR/..";

sudo rm -rf $FTTDIR/database/data/

sudo rm -rf $FTTDIR/backend/dist
sudo rm -rf $FTTDIR/backend/node_modules

sudo rm -rf $FTTDIR/frontend/dist
sudo rm -rf $FTTDIR/frontend/node_modules
sudo rm -rf $FTTDIR/frontend/.angular
