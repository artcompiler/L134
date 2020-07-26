

default: build start

build:
	npm run build

start: build
	npm start

test:
	npm run test

clean:
	rm -rf lib pub node_modules

.PHONY: build test
