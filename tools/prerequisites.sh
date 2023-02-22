#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
. $MYDIR/z_helper_functions.sh --source-only

	[ "$(docker ps -aq)" != "" ] && \
		ask "Clean docker containers?" && \
		docker container rm -f $(docker ps -aq) 2>/dev/null;
	[ "$(docker images -aq)" != "" ] && \
		ask "Clean docker images?" && \
		docker rmi $(docker images -aq);
	ask "Prune docker system?" && docker system prune;
	ask "Prune docker images?" && docker image prune;
	ask "Reinstall containerd?" && \
		rm -rf ~/.docker && \
		sudo apt install -y containerd.io docker-ce;
	ask "Stop docker service?" && systemctl stop docker;

	ask "Do apt update?" && sudo apt update;
	ask "Do apt upgrade (system wide)?" && sudo apt upgrade && \
		ask "Do apt autoremove?" && sudo apt autoremove;

	ask "Run npm check for latest stable?" && $MYDIR/npm_check.sh

	ask "Reset ft_transcendence project database?" && $MYDIR/c_dataclean.sh;

	if ask "Install dependencies for rootless docker?" ; then

		ask "Reconfigure dpkg?" && sudo dpkg --configure -a;
		ask "Reinstall docker?" && sudo apt install -y docker;
		ask "Reinstall docker-compose-plugin?" && sudo apt install -y docker-compose-plugin;

# For docker-compose in rootless mode:
		ask "Update (or install) uidmap?" && sudo apt install -y uidmap; # updates even if already installed.
# Script to check user subordinates:
		subuid=`grep ^$(whoami): /etc/subuid | awk -F ":" '{print $3}'`;
		[ "$subuid" -lt "65536" ] && echo "Subordinate uid $subuid fail." && exit 1;
		subgid=`grep ^$(whoami): /etc/subgid | awk -F ":" '{print $3}'`;
		[ "$subgid" -lt "65536" ] && echo "Subordinate gid $subgid fail." && exit 2;
# Needed by rootless:
		ask "Install/check dbus-user-session? (Needed by rootless)" && sudo apt install -y dbus-user-session;
# TODO? Run docker with overlay2 instead (recomended/supported by Docker EE, by current Docker official documentation):
		ask "Install/check fuse-overlayfs? (Recomended by rootless)" && sudo apt install -y fuse-overlayfs; # recomended to use some overlay fs.
# Rootless docker requires version of slirp4netns greater than v0.4.0 \
# (when vpnkit is not installed). Check you have this with
#	slirp4netns --version
# If you do not have this download and install with \
#	sudo apt install -y slirp4netns
# Script to do whats described above:
		vp1=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $1}'`;
		vp2=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $2}'`;
		[ "$vp1" -gt "0" ] && need_install="false" ||
			[ "$vp2" -ge "4" ] && need_install="false" ||
				need_install="true";
		[ "$need_install" = "true" ] && \
			ask "You need to install slirp4netns >= 0.4.0. It is needed by rootless docker. Do it?" && \
			sudo apt install -y slirp4netns;

		ask "Reset containerd_docker_ce services?" && rm -f ~/.config/systemd/user/docker.service;

# Run
#	dockerd-rootless-setuptool.sh install
# as a non-root user to set up the daemon. If this fails, run
#	sudo apt install -y docker-ce-rootless-extras
# Script to do so:
		if ask "Run dockerd-rootless-setuptool.sh?" ; then
			dockerd-rootless-setuptool.sh install 2>/dev/null || \
				(ask "...it failed. You might need docker-ce-rooless-extras. Install it?" && \
					sudo apt install -y docker-ce-rootless-extras && \
					dockerd-rootless-setuptool.sh --force install);
		fi;

	fi;

# The systemd unit file is installed as ~/.config/systemd/user/docker.service.
	ask "Start rootless docker?" && systemctl --user start docker && docker context use rootless

# For more...
# - Use the rootless Daemon on your system startup
# - Client problem (like not having DOCKER_HOST set)
# - Rootless Docker in Docker
# - Expose Docker API socket through TCP
# - Expose Docker API socket through SSH
# - Routing ping packets
# - Exposing privileged ports
# - Limiting resources
# - Limiting resources without cgroup
# - Troubleshooting errors on daemon or network
# ...please refer to:
# https://docs.docker.com/engine/security/rootless

echo 'Done!'
