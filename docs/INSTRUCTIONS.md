## Get the `.env` file with and put on ft_transcence directory.
## Cross your fingers and run:
	`docker compose up --build`
### or, while testing:
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

## Random scrap notes:

Post curl:
curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' http://0.0.0.0:3490/quotes --data '{"quote":"God is dead.","author":"Nietzsche"}'
curl -H "Content-Type: application/json" --request POST --data '{"abc":"123"}' http://0.0.0.0:3490/users
