#!/bin/sh

	systemctl --user stop docker 2> /dev/null;
	sudo systemctl stop docker.service 2> /dev/null;
	systemctl --user daemon-reload 2> /dev/null;
	sudo systemctl disable --now docker.service docker.socket;
	systemctl --user start docker
	docker context use rootless
