dev:
	cp .env.develop .env
	yarn cache clean &&	yarn dev

dev-neon: 
	cp .env.develop-neon .env
	yarn cache clean &&	yarn dev