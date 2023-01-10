#!/bin/sh

out="$(sudo ls ./vol_database)";
echo -n "vol_database: ";
[ "$out" != "" ] && echo "\n$out" || echo "empty.";
