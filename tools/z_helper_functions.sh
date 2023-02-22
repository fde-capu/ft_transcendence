#!/bin/sh

ask()
{
	echo -n "$1 [y/N] ";
	read answer;
	[ "$answer" != "${answer#[Yy]}" ] && return 0;
	return 1;
}
