## By the time of developing, lastest stables:
# VM
# - Linux 42saopaulo 5.15.0-56-generic #62~20.04.1-Ubuntu SMP x86_64 GNU/Linux
#   Docker version 20.10.21, build 3056208
#   Unsing `n stable`:
#   node: 18.12.1
#   npm: 9.1.3
#   compose.cli.docker_client.get_client: docker-compose version 1.29.2, build 5becea4c
#   docker-py version: 5.0.0
#   CPython version: 3.7.10
#   OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019
# node:current-slim = 19.2-bullseye-slim
# - Linux 60931926b714 5.15.0-56-generic #62~20.04.1-Ubuntu SMP x86_64 GNU/Linux
#    node: 19.2.0
#    npm: 8.19.3
# postgres:latest = 15.1-bullseye
# - Linux 4ee7f68b3d2f 5.15.0-56-generic #62~20.04.1-Ubuntu SMP x86_64 GNU/Linux
#    psql: 15.1 (Debian 51.1-1.pgdg110+1)

### VM issues:
## Enable PAE/NX to validate apt-get hashes.
## Found no use in sharing an external folder:
# Versioning outside and inside VM are different
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
https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe
https://www.freecodecamp.org/news/build-web-apis-with-nestjs-beginners-guide/
https://progressivecoder.com/how-to-implement-nestjs-passport-authentication-using-local-strategy/
https://www.techiediaries.com/nestjs-tutorial-jwt-authentication/

Post curl:
curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://0.0.0.0:3490/quotes --data '{"quote":"God is dead.","author":"Nietzsche"}'

curl -H "Content-Type: application/json" --request POST --data '{"abc":"123"}' http://0.0.0.0:3490/users

-- to-dos next:
Persistent Database
Intra API integration
HTML designs+funcionalities:
  top bar with user menus:
    (shows) user's avatar horizontal
	my profile
	create match
	online users
	chat creation > chat-admin configure
  real-time avatar showing status:
    online, offline, in a game
    invite for a game
    go to profile
  user profile page (private), with blocks/pages:
	change avatar
	change screen name
	friends list
	enable two-factor authentication
	statistics:
	  wins/looses
	  score
	  ranking..? achievments..?
	  match history summary
  public user profile page (only to logged users):
	real-time avatar
	screen name
    actions:
	  add as friend
	  block
	friends list..?
	anything under statistics
  online users page:
    list of everyone so one can visit their public profile
  chat:
	public chat:
	  main screen:
	    text
        logged users avatars list (repeat real-time avatar, smaller)
	  admin main screen:
	    text
        logged users avatars list with option to:
	      set/unset as administrator 
		  ban user
		  mute user for amount of time
		chat configure screen:
		  set/change/remove password for room
		  invite user
    private chat:
	  same as public chat, but with auto password initialy
  create match screen:
    random player
	specific player (as from "invite for a game")
	any customization of choice
	screen must be responsive
  current running games screen:
    click to watch any
  game screen
  matchmaking system
  game engine
  



-- FINISHING INSTRUCTIONS:
# 1) remove .env (save elsewhere) from Git repository, add to .gitignore.
