FROM node:lts-slim AS development
VOLUME ["/app"]
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=30s \
    CMD curl http://localhost:4200 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run watch"]

FROM node:lts-slim AS build
COPY . /build
WORKDIR /build
RUN npm ci && \
    npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /build/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/frontend /usr/share/nginx/html
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=5s \
    CMD curl http://localhost:4200 || exit 1
EXPOSE 4200
