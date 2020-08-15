up:
		docker-compose up -d --build
		$(info ************  [Iniciando Projeto] ************)

.PHONY: down
down:
		docker-compose down

.PHONY: stop
stop:
		docker-compose stop

.PHONY: logs
logs:
		docker-compose logs -f