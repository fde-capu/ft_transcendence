.PHONY: all re fclean clean test

all : dev

dev :
	export FTT_MODE="development"; \
	docker compose up --build

build :
	export FTT_MODE="build"; \
	docker compose up --build

production :
	export FTT_MODE="production"; \
	docker compose up --build

clean :
	docker compose down

fclean : clean
	# Reset database, dist and node_modules etc.:
	./tools/c_dataclean.sh

ffclean: fclean
	cd frontend && \
		rm -f package-lock.json
	cd backend && \
		rm -f package-lock.json

fffclean: ffclean
	./tools/b_docker_clean_CAUTION.sh
	./tools/b_docker_restart.sh

re : fclean install all
fre : ffre
ffre : ffclean install all
fffre : fffclean install all

install :
	cd frontend && npm install
	cd backend && npm install
