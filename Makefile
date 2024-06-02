inject-dev: 
	cp .env.develop .env
inject-dev-neon: 
	cp .env.develop-neon .env

dev:
	cp .env.develop .env
	yarn cache clean &&	yarn dev

dev-neon: 
	cp .env.develop-neon .env
	yarn cache clean &&	yarn dev