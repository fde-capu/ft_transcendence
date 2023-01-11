FROM node:lts-slim AS development
VOLUME ["/app"]
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=30s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run start:dev"]

FROM node:lts-slim AS build
COPY . /build
WORKDIR /build
RUN npm ci && \
    npm run build && \
    npm prune --omit=dev && \
    rm ./dist/tsconfig.build.tsbuildinfo && \
    mv ./node_modules ./dist/node_modules

FROM node:lts-slim AS production
COPY --from=build /build/dist /dist
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=10s --timeout=2s --retries=2 --start-period=5s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /dist
CMD ["main.js"]

EXPOSE 3000
