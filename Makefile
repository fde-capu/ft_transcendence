
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
	./tools/c_dataclean.sh

re : clean fclean install all

install :
	cd frontend && npm install
	cd backend && npm install
