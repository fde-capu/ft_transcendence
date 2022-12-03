## By the time of developing:
# node:current-slim = 19.2-bullseye-slim
# postgres:latest = 15.1-bullseye
# latest stable node: 18.12.1
# latest stable npm: 9.1.3
# latest stable psql inside container: 15.1 (Debian 51.1-1.pgdg110+1)

### VM issues:
## Enable PAE/NX to validate apt-get hashes.
## To use a VM shared folder:
	`sudo adduser user42 vboxsf`
#	...then logout and login.
	`cd /mnt/ft_transcendence`
#	...then go with the ssh key, and git configuration.
# But this it not good, becase versioning outside and inside VM are different
# for npm, nest etc..

### Open the file to check comments about docker rootless mode, and run:
	`./prerequisites.sh`
## Cross your fingers and run:
	`docker compose up --build`
## or, while testing:
	`docker compose up --build --force-recreate`

### You can check the open ports connection by the rootlesskit with:
	`ss -tnlp` or `netstat -tnlp`

### While the containers are running, interact with them:
	`docker exec -it ftt_backend /bin/sh`
	`docker exec -it ftt_frontend /bin/sh`
	`docker exec -it ftt_database /bin/sh`

### Finally, hit Ctrl+C or:
	`docker compose down`

### NOTES

- Subject states `docker-compose` but its obsolete, and `docker compose` is
  latest stable release. Both work, by the way.

- It is possible to work via ssh on the VM. Setup NAT ports, sshd on VM, then
	- Start VM on background:
		`virtualboxvm --startvm user42@42saopaulo --separate`
	...	if you want, you can close the GUI window and choose
		"continue running in background".
	- Login:
		`ssh user42@127.0.0.1 -p 2222`

### QUESTIONS

- "sh: 1: nest: not found":
Why do I need to npm install @nestjs/cli? Does not it comes with nestjs/schematics?
Even on nestjs/cli..?

## Random scrap notes:

docker compose up --build --force-recreate
docker exec -it ftt_backend /bin/sh

(Example:)
nest new bookstore-nest
cd bookstore-nest
npm run start
nest generate module books
nest generate controller books
...and follow https://www.digitalocean.com/community/tutorials/getting-started-with-nestjs
...or other building tutorial.


https://geshan.com.np/blog/2021/01/nodejs-postgresql-tutorial/
https://geshan.com.np/blog/2021/12/docker-postgres/
