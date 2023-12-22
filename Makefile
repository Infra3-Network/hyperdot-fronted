VERSION ?= $(shell git rev-parse --short HEAD)
HTTP_PROXY ?= $(http_proxy)
HTTPS_PROXY ?= $(https_proxy)
PROXY_PASS ?= $(proxy_pass)

# .PHONY: dotest
# dotest:
# 	@echo $(PROXY_PASS)

.PHONY: build/docker
build/docker: ## Build the docker image.
	DOCKER_BUILDKIT=1 \
	docker build \
		-f ./docker/Dockerfile \
		-t hyperdot/fronted:$(VERSION) \
		--build-arg "HTTP_PROXY=$(HTTP_PROXY)" \
		--build-arg "HTTPS_PROXY=$(HTTPS_PROXY)" \
		.

.PHONY: up
up: ## Run the docker image.
	docker run \
		-d \
		--name hyperdot-frontend \
		-e COMMAN=run \
		-e PROXY_PASS=$(PROXY_PASS) \
		-p 8000:80 \
		hyperdot/fronted:$(VERSION)

.PHONY: start
start: ## start the docker image.
	docker start hyperdot-frontend

.PHONY: stop
stop: ## Stop the docker image.
	docker stop hyperdot-frontend

.PHONY: rm
rm: ## Remove the docker image.
	docker rm hyperdot-frontend

.PHONY: logs
logs: ## Show the docker logs.
	docker logs hyperdot-frontend

.PHONY: test
test: ## Run the tests.
	docker run \
		--rm \
		-ti \
		-e COMMAND=test \
		hyperdot/fronted:$(VERSION)