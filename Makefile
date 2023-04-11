.PHONY: all re fclean clean test database backend frontend adminer redb reback

all : dev

dev :
	docker compose -f docker-compose.development.yaml up --build

build :
	docker compose up --build

production :
	docker compose up --build

clean :
	docker compose down

fclean : clean
	# Reset database (sudo because of user):
	sudo rm -rf database/pgdata/

ffclean: fclean
	sudo rm -rf backend/dist
	sudo rm -rf backend/node_modules
	sudo rm -rf frontend/dist
	sudo rm -rf frontend/node_modules
	sudo rm -rf frontend/.angular
	cd frontend && \
		rm -f package-lock.json
	cd backend && \
		rm -f package-lock.json

fffclean: ffclean
	./tools/b_docker_clean_CAUTION.sh
	./tools/b_docker_restart.sh

re : fclean all
fre : re
ffre : ffclean install all
fffre : fffclean install all

install :
	cd frontend && npm install
	cd backend && npm install

database :
	docker compose up --build database
redb :
	sudo rm -rf database/pgdata/
	docker compose up --build database
itdb:
	docker exec -it database /bin/bash

backend :
	docker compose up --build backend
reback :
	sudo rm -rf backend/dist
	sudo rm -rf backend/node_modules
	cd backend && npm install
	docker compose up --build backend
itback:
	docker exec -it backend /bin/bash

frontend :
	docker compose up --build frontend

adminer :
	docker compose up --build adminer

db:database
back:backend
front:frontend
