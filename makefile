# cmd
build:
	docker build -f ./config/debian.dockerfile -t "angie:debian" .
curl:
	curl -I localhost:8080
up:
	docker-compose -f ./config/compose.yml up
exec:
	docker-compose -f ./config/compose.yml exec angie bin/bash
stop:
	docker-compose -f ./config/compose.yml stop
down:
	docker-compose -f ./config/compose.yml down
