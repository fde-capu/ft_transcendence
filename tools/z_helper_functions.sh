#!/bin/sh

ask()
{
	echo -n "$1 [y/N] ";
	read answer;
	[ "$answer" != "${answer#[Yy]}" ] && return 0;
	return 1;
}

do_docker_stop()
{
	systemctl --user stop docker 2> /dev/null;
	sudo systemctl stop docker.service 2> /dev/null;
	systemctl --user daemon-reload 2> /dev/null;
	sudo systemctl disable --now docker.service docker.socket;
	return 0;
}
