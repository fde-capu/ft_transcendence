Open the file to check comments, and run:
	`./prerequisites.sh`

Cross your fingers and run:
	`docker compose up --build`

While the containers are running, interact with them:
	`docker exec -it ftt_backend /bin/sh`
	`docker exec -it ftt_frontend /bin/sh`
	`docker exec -it ftt_database /bin/sh`

Finally:
	`docker compose down`
