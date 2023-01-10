#!/bin/sh
sleep 240
while true
do
	sleep 3
	for inspect in "$@"
	do
		if ! pgrep "$inspect" >> /dev/null ;
		then
			exit 1
		fi
	done
done
exit 2
