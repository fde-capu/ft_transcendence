FROM node:lts-slim AS development
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=30s \
    CMD curl http://localhost:4200 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run start:dev"]

FROM node:lts-slim AS build
COPY . /build
WORKDIR /build
#RUN npm ci
RUN npm run build
RUN npm prune --omit=dev
RUN npm run start:prod

FROM nginx:stable-alpine AS production
RUN apt-get update && apt-get install -y curl
COPY --from=build ./build/nginx.conf /etc/nginx/nginx.conf
COPY --from=build ./build/dist/frontend /usr/share/nginx/html
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=5s \
    CMD curl http://localhost:4200 || exit 1

#EXPOSE 4200
