
.PHONY: all re fclean clean test

all :
	docker compose up --build

clean :
	docker compose down

fclean : clean
	./tools/c_dataclean.sh

re : clean fclean all
