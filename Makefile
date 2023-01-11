
.PHONY: all re fclean clean test

all : dev
	docker compose up --build

dev :
	set FTT_MODE = development
	docker compose up --build

build :
	set FTT_MODE = build
	docker compose up --build

production :
	set FTT_MODE = production
	docker compose up --build

clean :
	docker compose down

fclean : clean
	./tools/c_dataclean.sh

re : clean fclean all
