#!/bin/sh
# XXX put all to true
do_apt_update="false";
do_apt_upgrade="false";
reinstall_npm="false";
docker_clean_containers="true";
docker_clean_images="false";
docker_image_prune="false";
docker_system_prune="false";
reinstall_containerd_docker_ce="false";
install_dependencies="false";
clean_database="true"; # Resets pulled git vol_database.

do_docker_stop()
{
	systemctl --user stop docker 2> /dev/null;
	sudo systemctl stop docker.service 2> /dev/null;
	systemctl --user daemon-reload 2> /dev/null;
	sudo systemctl disable --now docker.service docker.socket;
	return 0;
}

	set -x;

	[ "$docker_clean_containers" = "true" ] && \
		[ "$(docker ps -aq)" != "" ] && \
		docker container rm -f $(docker ps -aq) 2>/dev/null;
	[ "$docker_clean_images" = "true" ] && \
		[ "$(docker images -aq)" != "" ] && \
		docker rmi $(docker images -aq);
	[ "$docker_system_prune" = "true" ] && docker system prune -y;
	[ "$docker_image_prune" = "true" ] && docker image prune -y;
	[ "$reinstall_containerd_docker_ce" = "true" ] && \
		sudo apt install -y containerd.io docker-ce;

	do_docker_stop;

	[ "$do_apt_update" = "true" ] && sudo apt update;
	[ "$do_apt_upgrade" = "true" ] && sudo apt -y upgrade && sudo apt -y autoremove;
	if [ "$reinstall_npm" = "true" ] ; then
		sudo apt install -y npm;
		sudo npm install -g n;
		sudo n stable;
		sudo npm install -g npm@latest;
		sudo npm install -g @nestjs/cli@latest;
	fi;

	[ "$clean_database" = "true" ] && sudo rm -rf vol_database;

	if [ "$install_dependencies" = "true" ] ; then

		sudo dpkg --configure -a
		sudo apt install -y docker-compose-plugin;

# For docker-compose in rootless mode:
		sudo apt install -y uidmap; # updates even if already installed.
# Script to check user subordinates:
		subuid=`grep ^$(whoami): /etc/subuid | awk -F ":" '{print $3}'`;
		[ "$subuid" -lt "65536" ] && echo "Subordinate uid $subuid fail." && exit 1;
		subgid=`grep ^$(whoami): /etc/subgid | awk -F ":" '{print $3}'`;
		[ "$subgid" -lt "65536" ] && echo "Subordinate gid $subgid fail." && exit 2;
# Needed by rootless:
		sudo apt install -y dbus-user-session;
		sudo apt install -y fuse-overlayfs; # recomended
# Rootless docker requires version of slirp4netns greater than v0.4.0 \
# (when vpnkit is not installed). Check you have this with
#	slirp4netns --version
# If you do not have this download and install with \
#	sudo apt install -y slirp4netns
# Script to check about this:
		vp1=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $1}'`;
		vp2=`slirp4netns --version | awk '{print $3}' | awk -F "." '{print $2}'`;
		[ "$vp1" -gt "0" ] && need_install="false" ||
			[ "$vp2" -ge "4" ] && need_install="false" ||
				need_install="true";
		[ "$need_install" = "true" ] && sudo apt install -y slirp4netns;

		[ "$reinstall_containerd_docker_ce" = "true" ] && \
			rm -f ~/.config/systemd/user/docker.service;

# Run
#	dockerd-rootless-setuptool.sh install
# as a non-root user to set up the daemon. If this fails, run
#	sudo apt install -y docker-ce-rootless-extras
# Script to do so:
		dockerd-rootless-setuptool.sh install 2>/dev/null || \
			(sudo apt install -y docker-ce-rootless-extras && \
				dockerd-rootless-setuptool.sh --force install);

	fi;

# The systemd unit file is installed as ~/.config/systemd/user/docker.service.
	systemctl --user start docker
	docker context use rootless

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

set +x;
echo 'Success!'
