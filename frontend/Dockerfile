FROM node:latest AS development
VOLUME ["/app"]
HEALTHCHECK --interval=15s --timeout=2s --start-period=60s \
    CMD curl http://localhost:4200 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run watch"]

FROM node:latest AS build
COPY . /build
WORKDIR /build
RUN npm ci && \
    npm run build

FROM nginx:1.17.1-alpine AS production
COPY --from=build /build/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/frontend /usr/share/nginx/html
HEALTHCHECK --interval=15s --timeout=2s --start-period=5s \
    CMD curl http://localhost:4200 || exit 1

EXPOSE 4200
