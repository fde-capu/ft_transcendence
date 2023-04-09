FROM node:lts AS development
WORKDIR /app
RUN apt-get update && \
    apt-get install -y gettext-base
ENTRYPOINT ["bash", "-c", "envsubst < ./src/environments/environment.ts > ./src/environments/environment.development.ts && npm run start:dev"]

FROM node:lts-slim AS build
ARG BACKEND_URL
COPY . /build
WORKDIR /build
RUN apt-get update && \
    apt-get install -y gettext-base && \
    envsubst \
    < ./src/environments/environment.ts \
    > ./src/environments/environment.production.ts && \
    npm i && npm run build && npm prune --omit=dev

FROM nginx:stable-alpine AS production
RUN apk update && \
    apk add curl
COPY --from=build ./build/nginx.conf /etc/nginx/nginx.conf
COPY --from=build ./build/dist/frontend /usr/share/nginx/html
HEALTHCHECK --interval=15s --timeout=5s --retries=2 --start-period=10s \
    CMD curl http://localhost:4200 || exit 1
