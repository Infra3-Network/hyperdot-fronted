VERSION ?= $(shell git rev-parse --short HEAD)
HTTP_PROXY ?= "http://192.168.1.5:17890"
HTTPS_PROXY ?= "http://192.168.1.5:17890"

.PHONY: build/docker
build/docker: ## Build the docker image.
	DOCKER_BUILDKIT=1 \
	docker build \
		-f ./Dockerfile \
		-t hyperdot/fronted:$(VERSION) \
		--build-arg "HTTP_PROXY=$(HTTP_PROXY)" \
		--build-arg "HTTPS_PROXY=$(HTTPS_PROXY)" \
		.
