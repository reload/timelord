create-config:
	cp ./docker/example.timelord.env ./docker/timelord.env && \
	cp ./docker/example.harvester.env ./docker/harvester.env

up:
	docker-compose up