#!/bin/sh
skip_apt_update="false";
skip_apt_upgrade="false";
docker_clean_containers="true";
docker_clean_images="true";
docker_system_prune="true";
reinstall_conteinerd_docker_ce="true";
remove_previous_docker_service="true";
docker_stop="true";
no_sudo="true";

if [ "$no_sudo" != "true" ] ; then

	set -x;

	[ "$skip_apt_update" != "true" ] && sudo apt-get update;
	[ "$skip_apt_upgrade" != "true" ] && sudo apt-get upgrade;
	[ "$docker_clean_containers" = "true" ] && \
		docker container rm -f $(docker ps -aq) 2>/dev/null;
	[ "$docker_clean_images" = "true" ] && docker rmi $(docker images -aq) 2>/dev/null;
	[ "$docker_system_prune" = "true" ] && docker system prune -y 2>/dev/null;
	[ "$reinstall_conteinerd_docker_ce" = "true" ] && \
		sudo apt-get purge -y containerd.io docker-ce && \
		sudo apt-get install -y containerd.io docker-ce;
	[ "$remove_previous_docker_service" = "true" ] && \
		sudo systemctl stop docker.service && \
		sudo rm -rf ~/.config/systemd/user/default.target.wants && \
		sudo rm -f ~/.config/systemd/user/docker.service
	[ "$docker_stop" = "true" ] && sudo systemctl stop docker;

# For docker-compose in rootless mode:
# Source: https://docs.docker.com/engine/security/rootless
		sudo apt-get install -y uidmap; # updates even if already installed.
# Script to check user subordinates:
		subuid=`grep ^$(whoami): /etc/subuid | awk -F ":" '{print $3}'`;
		[ "$subuid" -lt "65536" ] && echo "Subordinate uid $subuid fail." && exit 1;
		subgid=`grep ^$(whoami): /etc/subgid | awk -F ":" '{print $3}'`;
		[ "$subgid" -lt "65536" ] && echo "Subordinate gid $subgid fail." && exit 2;
# Needed by rootless:
		sudo apt-get install -y dbus-user-session;
		sudo apt-get install -y fuse-overlayfs; # recomended
# Rootless docker requires version of slirp4netns greater than v0.4.0 \
# (when vpnkit is not installed). Check you have this with
#	slirp4netns --version
# If you do not have this download and install with \
#	sudo apt-get install -y slirp4netns
# Script to check about this:
		vp1=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $1}'`;
		vp2=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $2}'`;
		[ "$vp1" -gt "0" ] && need_install="false" ||
			[ "$vp2" -ge "4" ] && need_install="false" ||
				need_install="true";
		[ "$need_install" = "true" ] && sudo apt-get install -y slirp4netns;

# Run
#	dockerd-rootless-setuptool.sh install
# as a non-root user to set up the daemon. If this fails, run
#	sudo apt-get install -y docker-ce-rootless-extras
# Script to do so:
		dockerd-rootless-setuptool.sh install 2>/dev/null || \
			(sudo apt-get install -y docker-ce-rootless-extras && \
				dockerd-rootless-setuptool.sh --force install || \
					(echo "docker-ce-rootless-extras failed." && exit 3));
# The systemd unit file is installed as ~/.config/systemd/user/docker.service.
		systemctl --user start docker
		docker context use rootless

else

	set -x;

	[ "$docker_clean_containers" = "true" ] && \
		docker container rm -f $(docker ps -aq) 2>/dev/null;
	[ "$docker_clean_images" = "true" ] && docker rmi $(docker images -aq) 2>/dev/null;
	[ "$docker_system_prune" = "true" ] && docker system prune -y 2>/dev/null;
	[ "$reinstall_conteinerd_docker_ce" = "true" ] && \
		apt-get purge -y containerd.io docker-ce && \
		apt-get install -y containerd.io docker-ce;
	[ "$remove_previous_docker_service" = "true" ] && \
		systemctl stop docker.service && \
		rm -rf ~/.config/systemd/user/default.target.wants && \
		rm -f ~/.config/systemd/user/docker.service
	[ "$docker_stop" = "true" ] && systemctl stop docker;
		apt-get install -y uidmap; # updates even if already installed.
		subuid=`grep ^$(whoami): /etc/subuid | awk -F ":" '{print $3}'`;
		[ "$subuid" -lt "65536" ] && echo "Subordinate uid $subuid fail." && exit 1;
		subgid=`grep ^$(whoami): /etc/subgid | awk -F ":" '{print $3}'`;
		[ "$subgid" -lt "65536" ] && echo "Subordinate gid $subgid fail." && exit 2;
		apt-get install -y dbus-user-session;
		apt-get install -y fuse-overlayfs; # recomended
		vp1=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $1}'`;
		vp2=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $2}'`;
		[ "$vp1" -gt "0" ] && need_install="false" ||
			[ "$vp2" -ge "4" ] && need_install="false" ||
				need_install="true";
		[ "$need_install" = "true" ] && apt-get install -y slirp4netns;
		dockerd-rootless-setuptool.sh install 2>/dev/null || \
			(apt-get install -y docker-ce-rootless-extras && \
				dockerd-rootless-setuptool.sh --force install || \
					(echo "docker-ce-rootless-extras failed." && exit 3));
		systemctl --user start docker
		docker context use rootless

fi;

# For more:
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

exit 0;
